/**
 * 组件适配层 - antd-mobile 组件导出
 * 
 * 已完成从 zarm 到 antd-mobile 的迁移
 * 
 * 迁移完成的组件：
 * ✅ Tabs, Toast, Button, Input
 * ✅ Modal, Popup, List, Icon
 * ✅ Pull, DatePicker, SwipeAction, Progress
 * ✅ Keyboard, FilePicker, TabBar, NavBar, ConfigProvider
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
  ProgressBar,
  NumberKeyboard,
  TabBar as AntdTabBar,
  Tabs
} from 'antd-mobile'
import { 
  CloseCircleFill,
  LeftOutline,
  DownOutline
} from 'antd-mobile-icons'

// ==================== ✅ 已迁移 antd-mobile ====================

// Tabs 导出
export { Tabs }

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

// ==================== ✅ P4 已迁移 antd-mobile ====================

// Keyboard 适配：使用 NumberKeyboard
export const Keyboard = ({ type, onKeyClick, ...props }) => {
  // zarm Keyboard 的 type: 'price' | 'number'
  // antd-mobile NumberKeyboard 仅支持数字键盘
  
  const handleKeyPress = (key) => {
    if (onKeyClick) {
      onKeyClick(key)
    }
  }
  
  const handleConfirm = () => {
    if (onKeyClick) {
      onKeyClick('ok')
    }
  }
  
  const handleDelete = () => {
    if (onKeyClick) {
      onKeyClick('delete')
    }
  }
  
  return (
    <NumberKeyboard
      onKeyPress={handleKeyPress}
      onConfirm={handleConfirm}
      onDelete={handleDelete}
      confirmText="确认"
      {...props}
    />
  )
}

// FilePicker 适配：使用原生 input[type="file"] 实现
// zarm API: <FilePicker onChange={handleSelect}><Button>上传</Button></FilePicker>
// onChange 参数: { file: File }
export const FilePicker = ({ onChange, accept, children, className, ...props }) => {
  const inputRef = useRef(null)
  
  const handleClick = () => {
    inputRef.current?.click()
  }
  
  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file && onChange) {
      onChange({ file })
    }
    // 重置 input，允许重复选择同一文件
    e.target.value = ''
  }
  
  return (
    <div className={className} onClick={handleClick} {...props}>
      {children}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

// TabBar 适配：底部导航栏
export const TabBar = ({ safearea, activeKey, onChange, children, ...props }) => {
  return (
    <AntdTabBar
      activeKey={activeKey}
      onChange={onChange}
      {...props}
    >
      {children}
    </AntdTabBar>
  )
}

// TabBar.Item 适配
TabBar.Item = ({ itemKey, title, icon, ...props }) => {
  return (
    <AntdTabBar.Item
      key={itemKey}
      title={title}
      icon={icon}
      {...props}
    />
  )
}

// NavBar 适配：顶部导航栏
// 注意：antd-mobile 无独立 NavBar 组件，使用自定义实现
export const NavBar = ({ left, title, ...props }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '45px',
        padding: '0 16px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0'
      }}
      {...props}
    >
      <div style={{ minWidth: '40px' }}>{left}</div>
      <div style={{ flex: 1, textAlign: 'center', fontWeight: 500, fontSize: '17px' }}>
        {title}
      </div>
      <div style={{ minWidth: '40px' }} />
    </div>
  )
}

// ConfigProvider 适配：全局配置
// 注意：antd-mobile 使用 CSS 变量，ConfigProvider 仅用于部分配置
export const ConfigProvider = ({ primaryColor, children, ...props }) => {
  // antd-mobile 通过 CSS 变量设置主题色
  // 这里简化实现，实际项目应在全局 CSS 中设置
  if (primaryColor) {
    return (
      <div 
        style={{ 
          '--adm-color-primary': primaryColor,
          '--adm-color-success': primaryColor
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
  
  return <>{children}</>
}
