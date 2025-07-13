import React, { useEffect, useRef, useState, useMemo } from "react";
import { Progress } from "zarm";
import cx from "classnames";
import dayjs from "dayjs";
import axios from '@/utils/axios'
import { useSelector } from 'react-redux'
import CustomIcon from "@/components/CustomIcon";
import s from "./style.module.less";
import { useNavigate } from "react-router-dom";
import ScrollDateSelect from '@/components/ScrollDateSelect/ScrollDateSelect'
import echarts from '@/utils/echarts';

let proportionChart = null;

const Data = () => {
  const navigateTo = useNavigate();
  const types = useSelector((state) => state.types.types)

  const [totalType, setTotalType] = useState("expense");
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [pieType, setPieType] = useState("expense");
  const [icons, setIcons] = useState({});
  const [navDates, setNavDates] = useState([]);
  const [activeDate, setActiveDate] = useState(null);

  useEffect(() => {
    const iconsMap = {};
    if (!types?.length) {
      return;
    }
    types.forEach((item) => {
      iconsMap[item.id] = item.icon;
    });
    setIcons(iconsMap);
  }, [types]);

  useEffect(() => {
    if (!activeDate) {
      return
    }
    getData();
  }, [activeDate])

  useEffect(() => {
    axios({
      url: '/api/bill/getEarliestItemDate'
    }).then((res) => {
      const { data = '' } = res;
      const dates = localGenerateDates(data)
      setNavDates(dates)
      
      setActiveDate(dates[dates.length - 3])
    });

    return () => {
      // 每次组件卸载的时候，需要释放图表实例。clear 只是将其清空不会释放。
      proportionChart?.dispose();
    };
  }, [])

  const localGenerateDates = (result) => {
    if (!result) {
      return []
    }

    let dateList = ['', '']
    let cur = dayjs(result).startOf('month')
    while (cur <= dayjs().startOf('month')) {
      dateList.push(cur.format('YYYY-MM'))

      if (dayjs(cur).month() === 11) {
        dateList.push(cur.add(1, 'month').format('YYYY'))
      }
      cur = cur.add(1, 'month')
    }
    dateList = [...dateList, '', '']
    return dateList
  }

  const getData = async () => {
    const isYearSearch = activeDate.length === 4
    let params = {}

    if (!isYearSearch) {
      params = {
        start: dayjs(activeDate).startOf("month").format("YYYY-MM-DD") + " 00:00:00",
        end: dayjs(activeDate).endOf("month").format("YYYY-MM-DD") + " 23:59:59"
      }
    } else {
      params = {
        start: dayjs(activeDate).startOf("year").format("YYYY-MM-DD") + " 00:00:00",
        end: dayjs(activeDate).endOf("year").format("YYYY-MM-DD") + " 23:59:59"
      }
    }

    const { data } = await axios({
      url: '/api/bill/data',
      params
    });

    // 总收支
    setTotalExpense(data.total_expense);
    setTotalIncome(data.total_income);

    // 过滤支出和收入
    const expense_data = data.total_data
      .filter((item) => item.pay_type === "1")
      .sort((a, b) => b.number - a.number); // 过滤出账单类型为支出的项
    const income_data = data.total_data
      .filter((item) => item.pay_type === "2")
      .sort((a, b) => b.number - a.number); // 过滤出账单类型为收入的项
    setExpenseData(expense_data);
    setIncomeData(income_data);
  
    setPieChart(pieType == "expense" ? expense_data : income_data);
  };

  // 切换收支构成类型
  const changeTotalType = (type) => {
    setTotalType(type);
  };

  // 切换饼图收支类型
  const changePieType = (type) => {
    setPieType(type);

    // 重绘饼图
    setPieChart(type == "expense" ? expenseData : incomeData);
  };

  // 绘制饼图方法
  const setPieChart = (data) => {
    proportionChart = echarts.init(document.getElementById("proportion"));

    proportionChart.setOption({
      tooltip: {
        trigger: "item",
      },
      legend: {
        left: "center",
      },
      series: [
        {
          type: "pie",
          
          radius: ['35%', '55%'],
          minAngle: 10,
          label: {
            show: true
          },
          labelLine: {
            length: 15,
            length2: 15,
          },
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 3
          },
          data: data.map((item) => ({
            value: item.number,
            name: item.type_name,
          }))
        },
      ],
    });
  };

  const selectMonth = (item) => {
    setActiveDate(item);
  };

  const handleToItemList = (item) => {
    navigateTo(`/detail?type_id=${item.type_id}`);
  };

  const list = useMemo(() => {
    if (totalType === "expense") {
      return expenseData;
    } else {
      return incomeData;
    }
  }, [totalType, expenseData, incomeData]);

  return (
    <div className={s.data}>
      <div className={s.total}>
        <div className={s.title}>共支出</div>
        <div className={s.expense}>¥{totalExpense}</div>
        <div className={s.income}>共收入¥{totalIncome}</div>

        <ScrollDateSelect
          dateList={navDates}
          onSelect={(item) => setActiveDate(item)}
          defaultSelectVal={activeDate}
        />
      </div>
      <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span
              onClick={() => changeTotalType("expense")}
              className={cx({
                [s.expense]: true,
                [s.active]: totalType == "expense",
              })}
            >
              支出
            </span>
            <span
              onClick={() => changeTotalType("income")}
              className={cx({
                [s.income]: true,
                [s.active]: totalType == "income",
              })}
            >
              收入
            </span>
          </div>
        </div>
        <div className={s.content}>
          {list.map((item) => (
            <div key={item.type_id} className={s.item} onClick={() => handleToItemList(item)}>
              <div className={s.left}>
                <div className={s.type}>
                  <span
                    className={cx({
                      [s.expense]: totalType == "expense",
                      [s.income]: totalType == "income",
                    })}
                  >
                    <CustomIcon
                      className={s.iconfont}
                      type={icons[item.type_id]}
                    />
                  </span>
                  <span className={s.name}>{item.type_name}</span>
                </div>
                <div className={s.progress}>
                  ¥{Number(item.number).toFixed(2) || 0}
                </div>
              </div>
              <div className={s.right}>
                <div className={s.percent}>
                  <Progress
                    shape="line"
                    percent={Number(
                      (item.number /
                        Number(
                          totalType == "expense" ? totalExpense : totalIncome
                        )) *
                        100
                    ).toFixed(2)}
                    theme="primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={s.proportion}>
          <div className={s.head}>
            <span className={s.title}>收支构成</span>
            <div className={s.tab}>
              <span
                onClick={() => changePieType("expense")}
                className={cx({
                  [s.expense]: true,
                  [s.active]: pieType == "expense",
                })}
              >
                支出
              </span>
              <span
                onClick={() => changePieType("income")}
                className={cx({
                  [s.income]: true,
                  [s.active]: pieType == "income",
                })}
              >
                收入
              </span>
            </div>
          </div>
          <div id="proportion"></div>
        </div>
      </div>
    </div>
  );
};

export default Data;
