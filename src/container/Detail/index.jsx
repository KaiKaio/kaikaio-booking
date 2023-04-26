import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Toast } from 'zarm';
import qs from 'query-string';
import cx from 'classnames';
import dayjs from 'dayjs';
import Header from '@/components/Header';
import CustomIcon from '@/components/CustomIcon';
import PopupAddBill from '@/components/PopupAddBill'
import { get, post, typeMap } from '@/utils';

import s from './style.module.less'

const Detail = () => {
  const addRef = useRef();
  const location = useLocation();
  const navigateTo = useNavigate();
  const { id } = qs.parse(location.search);

  const [detail, setDetail] = useState({});
  const [icons, setIcons] = useState({});
  
  useEffect(async () => {
    getDetail();

    const { data: { list = [] } } = await get('/api/type/list');
    const iconsMap = {};
    if (!list?.length) {
      return
    }
    list.forEach(item => {
      iconsMap[item.id] = item.icon;
    });
    setIcons(iconsMap)
  }, []);

  const getDetail = async () => {
    const { data } = await get(`/api/bill/detail?id=${id}`);
    setDetail(data);
  }

  // 删除方法
  const deleteDetail = () => {
    Modal.confirm({
      title: '删除',
      content: '确认删除账单？',
      onConfirm: async () => {
        const { data } = await post('/api/bill/delete', { id })
        Toast.show('删除成功')
        navigateTo(-1)
      },
    });
  }

  // 打开编辑弹窗方法
  const openModal = () => {
    addRef.current && addRef.current.show()
  }

  return <div className={s.detail}>
    <Header title='账单详情' />
    <div className={s.card}>
      <div className={s.type}>
        <span className={cx({ [s.expense]: detail.pay_type == 1, [s.income]: detail.pay_type == 2 })}>
          <CustomIcon className={s.iconfont} type={icons[detail.type_id]} />
        </span>
        <span>{ detail.type_name || '' }</span>
      </div>
      {
        detail.pay_type == 1
          ? <div className={cx(s.amount, s.expense)}>-{ detail.amount }</div>
          : <div className={cx(s.amount, s.incom)}>+{ detail.amount }</div>
      }
      <div className={s.info}>
        <div className={s.time}>
          <span>记录时间</span>
          <span>{dayjs(detail.date).format('YYYY-MM-DD')}</span>
        </div>
        <div className={s.remark}>
          <span>备注</span>
          <span>{ detail.remark || '-' }</span>
        </div>
      </div>
      <div className={s.operation}>
        <span onClick={deleteDetail}><CustomIcon type='icon-shanchu' />删除</span>
        <span onClick={openModal}><CustomIcon type='icon-bianji' />编辑</span>
      </div>
    </div>
    <PopupAddBill ref={addRef} detail={detail} onReload={getDetail} />
  </div>
};

export default Detail;