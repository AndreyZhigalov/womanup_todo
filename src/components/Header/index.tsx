import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import { clearInput, setInput } from '../../Redux/searchSlice';

import styles from './Header.module.scss';

const Header = () => {
  const [user, setUser] = React.useState<any>();
  const [showProfileOptions, setShowProfileOptions] = React.useState<boolean>();
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()
  const input = useAppSelector(state => state.searchSlice.input)

  React.useEffect(() => {
    try {
      fetch('https://randomuser.me/api/')
        .then((res) => res.json())
        .then((json) => setUser(json.results[0]));
    } catch (error) {
      alert('Обишка запроса случайного пользователя');
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.search_block}>
        <i className={styles.search_icon + ' fa-solid fa-magnifying-glass'}></i>
        <input
          ref={inputRef}
          type="text"
          className={styles.search_input}
          value={input}
          onChange={() => dispatch(setInput(inputRef.current?.value as string))}
        />
        <i className={styles.clear_icon + ' fa-regular fa-trash-can'} onClick={() => dispatch(clearInput())}></i>
      </div>
      <div className={styles.user_block}>
        <i className={styles.questions + ' fa-regular fa-circle-question'}></i>
        <i className={styles.notice + ' fa-regular fa-bell'}></i>
        <div className={styles.name_and_options}>
          <div>
            <h4 onClick={() => setShowProfileOptions(!showProfileOptions)}>
              {user?.name?.first + ' ' + user?.name?.last}
            </h4>
            <i className="fa-solid fa-angle-down"></i>
          </div>
          <ul className={showProfileOptions ? styles.show_options : ''}>
            <li>Профиль</li>
            <li>Настройки</li>
          </ul>
        </div>
        <img src={user?.picture.thumbnail} alt="" className={styles.avatar} />
      </div>
    </header>
  );
};

export default Header;
