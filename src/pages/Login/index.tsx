import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import { AuthStatus, googleLogin, login, userSliceSelector } from '../../Redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';

import googleIcon from '../../assets/free-icon-google-2991148.png';

import styles from '../Login/Login.module.scss';
import loaderStyle from '../../App.module.scss';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {status} = useAppSelector(userSliceSelector);

  const [emailValue, setEmailValue] = React.useState<string>('');
  const [passwordValue, setPasswordValue] = React.useState<string>('');

  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  const [emailError, setEmailError] = React.useState<string>('');
  const [passwordError, setPasswordError] = React.useState<string>('');

  React.useEffect(() => {
    if (localStorage.getItem('isAuth')) {
      navigate('overview');
    }
  }, []);

  const onSubmit = () => {
    let name = localStorage.getItem('name') as string;
    let lastname = localStorage.getItem('lastname') as string;
    dispatch(login({ email: emailValue, password: passwordValue, name, lastname }));
  };

  const validate = () => {
    let email = /^([a-zA-Z0-9\\.\\_\\-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+)$/.test(
      emailInputRef.current?.value as string,
    );
    let password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      passwordInputRef.current?.value as string,
    );
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

    if (email && password) {
      onSubmit();
    }
  };

  return (
    <div className={styles.login_page}>
      {status === AuthStatus.LOADING && (
        <div className={loaderStyle.loading_auth__overlay}>
          <span className={loaderStyle.loader}></span>
        </div>
      )}
      <form className={styles.wrapper} onSubmit={(e) =>{ e.preventDefault(); validate()}}>
        <h1>WomanUP todo</h1>
        <input
          ref={emailInputRef}
          value={emailValue}
          onChange={() => setEmailValue(emailInputRef.current?.value as string)}
          type="email"
          name="email"
          id="email"
          placeholder="email"
        />
        <span className={styles.login_error}>{emailError}</span>
        <input
          ref={passwordInputRef}
          value={passwordValue}
          onChange={() => setPasswordValue(passwordInputRef.current?.value as string)}
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
        <span className={styles.login_error}>{passwordError}</span>
        <button type="submit" >
          login
        </button>
        <span>или</span>
        <button aria-labelledby="google" onClick={() => dispatch(googleLogin())}>
          <img src={googleIcon} alt="" />
        </button>
        <Link to="../register">или зарегистрироваться</Link>
      </form>
    </div>
  );
};

export default Login;
