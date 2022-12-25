import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import { AuthStatus, googleLogin, login, userSliceSelector } from '../../Redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import useSignValidate from '../../hooks/useSignValidate';

import Loader from '../../components/Loader';

import googleIcon from '../../assets/free-icon-google-2991148.png';

import styles from '../Login/Login.module.scss';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAppSelector(userSliceSelector);
  const validate = useSignValidate();

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

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
    dispatch(login({ email: email, password: password, name, lastname }));
  };

  return (
    <div className={styles.login_page}>
      {status === AuthStatus.LOADING && <Loader />}
      <form
        className={styles.wrapper}
        onSubmit={(e) => {
          e.preventDefault();
          validate({
            email,
            password,
            name: null,
            lastname: null,
            submitCallback: onSubmit,
            errorsCallback: {
              emailError: setEmailError,
              passwordError: setPasswordError,
              lastnameError: () => {},
              nameError: () => {},
            },
          });
        }}>
        <h1>WomanUP todo</h1>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          maxLength={40}
        />
        <span className={styles.login_error}>{emailError}</span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          id="password"
          placeholder="Пароль"
          maxLength={30}
        />
        <span className={styles.login_error}>{passwordError}</span>
        <button type="submit">Войти</button>
        <button aria-labelledby="google" type="button" onClick={() => dispatch(googleLogin())}>
          <img src={googleIcon} alt="" />
        </button>
        <span className={styles.login_error}>
          {status === AuthStatus.ERROR && 'Неверный логин или пароль'}
        </span>
        <Link to="../register">или создать аккаунт</Link>
      </form>
    </div>
  );
};

export default Login;
