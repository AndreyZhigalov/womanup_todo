import { useAppDispatch, useAppSelector } from '../../../hooks/storeHook';
import { setInputs, settingsSliceSelector } from '../../../Redux/settingsSlice';

import styles from '../Settings.module.scss';

const PasswordField = () => {
  const dispatch = useAppDispatch();
  const {
    currentPasswordInput,
    newPasswordInput,
    repeatNewPasswordInput,
    errors,
    currentPasswordError,
    newPasswordError,
    repeatPasswordError,
  } = useAppSelector(settingsSliceSelector);

  return (
    <fieldset className={styles.password_wrapper}>
      <label className={styles.option}>
        Текущий пароль
        <input
          className={styles.input}
          type="password"
          name="currentPassword"
          maxLength={30}
          onChange={(event) => dispatch(setInputs(event))}
          value={currentPasswordInput}
        />
      </label>
      {currentPasswordError && <span className={styles.error}>{errors.wrongPassword}</span>}
      <label className={styles.option}>
        Новый пароль
        <input
          className={styles.input}
          type="password"
          name="newPassword"
          maxLength={30}
          onChange={(event) => dispatch(setInputs(event))}
          value={newPasswordInput}
        />
      </label>
      {newPasswordError && <span className={styles.error}>{errors.notMatch}</span>}
      {repeatPasswordError && <span className={styles.error}>{errors.password}</span>}
      <label className={styles.option}>
        Повторите новый пароль
        <input
          className={styles.input}
          type="password"
          name="repeatNewPassword"
          maxLength={30}
          onChange={(event) => dispatch(setInputs(event))}
          value={repeatNewPasswordInput}
        />
      </label>
    </fieldset>
  );
};

export default PasswordField;
