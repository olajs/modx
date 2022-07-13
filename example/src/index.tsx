import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from '@olajs/modx';
import model from './model';
import App from './App';
import './index.css';

const testMiddleware = (store) => (next) => (action) => {
  console.log('dispatched action: ', action);
  return next(action);
};

const store = createStore({}, [model], {
  devTools: true,
  middlewares: [testMiddleware],
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
