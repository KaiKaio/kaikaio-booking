import React from 'react';
import PropTypes from 'prop-types';

const CustomIcon = (props) => {
  return (
    <svg className={`icon ${props.className || ''}`} aria-hidden="true">
      <use xlinkHref={`#${props.type || ''}`}></use>
    </svg>
  );
};

CustomIcon.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string
};

export default CustomIcon;