# JavaScript 优化指南

## 已实施的优化措施

### 1. 路由懒加载
- 使用 `React.lazy()` 和 `Suspense` 实现路由组件的懒加载
- 减少初始 JavaScript 包大小，按需加载页面组件

### 2. 代码分割 (Code Splitting)
- 配置 Vite 的 `manualChunks` 将第三方库分离
- 将 React、路由、状态管理、UI 库等分别打包
- 提高缓存效率和加载性能

### 3. Tree Shaking 优化
- 创建统一的组件导出文件
- 使用按需导入减少未使用的代码
- 优化 dayjs 和 zarm 的导入方式

### 4. 构建优化
- 启用 Terser 压缩
- 移除生产环境的 console 和 debugger
- 关闭 source map 减少包大小

## 进一步优化建议

### 1. 组件级别优化
```javascript
// 使用 React.memo 优化组件重渲染
const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>
})

// 使用 useMemo 和 useCallback 优化计算和函数
const memoizedValue = useMemo(() => expensiveCalculation(data), [data])
const memoizedCallback = useCallback(() => handleClick(id), [id])
```

### 2. 图片优化
- 使用 WebP 格式
- 实现图片懒加载
- 使用适当的图片尺寸

### 3. 缓存策略
- 配置 Service Worker
- 使用 HTTP 缓存头
- 实现资源版本控制

### 4. 网络优化
- 启用 Gzip 压缩
- 使用 CDN 加速
- 实现预加载关键资源

### 5. 监控和分析
```bash
# 分析构建包大小
npm run build:analyze

# 使用 Lighthouse 持续监控
# 使用 WebPageTest 进行性能测试
```

## 性能监控

### Lighthouse 指标
- **FCP (First Contentful Paint)**: 首次内容绘制
- **LCP (Largest Contentful Paint)**: 最大内容绘制
- **FID (First Input Delay)**: 首次输入延迟
- **CLS (Cumulative Layout Shift)**: 累积布局偏移

### 优化目标
- FCP < 1.8s
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

## 构建分析

运行以下命令分析构建包：
```bash
npm run build:analyze
```

这将生成一个可视化的包分析报告，帮助识别：
- 最大的 JavaScript 包
- 未使用的依赖
- 重复的模块
- 优化机会 