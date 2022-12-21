import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import { clearInputs, settingsSliceSelector, toggleTheme } from '../../Redux/settingsSlice';
import { removeUser } from '../../Redux/userSlice';

import styles from './Sidebar.module.scss';

const Sidebar = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(settingsSliceSelector);

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
              <span className={styles.icon + ' ' + styles.home_icon}></span>
              Основная
            </Link>
          </li>
          <li>
            <Link to="stats" className={pathname.endsWith('stats') ? styles.active : undefined}>
              <span className={styles.icon + ' ' + styles.stats_icon}></span>
              Статистика
            </Link>
          </li>
          <li>
            <Link
              to="projects"
              className={pathname.endsWith('projects') ? styles.active : undefined}>
              <span className={styles.icon + ' ' + styles.project_icon}></span>
              Проекты
            </Link>
          </li>
          <li>
            <Link to="chat" className={pathname.endsWith('chat') ? styles.active : undefined}>
              <span className={styles.icon + ' ' + styles.chat_icon}></span>
              Чат
            </Link>
          </li>
          <li>
            <Link
              to="calendar"
              className={pathname.endsWith('calendar') ? styles.active : undefined}>
              <span className={styles.icon + ' ' + styles.calendar_icon}></span>
              Календарь
            </Link>
          </li>
        </ul>
        <ul>
          <li className={styles.theme_switcher}>
            <span
              onClick={() => dispatch(toggleTheme())}
              className={`${styles.switch} ${theme === 'dark' ? styles.active : ''}`}></span>
            Тема
          </li>
          <li>
            <Link
              to="settings"
              className={pathname.endsWith('settings') ? styles.active : undefined}>
              <span className={styles.icon + ' ' + styles.settings_icon}></span>
              Настройки
            </Link>
          </li>
          <li
            onClick={() => {
              dispatch(removeUser());
              dispatch(clearInputs());
            }}>
            <Link to="login" className={pathname.endsWith('login') ? styles.active : undefined}>
              <span className={styles.icon + ' ' + styles.logout_icon}></span>
              Выйти
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default Sidebar;
