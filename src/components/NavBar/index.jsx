import React, { useState } from "react";
import PropTypes from "prop-types";
import { TabBar } from "zarm";
import { useNavigate } from "react-router-dom";
import CustomIcon from "../CustomIcon";
import s from "./style.module.less";

const NavBar = ({ showNav }) => {
  const [activeKey, setActiveKey] = useState("/");
  const navigateTo = useNavigate();

  const chnageTab = (path) => {
    setActiveKey(path);
    navigateTo(path);
  };

  return (
    <TabBar
      visible={showNav}
      className={`${s.tab} ${s.safeTab}`}
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
};

export default NavBar;
