/**
 * 组件适配层 - 渐进式迁移 from zarm to antd-mobile
 * 
 * 迁移状态说明：
 * ✅ 已迁移至 antd-mobile
 * ⏳ 待迁移（当前仍使用 zarm）
 * 
 * 迁移优先级：
 * P0: Tabs（已迁移）
 * P1: Toast, Button, Input（已迁移）
 * P2: Modal, Popup, List, Icon（已迁移）
 * P3: Pull, DatePicker, SwipeAction, Progress, Checkbox
 * P4: Keyboard → NumberKeyboard, FilePicker → ImageUploader, TabBar, NavBar, ConfigProvider
 */

import React from 'react'
import { 
  Toast as AntdToast, 
  Button as AntdButton, 
  Input as AntdInput,
  Modal as AntdModal,
  Popup as AntdPopup,
  List as AntdList
} from 'antd-mobile'
import { 
  CloseCircleFill,
  LeftOutline,
  DownOutline
} from 'antd-mobile-icons'
import { 
  Tabs,
  Pull,
  Progress,
  SwipeAction,
  DatePicker,
  Checkbox,
  Keyboard,
  FilePicker,
  TabBar,
  NavBar,
  ConfigProvider
} from 'zarm'

// ==================== ✅ 已迁移 antd-mobile ====================
export { Tabs } from 'antd-mobile'

// Toast 适配
export const Toast = AntdToast

// Button 适配
export const Button = ({ theme, ghost, shadow, size, ...props }) => {
  const colorMap = {
    primary: 'primary',
    danger: 'danger',
    default: 'default',
    success: 'success',
    warning: 'warning'
  }
  
  const sizeMap = {
    xs: 'mini',
    sm: 'small',
    md: 'middle',
    lg: 'large'
  }
  
  return (
    <AntdButton
      color={colorMap[theme] || theme}
      fill={ghost ? 'outline' : 'solid'}
      size={sizeMap[size] || size}
      {...props}
    />
  )
}

// Input 适配
export const Input = ({ onChange, ...props }) => {
  const handleChange = (value) => {
    if (onChange) {
      onChange({ target: { value } })
    }
  }
  
  return <AntdInput onChange={handleChange} {...props} />
}

// Modal 适配
export const Modal = ({ 
  visible, 
  title, 
  closable, 
  onCancel, 
  onClose,
  footer,
  actions,
  onAction,
  children,
  ...props 
}) => {
  if (!visible) return null
  
  // 处理 actions 模式（Books/index.jsx）
  if (actions && onAction) {
    const adaptedActions = actions[0]?.map(action => ({
      key: action.key,
      text: action.text,
      primary: action.theme === 'primary',
      onClick: () => onAction(action)
    }))
    
    return (
      <AntdModal
        header={title}
        actions={adaptedActions}
        onClose={onClose || onCancel}
        {...props}
      >
        {children}
      </AntdModal>
    )
  }
  
  // 处理 footer 模式（User/index.jsx）
  const adaptedActions = footer ? [
    {
      key: 'confirm',
      text: footer,
      primary: true
    }
  ] : []
  
  return (
    <AntdModal
      header={title}
      actions={adaptedActions}
      onClose={onCancel}
      closeOnMaskClick={closable}
      {...props}
    >
      {children}
    </AntdModal>
  )
}

// Popup 适配
export const Popup = ({ 
  visible, 
  direction, 
  onMaskClick, 
  destroy, 
  mountContainer,
  children,
  ...props 
}) => {
  const positionMap = {
    bottom: 'bottom',
    top: 'top',
    left: 'left',
    right: 'right'
  }
  
  return (
    <AntdPopup
      visible={visible}
      position={positionMap[direction] || direction}
      onMaskClick={onMaskClick}
      getContainer={mountContainer}
      {...props}
    >
      {children}
    </AntdPopup>
  )
}

// List 适配
export const List = ({ title, children, ...props }) => {
  if (title) {
    return (
      <AntdList header={title} {...props}>
        {children}
      </AntdList>
    )
  }
  return <AntdList {...props}>{children}</AntdList>
}

List.Item = ({ hasArrow, title, prefix, ...props }) => {
  return (
    <AntdList.Item
      arrow={hasArrow ? true : false}
      prefix={prefix}
      {...props}
    >
      {title || props.children}
    </AntdList.Item>
  )
}

// Icon 适配
export const Icon = ({ type, theme, ...props }) => {
  const iconMap = {
    'wrong': CloseCircleFill,
    'arrow-left': LeftOutline,
    'arrow-bottom': DownOutline
  }
  
  const IconComponent = iconMap[type]
  
  if (!IconComponent) {
    console.warn(`Icon type "${type}" not mapped, please check`)
    return null
  }
  
  const colorMap = {
    primary: 'var(--adm-color-primary)',
    danger: 'var(--adm-color-danger)',
    default: 'var(--adm-color-text)'
  }
  
  return (
    <IconComponent 
      color={colorMap[theme]} 
      {...props} 
    />
  )
}

// ==================== ⏳ 待迁移（zarm） ====================
// P3 - 低频组件
export { Pull, Progress, SwipeAction, DatePicker, Checkbox }

// P4 - 特殊组件
export { Keyboard, FilePicker, TabBar, NavBar, ConfigProvider }
