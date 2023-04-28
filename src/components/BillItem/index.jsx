import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { List, SwipeAction, Modal, Toast } from 'zarm';
import CustomIcon from '../CustomIcon';
import { post, get } from '@/utils';

import s from './style.module.less';

const BillItem = ({ bill, icons, onReload, setDetail, addRef }) => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  // 当添加账单是，bill.bills 长度变化，触发当日收支总和计算。
  useEffect(() => {
    const _income = bill.bills?.filter(i => i.pay_type == 2).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setIncome(_income);
    const _expense = bill.bills?.filter(i => i.pay_type == 1).reduce((curr, item) => {
      curr += Number(item.amount);
      return curr;
    }, 0);
    setExpense(_expense);
  }, [bill.bills]);

  const handleEditBillItem = async (item) => {
    const { data } = await get(`/api/bill/detail?id=${item.id}`);
    setDetail(data);
    addRef.current.show()
  }
  const handleDeleteBillItem = (item) => {
    Modal.confirm({
      title: '提示',
      content: '是否删除此账目',
      onConfirm: async () => {
        await post('/api/bill/delete', { id: item.id })
        Toast.show('删除成功')
        onReload()
      },
    });
  }

  return <div className={s.item}>
    <div className={s.headerDate}>
      <div className={s.date}>{bill.date}</div>
      <div className={s.money}>
        <span>
          支出：¥{ expense.toFixed(2) }
        </span>
        <span>
          收入：¥{ income.toFixed(2) }
        </span>
      </div>
    </div>
    <List>
      {
        bill && bill.bills?.sort((a, b) => b.date - a.date).map(item => 
          <SwipeAction
            key={item.id}
            rightActions={[
              {
                text: '编辑',
                onClick: () => handleEditBillItem(item),
              },
              {
                text: '删除',
                theme: 'danger',
                onClick: () => handleDeleteBillItem(item),
              }
            ]}
          >
            <List.Item
              className={s.bill}
              hasArrow={false}
              title={
                <>
                  <CustomIcon
                    className={s.itemIcon}
                    type={icons[item.type_id]}
                  />
                  <span> { item.type_name }</span>
                </>
              }
              suffix={<span style={{ color: item.pay_type == 2 ? 'red' : '#39be77' }}>{`${item.pay_type == 1 ? '-' : '+'}${item.amount}`}</span>}
              description={<div>{item.remark ? `| ${item.remark}` : ''}</div>}
            >
            </List.Item>
          </SwipeAction>
        )
      }
    </List>
  </div>
};

BillItem.propTypes = {
  bill: PropTypes.object,
  onReload: PropTypes.func,
  setDetail: PropTypes.func
};

export default BillItem;

