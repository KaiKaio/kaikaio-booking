import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PopupDate from "@/components/PopupDate";
import { Pull } from 'zarm';
import Empty from '@/components/Empty'
import qs from 'query-string';
import axios from '@/utils/axios'
import BillItem from '@/components/BillItem'
import { REFRESH_STATE, LOAD_STATE } from '@/utils'
import cx from 'classnames';
import dayjs from 'dayjs';
import Header from '@/components/Header';
import CustomIcon from '@/components/CustomIcon';
import PopupAddBill from '@/components/PopupAddBill'

import s from './style.module.less'

const Detail = () => {
  const monthRef = useRef();
  const pullRef = useRef();
  const dateListRef = useRef();
  const addRef = useRef();
  const location = useLocation();
  const { type_id } = qs.parse(location.search); // TPYE_ID

  const [typeItem, setTypeItem] = useState({});
  const [detailList, setDetailList] = useState({});
  const [navDates, setNavDates] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [activeDate, setActiveDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));

  const [icons, setIcons] = useState({});
  const [page, setPage] = useState(1); // 分页
  const [list, setList] = useState([]); // 账单列表
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新状态
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载状态

  const monthShow = () => {
    monthRef.current && monthRef.current.show();
  };

  const handleDateItem = (item) => {
    
  }

  const localGenerateDates = (result) => {
    if (!result) {
      return []
    }

    let dateList = ['', '']
    let cur = dayjs(result).startOf('month')
    while (cur <= dayjs().startOf('month')) {
      if (dayjs(cur).month() === 11) {
        dateList.push(cur.add(1, 'month').format('YYYY'))
      }
      dateList.push(cur.format('YYYY-MM'))
      cur = cur.add(1, 'month')
    }
    dateList = [...dateList, '', '']
    return dateList
  }

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

  const getBillList = async () => {
    const { data } = await axios({
      url: '/api/bill/list',
      params: {
        start: dayjs(activeDate).startOf('month').format('YYYY-MM-DD') + ' 00:00:00',
        end: dayjs(activeDate).endOf('month').format('YYYY-MM-DD') + ' 23:59:59',
        type_id: typeItem.id,
        page: page,
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
  
  useEffect(() => {
    axios({ url: '/api/type/list' }).then((res) => {
      const { data: { list = [] } } = res
      if (!list?.length) {
        return
      }

      const iconsMap = {};
      if (!list?.length) {
        return
      }
      list.forEach(item => {
        iconsMap[item.id] = item.icon;
      });
      setIcons(iconsMap)

      list.find(item => item.id === type_id);
      const result = list.find(item => `${item.id}` === type_id);
      setTypeItem(result)

      return axios({
        url: '/api/bill/getEarliestItemDate',
        params: { type_id: result.id }
      })
    }).then((res) => {
      const { data = '' } = res;
      const dates = localGenerateDates(data)
      setNavDates(dates)
      
      setActiveDate(dates[dates.length - 3])
    });
  }, []);

  useEffect(() => {
    if (!activeDate) {
      return
    }
    setActiveDate(activeDate)

    setTimeout(() => {
      const contentWidth = dateListRef.current.offsetWidth; // 发生滑动元素的宽
      const activeItem = document.querySelector(`.${s.active}`)
      
      const activeItemWidth = activeItem.offsetWidth; // 当前元素的宽
      const activeItemLeft = activeItem.offsetLeft; // 当前元素的到他父盒子左侧的距离
      const offset = activeItemLeft - (contentWidth - activeItemWidth) / 2; // 需要移动的位置
      dateListRef.current.scrollTo({
        top: 0,
        left: offset,
        behavior: "smooth"
      });
    }, 0)

    getBillList()
  }, [activeDate, page])

  return <div className={s.detail}>
    <Header title='账单详情' />

    <div className={s.card}>
      <div className={s.time} onClick={monthShow}>
        <span>{currentMonth}</span>
        <CustomIcon className={s.date} type="icon-rili" />
      </div>
      <div className={s.type}>
        <span className={cx({ [s.expense]: typeItem?.type == 1, [s.income]: typeItem?.type == 2 })}>
          <CustomIcon className={s.iconfont} type={typeItem?.icon} />
        </span>
        <span>{ typeItem?.name || '' }</span>
      </div>

      <div className={s.dateList} ref={dateListRef}>
        {
          navDates.map((item, index) => <div className={cx({ [s.dateItem]: true, [s.active]: activeDate === item })} key={item + index} onClick={() => setActiveDate(item)}>{ item }</div>)
        }
      </div>
      

      {/* {
        typeItem?.type == 1
          ? <div className={cx(s.amount, s.expense)}>￥{ detailList.totalExpense?.toFixed(2) }</div>
          : <div className={cx(s.amount, s.incom)}>￥{ detailList.totalIncome?.toFixed(2) }</div>
      } */}
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
              setDetail={() => {}}
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

    <PopupAddBill ref={addRef} detail={{}} onReload={() => {}} />
    <PopupDate ref={monthRef} mode="month" onSelect={() => { setCurrentMonth(item) }} />
  </div>
};

export default Detail;