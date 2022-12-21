import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/storeHook';
import { getTaskList } from './Redux/tasksSlice';
import { getUser, userSliceSelector } from './Redux/userSlice';

import MainLayout from './layouts/MainLayout';
import Calendar from './pages/Calendar';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Projects from './pages/Projects';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Stats from './pages/Stats';

import styles from './App.module.scss';
import { setTheme, settingsSliceSelector } from './Redux/settingsSlice';

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
        <Route path="" element={<MainLayout />}>
          <Route path="" element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="stats" element={<Stats />} />
          <Route path="projects" element={<Projects />} />
          <Route path="chat" element={<Chat />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<h1>NOT FOUND 404</h1>} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
