import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'
import viteCompression from 'vite-plugin-compression'
import { viteExternalsPlugin } from 'vite-plugin-externals'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    viteExternalsPlugin({
      react: 'React',
      'react-dom': 'ReactDOM'
    }),
    // 启用 gzip 压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // 10KB 以上才压缩
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  css: {
    modules: {
      localsConvention: 'dashesOnly'
    },
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript
        javascriptEnabled: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // src 路径
      'config': path.resolve(__dirname, 'src/config') // src 路径
    }
  },
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          // // 将 React 相关库分离
          // 'react-vendor': ['react', 'react-dom'],
          // 将路由相关库分离
          'router-vendor': ['react-router-dom'],
          // 将状态管理相关库分离
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          // 将 UI 库分离
          'ui-vendor': ['zarm'],
          // 将工具库分离
          'utils-vendor': ['axios', 'dayjs', 'classnames']
        }
      }
    },
    // 启用压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true // 移除 debugger
      }
    },
    // 启用 source map
    sourcemap: false,
    // 设置块大小警告限制
    chunkSizeWarningLimit: 1000, // 降低警告阈值
    // 启用CSS代码分割
    cssCodeSplit: true,
  },
  server: {
    host: '0.0.0.0',
    port: 3001,
    proxy: {
      '/api': {
        // 当遇到 /api 路径时，将其转换成 target 的值
        // target: 'http://47.99.134.126:7009',
        target: 'http://10.242.78.83:7009',
        changeOrigin: true
        // rewrite: path => path.replace(/^\/api/, '') // 将 /api 重写为空
      }
    }
  }
})
