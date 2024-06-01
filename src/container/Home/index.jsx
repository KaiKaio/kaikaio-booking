import React, { useEffect, useRef, useState } from 'react'
import { Icon, Pull } from 'zarm'
import dayjs from 'dayjs'
import PopupType from '@/components/PopupType'
import PopupDate from '@/components/PopupDate'
import PopupAddBill from '@/components/PopupAddBill'
import { useSelector } from 'react-redux'
import BillItem from '@/components/BillItem'
import Empty from '@/components/Empty'
import CustomIcon from '@/components/CustomIcon'
import { REFRESH_STATE, LOAD_STATE } from '@/utils'
import axios from '@/utils/axios'

import s from './style.module.less'

const Home = () => {
  const pullRef = useRef();
  const types = useSelector((state) => state.types.types)

  const typeRef = useRef(); // 账单类型 ref
  const monthRef = useRef(); // 月份筛选 ref
  const addRef = useRef(); // 添加账单 ref
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [orderBy, setOrderBy] = useState('DESC'); // 列表排序方式
  const [currentSelect, setCurrentSelect] = useState({}); // 当前筛选类型
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM-DD')); // 当前筛选时间
  const [page, setPage] = useState(1); // 分页
  const [list, setList] = useState([]); // 账单列表
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态
  const [icons, setIcons] = useState({});
  const [detail, setDetail] = useState({});

  useEffect(() => {
    getBillList() // 初始化
  }, [page, currentSelect, currentTime, orderBy])

  useEffect(() => {
    const iconsMap = {};
    if (!types?.length) {
      return
    }
    types.forEach(item => {
      iconsMap[item.id] = item.icon;
    });
    setIcons(iconsMap)
  }, [types])

  const getBillList = async () => {
    const { data } = await axios({
      url: '/api/bill/list',
      params: {
        start: dayjs(currentTime).startOf('month').format('YYYY-MM-DD') + ' 00:00:00',
        end: dayjs(currentTime).endOf('month').format('YYYY-MM-DD') + ' 23:59:59',
        type_id: currentSelect.id,
        page: page,
        orderBy,
        page_size: 20
      }
    })

    // 下拉刷新，重制数据
    if (page === 1) {
      setList(data.list);
    } else { // 上拉加载，拼接数据
      const concatList = [...list, ...data.list]
      // 请求返回的第一条数据与本地的最后一条数据 Date 字段相同，则合并此 ITEM
      const listMap = new Map()
      concatList.forEach((item) => {
        const localDateItem = listMap.get(item.date)
        if (localDateItem) {
          listMap.set(item.date, [...localDateItem, ...item.bills]);
        } else {
          listMap.set(item.date, item.bills);
        }
      })
      
      const distinctList = []
      listMap.forEach((value, key) => {
        distinctList.push({
          date: key,
          bills: value
        })
      })
      setList(distinctList);
    }

    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
  
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
  const handleChangeOrderBy = () => {
    setOrderBy(orderBy === 'DESC' ? 'ASC' : 'DESC')
    setPage(1);
  };

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
        <div className={s.left} onClick={handleChangeOrderBy}>
          <span className={s.title}>{ orderBy === 'DESC' ? '倒序' : '正序' }</span>
        </div>
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
              setDetail={setDetail}
              onReload={refreshData}
              addRef={addRef}
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
    <PopupAddBill ref={addRef} detail={detail} onReload={refreshData} setDetail={setDetail} />
  </div>
};

export default Home;