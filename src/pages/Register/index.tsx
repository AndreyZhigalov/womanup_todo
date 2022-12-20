import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import { AuthStatus, register, userSliceSelector } from '../../Redux/userSlice';

import styles from './Register.module.scss';
import loaderStyle from '../../App.module.scss';

const Register = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(userSliceSelector);
  const navigate = useNavigate();

  const [nameValue, setNameValue] = React.useState<string>('');
  const [lastnameValue, setLastnameValue] = React.useState<string>('');
  const [emailValue, setEmailValue] = React.useState<string>('');
  const [passwordValue, setPasswordValue] = React.useState<string>('');

  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const lastnameInputRef = React.useRef<HTMLInputElement>(null);
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  const [nameError, setNameError] = React.useState<string>('');
  const [lastnameError, setLastnameError] = React.useState<string>('');
  const [emailError, setEmailError] = React.useState<string>('');
  const [passwordError, setPasswordError] = React.useState<string>('');

  React.useEffect(() => {
    if (localStorage.getItem('isAuth') === 'true') {
      navigate('overview');
    }
  }, []);

  const onSubmit = () => {
    dispatch(
      register({
        name: nameValue,
        lastname: lastnameValue,
        email: emailValue,
        password: passwordValue,
      }),
    );
  };

  const validate = () => {
    let name = /^[а-яёА-Яёa-zA-Z]+$/.test(nameInputRef.current?.value as string);
    let lastname = /^[а-яёА-Яёa-zA-Z]+$/.test(lastnameInputRef.current?.value as string);
    let email = /^([a-zA-Z0-9\\.\\_\\-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+)$/.test(
      emailInputRef.current?.value as string,
    );
    let password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      passwordInputRef.current?.value as string,
    );

    if (!name) {
      nameInputRef.current?.value.length === 0
        ? setNameError('Обязательное поле')
        : setNameError('Имя может содержать только буквы');
    }
    if (!lastname) {
      if (lastnameInputRef.current?.value && lastnameInputRef.current?.value.length > 0) {
        setLastnameError('Фамилия может содержать только буквы');
      }
    }
    if (!email) {
      emailInputRef.current?.value.length === 0
        ? setEmailError('Обязательное поле')
        : setEmailError('Неправильный Email. Пример: example@mail.ru');
    }
    if (!password) {
      passwordInputRef.current?.value.length === 0
        ? setPasswordError('Обязательное поле')
        : setPasswordError(`От 8-ми символов. Включая заглавные, цифры и символы(!"'№;%:?*)`);
    }

    if (name && email && password) {
      onSubmit();
    }
  };

  return (
    <div className={styles.register_page}>
      {status === AuthStatus.LOADING && (
        <div className={loaderStyle.loading_auth__overlay}>
          <span className={loaderStyle.loader}></span>
        </div>
      )}
      <form
        className={styles.wrapper}
        onSubmit={(e) => {
          e.preventDefault();
          validate();
        }}>
        <h1>WomanUP todo</h1>
        <input
          ref={nameInputRef}
          value={nameValue}
          onChange={() => setNameValue(nameInputRef.current?.value as string)}
          type="text"
          name="name"
          id="name"
          placeholder="Имя*"
          maxLength={40}
        />
        <span className={styles.register_error}>{nameError}</span>
        <input
          ref={lastnameInputRef}
          value={lastnameValue}
          onChange={() => setLastnameValue(lastnameInputRef.current?.value as string)}
          type="text"
          name="lastname"
          id="lastname"
          placeholder="Фамилия"
          maxLength={40}
        />
        <span className={styles.register_error}>{lastnameError}</span>
        <input
          ref={emailInputRef}
          value={emailValue}
          onChange={() => setEmailValue(emailInputRef.current?.value as string)}
          type="email"
          name="email"
          id="email"
          placeholder="Email*"
          maxLength={40}
        />
        <span className={styles.register_error}>{emailError}</span>
        <input
          ref={passwordInputRef}
          value={passwordValue}
          onChange={() => setPasswordValue(passwordInputRef.current?.value as string)}
          type="password"
          name="password"
          id="password"
          placeholder="Пароль*"
          maxLength={30}
        />
        <span className={styles.register_error}>{passwordError}</span>
        <button type="submit">Создать аккаунт</button>
        <Link to="../login">или войти</Link>
      </form>
    </div>
  );
};

export default Register;
