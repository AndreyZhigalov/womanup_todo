import React from 'react';
import { useNavigate, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/storeHook';
import { getTaskList } from './Redux/tasksSlice';

import MainLayout from './layouts/MainLayout';
import Overview from './pages/Overview';
import Stats from './pages/Stats';
import Projects from './pages/Projects';
import Chat from './pages/Chat';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

import styles from './App.module.scss';

function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate();
  const isAuth = useAppSelector((state) => state.userSlice.isAuth);

  React.useEffect(() => {
    dispatch(getTaskList());
    if (!localStorage.getItem('isAuth')) {      
      navigate('/login');
    }
    if (isAuth) {
      navigate('/overview');
    }
  }, [isAuth]);

  return (
    <div className={styles.App}>
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
