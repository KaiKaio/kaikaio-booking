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
 * P2: Modal, Popup, List, Icon
 * P3: Pull, DatePicker, SwipeAction, Progress, Checkbox
 * P4: Keyboard → NumberKeyboard, FilePicker → ImageUploader, TabBar, NavBar, ConfigProvider
 */

import { Toast as AntdToast, Button as AntdButton, Input as AntdInput } from 'antd-mobile'
import { 
  Tabs,
  List,
  Modal,
  Popup,
  Icon,
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

// Toast 适配：antd-mobile Toast.show() 支持字符串参数，无需适配
export const Toast = AntdToast

// Button 适配：theme → color, ghost → fill="outline"
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

// Input 适配：onChange 参数差异
export const Input = ({ onChange, ...props }) => {
  const handleChange = (value) => {
    if (onChange) {
      // 兼容 zarm 的 event.target.value 格式
      onChange({ target: { value } })
    }
  }
  
  return <AntdInput onChange={handleChange} {...props} />
}

// ==================== ⏳ 待迁移（zarm） ====================
// P2 - 中频组件
export { List, Modal, Popup, Icon }

// P3 - 低频组件
export { Pull, Progress, SwipeAction, DatePicker, Checkbox }

// P4 - 特殊组件
export { Keyboard, FilePicker, TabBar, NavBar, ConfigProvider }
