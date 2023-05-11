import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import s from "./style.module.less";

const ScrollDateSelect = (({
  dateList = [],
  onSelect = () => {},
  defaultSelectVal = ''
}) => {
  const [activeDate, setActiveDate] = useState(null);
  const dateListRef = useRef();

  const handleClickDateItem = (item) => {
    setActiveDate(item)
    onSelect(item)
  }

  useEffect(() => {
    if (!dateList) {
      return
    }

    if (!activeDate && !defaultSelectVal) {
      return
    }

    setActiveDate(activeDate || defaultSelectVal)

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
  }, [activeDate, dateList, defaultSelectVal]);

  return (
    <div className={s.dateList} ref={dateListRef}>
      {dateList.map((item, index) => (
        <div
          className={cx({
            [s.dateItem]: true,
            [s.active]: activeDate === item,
          })}
          key={item || index}
          onClick={() => handleClickDateItem(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
});

ScrollDateSelect.propTypes = {
  dateList: PropTypes.array,
  onSelect: PropTypes.func,
  defaultSelectVal: PropTypes.string
};

export default ScrollDateSelect;
