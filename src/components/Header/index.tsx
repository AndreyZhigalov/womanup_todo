import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import { clearInput, setInput } from '../../Redux/searchSlice';
import { userSliceSelector } from '../../Redux/userSlice';
import {  useParams } from 'react-router-dom';

import avatarPlaceholder from '../../assets/avatar_placeholder.png';

import styles from './Header.module.scss';

const Header: React.FC<{ showMenu: boolean }> = ({ showMenu }) => {
  const dispatch = useAppDispatch();
  const input = useAppSelector((state) => state.searchSlice.input);
  const { name, lastname, photo } = useAppSelector(userSliceSelector);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const params = useParams();

  return (
    <header className={styles.header} data-menu={showMenu}>
      {(params['*']?.startsWith('overview') || !params['*']) && (
        <div className={styles.search_block}>
          <i className={styles.search_icon + ' fa-solid fa-magnifying-glass'}></i>
          <input
            ref={inputRef}
            type="text"
            className={styles.search_input}
            value={input}
            onChange={() => dispatch(setInput(inputRef.current?.value as string))}
          />
          {input && (
            <i
              className={styles.clear_icon + ' fa-regular fa-trash-can'}
              onClick={() => dispatch(clearInput())}></i>
          )}
        </div>
      )}
      <div className={styles.user_block}>
        <i className={styles.questions + ' fa-regular fa-circle-question'}></i>
        <i className={styles.notice + ' fa-regular fa-bell'}></i>
        <div className={styles.name_and_options}>
          <h4>{name + ' ' + lastname}</h4>
        </div>
        <img src={photo || avatarPlaceholder} alt="" className={styles.avatar} />
      </div>
    </header>
  );
};

export default Header;
