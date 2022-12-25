import React, { Suspense } from 'react'

import {  Route, Routes } from 'react-router-dom'
import Header from '../components/Header'
import Loader from '../components/Loader'
import Sidebar from '../components/Sidebar'

import styles from "./MainLayout.module.scss"

const Calendar = React.lazy(() => import('../pages/Calendar'));
const Chat = React.lazy(() => import('../pages/Chat'));
const Overview = React.lazy(() => import('../pages/Overview'));
const Projects = React.lazy(() => import('../pages/Projects'));
const Settings = React.lazy(() => import('../pages/Settings'));
const Stats = React.lazy(() => import('../pages/Stats'));

const MainLayout = () => {
  
  return (
    <div className={styles.main_layout}>
      <Sidebar />
      <Header />
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="" element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="stats" element={<Stats />} />
          <Route path="projects" element={<Projects />} />
          <Route path="chat" element={<Chat />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<h1>NOT FOUND 404</h1>} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default MainLayout