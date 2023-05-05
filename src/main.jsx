import React from 'react'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'
import { store } from '@/store'
import {
  BrowserRouter as Router
} from "react-router-dom";
import 'lib-flexible/flexible'
import './index.css'
import 'zarm/dist/zarm.css';
import App from './App'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <React.StrictMode>
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
  // </React.StrictMode>
);