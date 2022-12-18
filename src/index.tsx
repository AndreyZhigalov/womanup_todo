import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import store from './Redux/store';

import App from './App';

import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='womanup_todo/*' element={<App />}/>
      </Routes>
    </BrowserRouter>
  </Provider>,
);

