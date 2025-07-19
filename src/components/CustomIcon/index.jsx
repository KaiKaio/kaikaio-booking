import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomIcon = ({ type, size = 24, color = '#000' }) => {
  // 图标映射表
  const iconMap = {
    'icon-wj-zd': 'receipt',
    'icon-tongji': 'bar-chart',
    'icon-wode': 'person',
    'icon-add': 'add',
    'icon-edit': 'edit',
    'icon-delete': 'delete',
    'icon-back': 'arrow-back',
    'icon-forward': 'arrow-forward',
    'icon-home': 'home',
    'icon-settings': 'settings',
    'icon-search': 'search',
    'icon-close': 'close',
    'icon-check': 'check',
    'icon-calendar': 'calendar-today',
    'icon-money': 'attach-money',
    'icon-category': 'category',
  };

  const iconName = iconMap[type] || 'help-outline';

  return <Icon name={iconName} size={size} color={color} />;
};

export default CustomIcon;