import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import {
  clearSettingErrors,
  settingsSliceSelector,
  UserdataUpdateStatus,
} from '../../Redux/settingsSlice';
import useSettingsValidate from '../../hooks/useSettingsValidate';

import AvatarField from './AvatarField';
import UserDataField from './UserDataField';
import PasswordField from './PasswordField';

import styles from './Settings.module.scss';

const Settings: React.FC<{ showMenu: boolean }> = ({ showMenu }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(settingsSliceSelector);

  const validate = useSettingsValidate();

  React.useEffect(() => {
    dispatch(clearSettingErrors());
  }, []);

  return (
    <section className={`${styles.settings} ${styles.container}`} data-menu={showMenu}>
      <h2 className={styles.header}>Настройки профиля</h2>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          validate();
        }}>
        <AvatarField />
        <UserDataField />
        <PasswordField />
        <button
          disabled={status === UserdataUpdateStatus.UPLOADING}
          type="submit"
          className={`${styles.submit_button} ${
            status === UserdataUpdateStatus.UPLOADING && styles.button_uploading_animation
          }`}>
          Сохранить
        </button>
      </form>
    </section>
  );
};

export default Settings;
