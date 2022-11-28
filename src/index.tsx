import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './Redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import  "./index.scss"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);

