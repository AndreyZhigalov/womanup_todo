import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/storeHook';
import {
  setInputs,
  setSettingsInitialState,
  settingsSliceSelector,
} from '../../../Redux/settingsSlice';
import { userSliceSelector } from '../../../Redux/userSlice';

import styles from '../Settings.module.scss';

const UserDataField = () => {
  const dispatch = useAppDispatch();
  const { nameInput, emailInput, lastnameInput, errors, nameError, lastnameError, emailError } =
    useAppSelector(settingsSliceSelector);
  const { name, email, lastname } = useAppSelector(userSliceSelector);

  React.useEffect(() => {
    if (name.length > 0) {
      dispatch(setSettingsInitialState({ name, email, lastname }));
    }
  }, [name]);

  return (
    <fieldset className={styles.user_data}>
      <label className={styles.option}>
        Имя
        <input
          className={styles.input}
          type="text"
          name="name"
          maxLength={40}
          onChange={(event) =>
            dispatch(setInputs({ name: event.target.name, value: event.target.value }))
          }
          value={nameInput}
        />
      </label>
      {nameError && <span className={styles.error}>{errors.name}</span>}
      <label className={styles.option}>
        Фамилия
        <input
          className={styles.input}
          type="text"
          name="lastname"
          maxLength={40}
          onChange={(event) =>
            dispatch(setInputs({ name: event.target.name, value: event.target.value }))
          }
          value={lastnameInput}
        />
      </label>
      {lastnameError && <span className={styles.error}>{errors.lastname}</span>}
      <label className={styles.option}>
        Email
        <input
          className={styles.input}
          type="text"
          name="email"
          maxLength={40}
          onChange={(event) =>
            dispatch(setInputs({ name: event.target.name, value: event.target.value }))
          }
          value={emailInput}
        />
      </label>
      {emailError && <span className={styles.error}>{errors.email}</span>}
    </fieldset>
  );
};

export default UserDataField;
