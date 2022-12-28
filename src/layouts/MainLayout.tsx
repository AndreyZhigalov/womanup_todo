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
  const [showMenu, setShowMenu] = React.useState<boolean>(false)
  return (
    <div className={styles.main_layout}>
      <Sidebar showMenu={showMenu} setShowMenu={setShowMenu} />
      <Header showMenu={showMenu} />
      <div className={styles.overlay} data-menu={showMenu}></div>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="" element={<Overview showMenu={showMenu} />} />
          <Route path="overview" element={<Overview showMenu={showMenu} />} />
          <Route path="stats" element={<Stats showMenu={showMenu} />} />
          <Route path="projects" element={<Projects showMenu={showMenu} />} />
          <Route path="chat" element={<Chat showMenu={showMenu} />} />
          <Route path="calendar" element={<Calendar showMenu={showMenu} />} />
          <Route path="settings" element={<Settings showMenu={showMenu} />} />
          <Route path="*" element={<h1>NOT FOUND 404</h1>} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default MainLayout