import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { setupAxiosInterceptors } from './services/authService';
import store from './stores/redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

setupAxiosInterceptors();

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

reportWebVitals();
