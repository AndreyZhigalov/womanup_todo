import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/storeHook';
import { getTaskList } from './Redux/tasksSlice';
import { getUser, userSliceSelector } from './Redux/userSlice';
import { setTheme, settingsSliceSelector } from './Redux/settingsSlice';

import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';

import styles from './App.module.scss';

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth } = useAppSelector(userSliceSelector);
  const { theme } = useAppSelector(settingsSliceSelector);

  const localTheme = localStorage.getItem('theme');

  React.useEffect(() => {
    dispatch(getTaskList());
    dispatch(getUser());
    if (localTheme) dispatch(setTheme(localTheme));
  }, []);

  React.useEffect(() => {
    if (!isAuth) {
      navigate('login');
    }
    if (isAuth) {
      const path = location.pathname.match(/\/[a-z]+$/)?.[0].substring(1);
      return path === 'register' || path === 'login' ? navigate('overview') : navigate(path ?? '');
    }
  }, [isAuth]);

  return (
    <div className={styles.App} data-theme={theme}>
        <Routes>
          <Route path="/*" element={<MainLayout />}/>               
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </div>
  );
}

export default App;
