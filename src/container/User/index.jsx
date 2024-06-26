import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Modal, Input, Button, Toast } from 'zarm';
import axios from '@/utils/axios'
import CustomIcon from '@/components/CustomIcon';

import s from './style.module.less';

const User = () => {
  const navigateTo = useNavigate();
  const [user, setUser] = useState({});
  const [signature, setSignature] = useState('');
  const [show, setShow] = useState(false);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleChangeFile = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file)

    axios({
      url: '/api/bill/import',
      method: 'POST',
      data: formData
    }).then((res) => {
      const { code = 500 } = res
      if (code !== 200) {
        return
      }
      Toast.show('导入账本成功');
    })
  }

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await axios({ url: '/api/user/get_userinfo' });
    setUser(data);
    setAvatar(data.avatar)
    setSignature(data.signature)
  };

  // 个性签名弹窗确认
  const confirmSig = async () => {
    const { data } = await axios({
      url: '/api/user/edit_signature',
      method: 'POST',
      data: {
        signature: signature
      }
    })
    setUser(data);
    setShow(false);
    Toast.show('修改成功');
  } ;

  // 退出登录
  const logout = async () => {
    localStorage.removeItem('token');
    navigateTo('/login');
  };

  return <div className={s.user}>
    <div className={s.head}>
      <div className={s.info}>
        <span>昵称：{ user.username }</span>
        <span onClick={() => setShow(true)}>
          <CustomIcon type="icon-qianming" />
          <b>{ user.signature || '暂无内容' }</b>
        </span>
      </div>
      <img className={s.avatar} style={{ width: 60, height: 60, borderRadius: 8 }} src={avatar} alt="" />
   </div>
   <div className={s.content}>
    <List>
      <List.Item
        hasArrow
        title="用户信息修改"
        onClick={() => navigateTo('/userinfo')}
        prefix={ <CustomIcon type="icon-wode" /> }
      />
      <List.Item
        hasArrow
        title="重制密码"
        onClick={() => navigateTo('/account')}
        prefix={ <CustomIcon type="icon-zhongzhi" /> }
      />
      <List.Item
        className={s.importBtn}
        title="导入账本"
        prefix={ <CustomIcon type="icon-print" /> }
      >
        <input className={s.importInput} type="file" name="file" onChange={(e) => handleChangeFile(e)} />
      </List.Item>
      <List.Item
        hasArrow
        title="我的账本"
        onClick={() => navigateTo('/books')}
        prefix={ <CustomIcon type="icon-accountbook" /> }
      />
      <List.Item
        hasArrow
        title="关于"
        onClick={() => navigateTo('/about')}
        prefix={ <CustomIcon type="icon-guanyu_o" /> }
      />
      </List>
   </div>
   <Button className={s.logout} block theme="danger" onClick={logout}>退出登录</Button>
   <Modal
      visible={show}
      title="标题"
      closable
      onCancel={() => setShow(false)}
      footer={
        <Button block theme="primary" onClick={confirmSig}>
          确认
        </Button>
      }
    >
    <Input
        autoHeight
        showLength
        maxLength={50}
        type="text"
        rows={3}
        value={signature}
        placeholder="请输入备注信息"
        onChange={(event) => setSignature(event.target.value)}
        />
    </Modal>
  </div>
};

export default User;