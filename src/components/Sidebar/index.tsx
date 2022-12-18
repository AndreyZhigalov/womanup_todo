import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/storeHook';
import { removeUser } from '../../Redux/userSlice';

import styles from './Sidebar.module.scss';

const Sidebar = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  return (
    <section className={styles.sidebar}>
      <h1 className={styles.logo}>
        WomanUP <span>todo</span>
      </h1>
      <nav className={styles.nav_panel}>
        <ul>
          <li>
            <Link
              to="overview"
              className={pathname.endsWith('overview') ? styles.active : undefined}>
              <i className="fa-solid fa-house"></i>
              Основная
            </Link>
          </li>
          <li>
            <Link to="stats" className={pathname.endsWith('stats') ? styles.active : undefined}>
              <i className="fa-solid fa-chart-simple"></i>
              Статистика
            </Link>
          </li>
          <li>
            <Link
              to="projects"
              className={pathname.endsWith('projects') ? styles.active : undefined}>
              <i className="fa-solid fa-folder-open"></i>
              Проекты
            </Link>
          </li>
          <li>
            <Link to="chat" className={pathname.endsWith('chat') ? styles.active : undefined}>
              <i className="fa-regular fa-comment-dots"></i>
              Чат
            </Link>
          </li>
          <li>
            <Link
              to="calendar"
              className={pathname.endsWith('calendar') ? styles.active : undefined}>
              <i className="fa-regular fa-calendar"></i>
              Календарь
            </Link>
          </li>
        </ul>
        <ul>
          <li>
            <Link
              to="settings"
              className={pathname.endsWith('settings') ? styles.active : undefined}>
              <i className="fa-solid fa-gear"></i>
              Настройки
            </Link>
          </li>
          <li onClick={() => dispatch(removeUser())}>
            <Link to="login" className={pathname.endsWith('login') ? styles.active : undefined}>
              {<i className="fa-solid fa-arrow-right-to-bracket"></i> && (
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
              )}
              Выйти
            </Link>
          </li>
        </ul>
      </nav>
     
    </section>
  );
};

export default Sidebar;
