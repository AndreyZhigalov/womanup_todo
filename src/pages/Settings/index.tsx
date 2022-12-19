import { collection, doc, getDocs, updateDoc } from 'firebase/firestore/lite';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React from 'react';
import { DB, storageRef, user } from '../../firebase';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import {
  clearInputs,
  setAvatarError,
  setCurrentPasswordError,
  setCurrentPasswordInput,
  setEmailError,
  setEmailInput,
  setLastnameError,
  setLastnameInput,
  setNameError,
  setNameInput,
  setNewPasswordInput,
  setPasswordMatchError,
  setRepeatNewPasswordInput,
  setSettingsInitialState,
} from '../../Redux/settingsSlice';
import { setEmail, setLastname, setName, setPhoto, userSliceSelector } from '../../Redux/userSlice';

import avatarPlaceholder from '../../assets/avatar_placeholder.png';

import styles from './Settings.module.scss';
import {  updateEmail, updatePassword, updateProfile } from 'firebase/auth';

const Settings = () => {
  const dispatch = useAppDispatch();
  const { photo, name, email, lastname, id } = useAppSelector(userSliceSelector);
  const {
    nameInput,
    emailInput,
    lastnameInput,
    currentPasswordInput,
    newPasswordInput,
    repeatNewPasswordInput,
    errors,
    avatarError,
    nameError,
    lastnameError,
    emailError,
    currentPasswordError,
    passwordMatchError,
    passwordError,
  } = useAppSelector((state) => state.settingsSlice);

  const avatarRef = React.useRef<HTMLInputElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const lastnameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const currentPasswordRef = React.useRef<HTMLInputElement>(null);
  const newPasswordRef = React.useRef<HTMLInputElement>(null);
  const repeatNewPasswordRef = React.useRef<HTMLInputElement>(null);

  const [fileChanged, setFileChanged] = React.useState<boolean>(false);
  const [disableButton, setDisableButton] = React.useState<boolean>(false);

  React.useEffect(() => {
    dispatch(setAvatarError(false));
    dispatch(setCurrentPasswordError(false));
    dispatch(setEmailError(false));
    dispatch(setLastnameError(false));
    dispatch(setNameError(false));
    dispatch(setPasswordMatchError(false));
  }, []);

  React.useEffect(() => {
    if (name.length > 0) {
      dispatch(setSettingsInitialState({ name, email, lastname }));
    }
  }, [name]);

  React.useEffect(() => {
    let avatar = avatarRef.current?.files?.[0];
    (async () => {
      if (avatar && id) {
        setDisableButton(true);
         const accountID = await getDocs(collection(DB, `userData/${id}/user/`)).then(
           (res) => res.docs[0].id,
         );

        if (photo.includes('firebase') && photo !== null) {
          const currentPhotoName = photo.split('%2F')[2].split('?')[0];
          const deleteLink = ref(storageRef, `${id}/avatar/${currentPhotoName}`);
           deleteObject(deleteLink);
        }
        const avatarLink = ref(storageRef, `${id}/avatar/${avatar.name}`);

        if (avatar.size <= 3145728) {
          dispatch(setAvatarError(false));
          try {
            await uploadBytes(avatarLink, avatar);
            getDownloadURL(avatarLink).then((url) => {
              user && updateProfile(user, { photoURL: url });
              updateDoc(doc(DB, `userData/${id}/user/${accountID}`), {
                photo: url,
              });
              dispatch(setPhoto(url));
            });
          } catch (error) {
            alert('Аватар не обновился');
          }
        } else {
          dispatch(setAvatarError(true));
        }
        setDisableButton(false);
      }
    })();
  }, [fileChanged]);

  const validate = async () => {
    let nameValid = /^[а-яёА-Яёa-zA-Z]+$/.test(nameInput as string);
    let lastnameValid = /^[а-яёА-Яёa-zA-Z]+$/.test(lastnameInput as string);
    let emailValid = /^([a-zA-Z0-9\\.\\_\\-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+)$/.test(
      emailRef.current?.value as string,
    );
    let newPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      newPasswordInput as string,
    );

    const accountData = await getDocs(collection(DB, `userData/${id}/user/`)).then(
      (res) => res.docs[0],
    );
    const accountID = accountData.id;
    const pass = accountData.data().password;

    if (currentPasswordInput === pass) {
      dispatch(setCurrentPasswordError(false));
      if (newPassword && newPasswordInput === repeatNewPasswordInput) {
        dispatch(setPasswordMatchError(false));
        user && (await updatePassword(user, newPasswordInput));
        updateDoc(doc(DB, `userData/${id}/user/${accountID}`), {
          password: newPasswordInput,
        });
        dispatch(clearInputs());
      } else {
        dispatch(setPasswordMatchError(true));
      }
    } else {
      dispatch(setCurrentPasswordError(true));
    }

    nameValid ? dispatch(setNameError(false)) : dispatch(setNameError(true));

    lastnameValid
      ? dispatch(setLastnameError(false))
      : !lastnameInput.length
      ? dispatch(setLastnameError(false))
      : dispatch(setLastnameError(true));

    emailValid ? dispatch(setEmailError(false)) : dispatch(setEmailError(true));

    if (nameValid && emailValid && (lastnameValid || !lastnameInput.length)) {
      setDisableButton(true);
      updateDoc(doc(DB, `userData/${id}/user/${accountID}`), {
        name: nameInput,
        lastname: lastnameInput,
        email: emailInput,
      });
      user && updateProfile(user, { displayName: `${nameInput} ${lastnameInput}` });
      user && updateEmail(user, emailInput);
      dispatch(setName(nameInput));
      dispatch(setLastname(lastnameInput));
      dispatch(setEmail(emailInput));
      setDisableButton(false);
    }
  };

  return (
    <section className={styles.settings}>
      <h2 className={styles.header}>Настройки профиля</h2>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          validate();
        }}>
        <fieldset className={styles.avatar_wrapper}>
          <img className={styles.avatar} src={photo ?? avatarPlaceholder } alt="Аватарка" />
          <input
            className={styles.hidden}
            ref={avatarRef}
            type="file"
            name="photo"
            id="photo"
            accept="image/jpeg"
            onChange={() => setFileChanged((state) => !state)}
          />
          <button
            disabled={disableButton}
            className={styles.avatar_upload_button}
            onClick={() => avatarRef.current?.click()}>
            Обновить
          </button>
          {avatarError && <span className={styles.error}>{errors.avatar}</span>}
        </fieldset>
        <fieldset className={styles.user_data}>
          <label className={styles.option}>
            Имя
            <input
              ref={nameRef}
              className={styles.input}
              type="text"
              onChange={() => dispatch(setNameInput(nameRef.current?.value as string))}
              value={nameInput}
            />
          </label>
          {nameError && <span className={styles.error}>{errors.name}</span>}
          <label className={styles.option}>
            Фамилия
            <input
              ref={lastnameRef}
              className={styles.input}
              type="text"
              onChange={() => dispatch(setLastnameInput(lastnameRef.current?.value as string))}
              value={lastnameInput}
            />
          </label>
          {lastnameError && <span className={styles.error}>{errors.lastname}</span>}
          <label className={styles.option}>
            Email
            <input
              ref={emailRef}
              className={styles.input}
              type="text"
              onChange={() => dispatch(setEmailInput(emailRef.current?.value as string))}
              value={emailInput}
            />
          </label>
          {emailError && <span className={styles.error}>{errors.email}</span>}
        </fieldset>
        <fieldset className={styles.password_wrapper}>
          <label className={styles.option}>
            Текущий пароль
            <input
              ref={currentPasswordRef}
              className={styles.input}
              type="password"
              onChange={() =>
                dispatch(setCurrentPasswordInput(currentPasswordRef.current?.value as string))
              }
              value={currentPasswordInput}
            />
          </label>
          {currentPasswordError && <span className={styles.error}>{errors.wrongPassword}</span>}
          <label className={styles.option}>
            Новый пароль
            <input
              ref={newPasswordRef}
              className={styles.input}
              type="password"
              onChange={() =>
                dispatch(setNewPasswordInput(newPasswordRef.current?.value as string))
              }
              value={newPasswordInput}
            />
          </label>
          {passwordMatchError && <span className={styles.error}>{errors.notMatch}</span>}
          {passwordError && <span className={styles.error}>{errors.password}</span>}
          <label className={styles.option}>
            Повторите новый пароль
            <input
              ref={repeatNewPasswordRef}
              className={styles.input}
              type="password"
              onChange={() =>
                dispatch(setRepeatNewPasswordInput(repeatNewPasswordRef.current?.value as string))
              }
              value={repeatNewPasswordInput}
            />
          </label>
        </fieldset>
        <button disabled={disableButton} type="submit" className={styles.submit_button}>
          Сохранить
        </button>
      </form>
    </section>
  );
};

export default Settings;
