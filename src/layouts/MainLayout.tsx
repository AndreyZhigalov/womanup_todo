import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

import styles from "./MainLayout.module.scss"

const MainLayout = () => {
  
  return (
    <div className={styles.main_layout}>
    <Sidebar/>
    <Header/>
    <Outlet/>
    </div>
  )
}

export default MainLayout