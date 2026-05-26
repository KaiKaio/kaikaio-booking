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
 * P3: Pull, DatePicker, SwipeAction, Progress, Checkbox（已迁移）
 * P4: Keyboard → NumberKeyboard, FilePicker → ImageUploader, TabBar, NavBar, ConfigProvider
 */

import React, { useRef, useEffect } from 'react'
import { 
  Toast as AntdToast, 
  Button as AntdButton, 
  Input as AntdInput,
  Modal as AntdModal,
  Popup as AntdPopup,
  List as AntdList,
  PullToRefresh,
  SwipeAction as AntdSwipeAction,
  DatePicker as AntdDatePicker,
  ProgressBar
} from 'antd-mobile'
import { 
  CloseCircleFill,
  LeftOutline,
  DownOutline
} from 'antd-mobile-icons'
import { 
  Tabs,
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

// Modal.confirm 静态方法适配
Modal.confirm = ({ title, content, onConfirm }) => {
  AntdModal.confirm({
    content: (
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{title}</div>
        <div>{content}</div>
      </div>
    ),
    confirmText: '确定',
    cancelText: '取消',
    onConfirm
  })
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

// Pull 适配：下拉刷新 + 上拉加载
// 注意：antd-mobile PullToRefresh 只支持下拉刷新
// 上拉加载需要单独实现或使用 InfiniteScroll
export const Pull = React.forwardRef(({ refresh, load, children, ...props }, ref) => {
  // load.state: 0=success, 1=loading, 2=failure
  // refresh.state: 0=success, 1=loading, 2=failure
  
  return (
    <PullToRefresh
      onRefresh={async () => {
        if (refresh?.handler) {
          await refresh.handler()
        }
      }}
      {...props}
    >
      {children}
      {/* 上拉加载提示 */}
      {load?.state === 1 && (
        <div style={{ textAlign: 'center', padding: '12px', color: '#999' }}>
          加载中...
        </div>
      )}
    </PullToRefresh>
  )
})

// DatePicker 适配
export const DatePicker = ({ 
  visible, 
  value, 
  columnType, 
  mode, 
  onConfirm, 
  onCancel,
  ...props 
}) => {
  if (!visible) return null
  
  // columnType 映射：['year', 'month'] -> 'month', ['year', 'month', 'day'] -> 'date'
  const precisionMap = {
    'year,month': 'month',
    'year,month,day': 'day'
  }
  
  const precisionKey = columnType?.join(',') || 'year,month,day'
  const precision = precisionMap[precisionKey] || 'day'
  
  return (
    <AntdDatePicker
      visible={visible}
      value={value}
      precision={precision}
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...props}
    />
  )
}

// SwipeAction 适配
export const SwipeAction = ({ rightActions, children, ...props }) => {
  const adaptedActions = rightActions?.map(action => ({
    text: action.text,
    color: action.theme === 'danger' ? 'danger' : 'primary',
    onClick: action.onClick
  }))
  
  return (
    <AntdSwipeAction
      right={adaptedActions}
      {...props}
    >
      {children}
    </AntdSwipeAction>
  )
}

// Progress 适配：使用 antd-mobile ProgressBar
export const Progress = ({ shape, percent, theme, ...props }) => {
  const colorMap = {
    primary: 'primary',
    danger: 'danger',
    success: 'success',
    warning: 'warning'
  }
  
  const clampedPercent = Math.min(100, Math.max(0, percent))
  
  return (
    <ProgressBar
      percent={clampedPercent}
      style={{
        '--fill-color': `var(--adm-color-${colorMap[theme] || 'primary'})`
      }}
      {...props}
    />
  )
}

// ==================== ⏳ 待迁移（zarm） ====================
// P4 - 特殊组件
export { Keyboard, FilePicker, TabBar, NavBar, ConfigProvider }
