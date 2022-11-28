import React from 'react';
import { useAppDispatch } from '../../hooks/storeHook';
import { googleLogin, login } from '../../Redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';

import googleIcon from '../../assets/free-icon-google-2991148.png';

import styles from '../Login/Login.module.scss';

const Login = () => {
  const dispatch = useAppDispatch();
  const [emailValue, setEmailValue] = React.useState<string>('');
  const [passwordValue, setPasswordValue] = React.useState<string>('');
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('isAuth')) {
      navigate('/overview');
    }
  }, []);

  return (
    <div className={styles.login_page}>
      <div className={styles.wrapper}>
        <h1>WomanUP todo</h1>
        <input
          ref={emailInputRef}
          value={emailValue}
          onChange={() => setEmailValue(emailInputRef.current?.value as string)}
          type="email"
          name=""
          id=""
          placeholder="email"
        />
        <input
          ref={passwordInputRef}
          value={passwordValue}
          onChange={() => setPasswordValue(passwordInputRef.current?.value as string)}
          type="password"
          name=""
          id=""
          placeholder="password"
        />
        <button
          type="submit"
          onClick={() => dispatch(login({ email: emailValue, password: passwordValue }))}>
          login
        </button>
        <span>или</span>
        <button aria-labelledby="google" onClick={() => dispatch(googleLogin())}>
          <img src={googleIcon} alt="" />
        </button>
        <Link to={'/register'}>или зарегистрироваться</Link>
      </div>
    </div>
  );
};

export default Login;
