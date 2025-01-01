/**
 * 添加账单弹窗
 */
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon, Toast, Input, Tabs, Keyboard } from 'zarm';
import cx from 'classnames'
import dayjs from 'dayjs';
import { useSelector } from 'react-redux'
import CustomIcon from '../CustomIcon'
import PopupDate from '../PopupDate'
import { post } from '@/utils'

import s from './style.module.less';

const PopupAddBill = forwardRef(({ detail = {}, onReload, setDetail }, ref) => {
  const types = useSelector((state) => state.types.types)

  const dateRef = useRef()
  const remarkRef = useRef(null)

  const id = detail && detail.id // 外部传进来的账单详情 id
  const [show, setShow] = useState(false);
  const [payType, setPayType] = useState('expense'); // 支出或收入类型
  const [expense, setExpense] = useState([]); // 支出类型数组
  const [income, setIncome] = useState([]); // 收入类型数组
  const [currentType, setCurrentType] = useState({});
  const [amount, setAmount] = useState(''); // 账单价格
  const [remark, setRemark] = useState(''); // 备注
  const [showRemark, setShowRemark] = useState(false); // 备注输入框
  const [date, setDate] = useState(new Date()); // 日期
 

  useEffect(() => {
    if (detail.id) {
      setPayType(detail.pay_type == 1 ? 'expense' : 'income')
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name
      })
      setRemark(detail.remark)
      setAmount(detail.amount)
      setDate(detail.date)
    }
  }, [detail])

  useEffect(() => {
    if (!showRemark) {
      return
    }
    setTimeout(() => {
      // IOS 键盘收起后操作
      // 微信浏览器版本6.7.4+IOS12会出现键盘收起后，视图被顶上去了没有下来
      const wechatInfoRe = /MicroMessenger\/([\d\.]+)/i;
      const wechatInfo = wechatInfoRe.exec(window?.navigator?.userAgent);
      const wechatVersion = wechatInfo && wechatInfo.length > 1 && wechatInfo[1];

      const osInfoRe = /OS (\d+)_(\d+)_?(\d+)?/i;
      const osInfo = osInfoRe.exec(navigator.appVersion);
      const osVersion = osInfo && osInfo.length > 1 && osInfo[1];

      if (!wechatVersion || !osVersion) {
        return;
      }
      const height = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
      if (Number(wechatVersion.replace(/\./g, '')) >= 674 && Number(osVersion) >= 12) {
        window.scrollTo(0, height);
      }
    }, 200)
  }, [showRemark])

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      }
    }
  };

  useEffect(() => {
    if (!types?.length) {
      return
    }
    
    const _expense = types.filter(i => i.type == 1); // 支出类型
    const _income = types.filter(i => i.type == 2); // 收入类型

    setExpense(_expense);
    setIncome(_income);

    if (!id) {
      setCurrentType(_expense[0]);
    };
  }, [types]);

  const typeList = useMemo(() => {
    if (payType === 'expense') {
      return expense
    } else {
      return income
    }
  }, [payType, expense, income])
  
  const typeTabs = useMemo(() => {
    const tabLength = Math.ceil(typeList.length / 15)
    return [...new Array(tabLength).keys()]
  }, [typeList])

  // 切换收入还是支出
  const changeType = (type) => {
    setPayType(type);
    // 切换之后，默认给相应类型的第一个值
    if (type == 'expense') {
      setCurrentType(expense[0]);
    } else {
      setCurrentType(income[0]);
    }
  };

  // 日期弹窗
  const handleDatePop = () => {
    dateRef.current && dateRef.current.show()
  }

  // 日期选择回调
  const selectDate = (val) => {
    setDate(val)
  }

  // 选择账单类型
  const choseType = (item) => {
    setCurrentType(item)
  }

  // 监听输入框改变值
  const handleMoney = (value) => {
    value = String(value)
    if (value == 'close') return

    // 点击是删除按钮时
    if (value == 'delete') {
      let _amount = `${amount}`.slice(0, `${amount}`.length - 1)
      setAmount(_amount)
      return
    }

    // 点击确认按钮时
    if (value == 'ok') {
      addBill()
      return
    }
  
    // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
    if (value == '.' && amount.includes('.')) return

    // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
    if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return

    setAmount(amount + value)
  }

  // 添加账单
  const addBill = async () => {
    if (!amount) {
      Toast.show('请输入具体金额')
      return
    }
    const params = {
      amount: Number(amount).toFixed(2),
      type_id: currentType.id,
      type_name: currentType.name,
      date: dayjs(date).unix() * 1000,
      pay_type: payType == 'expense' ? 1 : 2,
      remark: remark || ''
    }
    if (id) {
      params.id = id;
      // 如果有 id 需要调用详情更新接口
      const result = await post('/api/bill/update', params);
      Toast.show('修改成功');
      setDetail({})
    } else {
      const result = await post('/api/bill/add', params);
      setAmount('');
      setPayType('expense');
      setCurrentType(expense[0]);
      // setDate(new Date());
      setRemark('');
      Toast.show('添加成功');
    }
    setShow(false);
    if (onReload) onReload();
  }

  const handleEnterRemark = () => {
    setShowRemark(true)
    remarkRef.current.focus()
  }

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.addWrap}>
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}><Icon type="wrong" /></span>
        </header>
        <div className={s.filter}>
          <div className={s.type}>
            <span onClick={() => changeType('expense')} className={cx({ [s.expense]: true, [s.active]: payType == 'expense' })}>支出</span>
            <span onClick={() => changeType('income')} className={cx({ [s.income]: true, [s.active]: payType == 'income' })}>收入</span>
          </div>
          <div className={s.time} onClick={handleDatePop}>{dayjs(date).format('MM-DD')} <Icon className={s.arrow} type="arrow-bottom" /></div>
        </div>
        <div className={s.money}>
          <span className={s.sufix}>¥</span>
          <span className={cx(s.amount, s.animation)}>{amount}</span>
        </div>
        <div className={s.typeWarp}>
          {
            <div className={s.typePanel}>
              {
                typeList.map(titem => (
                  <div 
                    onClick={() => choseType(titem)}
                    key={titem.id}
                    className={s.typeItem}
                  >
                    <span
                      className={
                      cx({
                        [s.iconfontWrap]: true,
                        [s.expense]: payType == 'expense',
                        [s.income]: payType == 'income',
                        [s.active]: currentType.id == titem.id}
                      )}
                    >
                      <CustomIcon className={s.iconfont} type={titem.icon} />
                    </span>
                    <span>{titem.name}</span>
                  </div>
                ))
              }
            </div>
          }
        </div>
        <div className={s.remark}>
          <span onClick={() => handleEnterRemark()}>
            <Input
              className={cx({
                [s.remarkInput]: true,
                [s.hide]: !showRemark
              })}
              ref={remarkRef}
              showLength
              maxLength={50}
              type="text"
              rows={1}
              value={remark}
              placeholder="请输入备注信息"
              onChange={(event) => setRemark(event.target.value)}
              onBlur={() => setShowRemark(false)}
            />
            { !showRemark && <span>{remark || '添加备注'}</span> }
          </span>
        </div>
        { !showRemark && <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} /> }
        <PopupDate ref={dateRef} onSelect={selectDate} />
      </div>
    </Popup>
  )
});

PopupAddBill.propTypes = {
  detail: PropTypes.object,
  onReload: PropTypes.func
}

export default PopupAddBill;