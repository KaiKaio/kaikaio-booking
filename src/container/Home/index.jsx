import React, { useEffect, useRef, useState } from 'react'
import { Icon, Pull } from 'zarm'
import dayjs from 'dayjs'
import PopupType from '@/components/PopupType'
import PopupDate from '@/components/PopupDate'
import PopupAddBill from '@/components/PopupAddBill'
import BillItem from '@/components/BillItem'
import Empty from '@/components/Empty'
import CustomIcon from '@/components/CustomIcon'
import { REFRESH_STATE, LOAD_STATE } from '@/utils'
import axios from '@/utils/axios'
import { get } from '@/utils'

import s from './style.module.less'

const Home = () => {
  const pullRef = useRef();

  const typeRef = useRef(); // 账单类型 ref
  const monthRef = useRef(); // 月份筛选 ref
  const addRef = useRef(); // 添加账单 ref
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [currentSelect, setCurrentSelect] = useState({}); // 当前筛选类型
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM-DD')); // 当前筛选时间
  const [page, setPage] = useState(1); // 分页
  const [list, setList] = useState([]); // 账单列表
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态
  const [icons, setIcons] = useState({}); // 上拉加载状态

  useEffect(() => {
    getBillList() // 初始化
  }, [page, currentSelect, currentTime])

  useEffect(() => {
    get('/api/type/list').then((res) => {
      const { data: { list = [] } } = res
      const iconsMap = {};
      if (!list?.length) {
        return
      }
      list.forEach(item => {
        iconsMap[item.id] = item.icon;
      });
      setIcons(iconsMap)
    });
  }, [])

  const getBillList = async () => {
    const { data } = await axios({
      url: '/api/bill/list',
      params: {
        start: dayjs(currentTime).startOf('month').format('YYYY-MM-DD') + ' 00:00:00',
        end: dayjs(currentTime).endOf('month').format('YYYY-MM-DD') + ' 23:59:59',
        type_id: currentSelect.id,
        page: page,
        page_size: 999
      }
    })

    // 下拉刷新，重制数据
    if (page == 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }

    // 计算总支出
    const expenseTotal = data.list.reduce((total, item) => {
      const itemSum = item?.bills.reduce((CTotal, CItem) => {
        return CTotal + (CItem.pay_type === '1' ? (CItem.amount / 1) : 0)
      }, 0)
      return total + itemSum
    }, 0)
    
    // // 计算总支出
    const incomeTotal = data.list.reduce((total, item) => {
      const itemSum = item?.bills.reduce((CTotal, CItem) => {
        return CTotal + (CItem.pay_type === '2' ? (CItem.amount / 1) : 0)
      }, 0)
      return total + itemSum
    }, 0)

    setTotalExpense(expenseTotal.toFixed(2));
    setTotalIncome(incomeTotal.toFixed(2));
  
    setTotalPage(data.totalPage);
    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  }

  // 请求列表数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    };
  };

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }

  // 添加账单弹窗
  const toggle = () => {
    typeRef.current && typeRef.current.show()
  };
  // 选择月份弹窗
  const monthToggle = () => {
    monthRef.current && monthRef.current.show()
  };
  // 添加账单弹窗
  const addToggle = () => {
    addRef.current && addRef.current.show()
  }

  // 筛选类型
  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentSelect(item)
  }
   // 筛选月份
   const selectMonth = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item)
  }

  return <div className={s.home}>
    <div className={s.header}>
      <div className={s.dataWrap}>
        <span className={s.expense}>总支出：<b>¥ { totalExpense }</b></span>
        <span className={s.income}>总收入：<b>¥ { totalIncome }</b></span>
      </div>
      <div className={s.typeWrap}>
        <div className={s.left} onClick={toggle}>
          <span className={s.title}>{ currentSelect.name || '全部类型' } <Icon className={s.arrow} type="arrow-bottom" /></span>
        </div>
        <div className={s.right}>
          <span className={s.time} onClick={monthToggle}>{ currentTime }<Icon className={s.arrow} type="arrow-bottom" /></span>
        </div>
      </div>
    </div>
    <div className={s.contentWrap}>
      <Pull
        className={s.pullList}
        ref={pullRef}
        refresh={{
          state: refreshing,
          handler: refreshData,
        }}
        load={{
          state: loading,
          distance: 200,
          handler: loadData,
        }}
      >
        {
          list.map((item, index) => (
            <BillItem
              icons={icons}
              bill={item}
              key={item.date}
            />
          ))
        }
        {
          !list?.length && <Empty style={{height: '400px'}} />
        }
      </Pull>
    </div>
    <div className={s.add} onClick={addToggle}><CustomIcon type='icon-bianjiwenzhang_huaban' /></div>
    <PopupType ref={typeRef} onSelect={select} />
    <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    <PopupAddBill ref={addRef} onReload={refreshData} />
  </div>
};

export default Home;