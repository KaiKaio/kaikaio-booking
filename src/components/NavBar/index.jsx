import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from 'classnames'
import { TabBar } from "zarm";
import { useNavigate } from "react-router-dom";
import CustomIcon from "../CustomIcon";
import s from "./style.module.less";
import { useEffect } from "react";

const NavBar = (props) => {
  const [activeKey, setActiveKey] = useState("/");
  const navigateTo = useNavigate();

  useEffect(() => {
    setActiveKey(props.path);
  }, [props.path])

  const chnageTab = (path) => {
    navigateTo(path);
  };

  return (
    <TabBar
      safeArea
      style={{display: props.showNav ? 'block' : 'none' }}
      className={cx({ [s.tab]: true })}
      activeKey={activeKey}
      onChange={chnageTab}
    >
      <TabBar.Item
        itemKey="/"
        title="账单"
        icon={<CustomIcon type="icon-wj-zd" />}
      />
      <TabBar.Item
        itemKey="/data"
        title="统计"
        icon={<CustomIcon type="icon-tongji" />}
      />
      <TabBar.Item
        itemKey="/user"
        title="我的"
        icon={<CustomIcon type="icon-wode" />}
      />
    </TabBar>
  );
};

NavBar.propTypes = {
  showNav: PropTypes.bool,
  path: PropTypes.string,
};

export default NavBar;
