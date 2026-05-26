/**
 * 组件适配层 - 渐进式迁移 from zarm to antd-mobile
 * 
 * 迁移状态说明：
 * ✅ 已迁移至 antd-mobile
 * ⏳ 待迁移（当前仍使用 zarm）
 * 
 * 迁移优先级：
 * P0: Tabs（已迁移）
 * P1: Toast, Button, Input（高频组件）
 * P2: Modal, Popup, List, Icon
 * P3: Pull, DatePicker, SwipeAction, Progress, Checkbox
 * P4: Keyboard → NumberKeyboard, FilePicker → ImageUploader, TabBar, NavBar, ConfigProvider
 */

// ==================== ✅ 已迁移 antd-mobile ====================
export { Tabs } from 'antd-mobile'

// ==================== ⏳ 待迁移（zarm） ====================
import { 
  Button,
  Input,
  Toast,
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

// P1 - 高频组件
export { Button, Input, Toast }

// P2 - 中频组件
export { List, Modal, Popup, Icon }

// P3 - 低频组件
export { Pull, Progress, SwipeAction, DatePicker, Checkbox }

// P4 - 特殊组件
export { Keyboard, FilePicker, TabBar, NavBar, ConfigProvider }
