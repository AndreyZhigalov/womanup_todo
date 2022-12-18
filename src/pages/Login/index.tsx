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
      navigate('overview');
    }
  }, []);

  const onSubmit = () => {
    let name = localStorage.getItem('name') as string;
    let lastname = localStorage.getItem('lastname') as string;
    dispatch(login({ email: emailValue, password: passwordValue, name, lastname }));
  }


  return (
    <div className={styles.login_page}>
      <div className={styles.wrapper}>
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
        <input
          ref={passwordInputRef}
          value={passwordValue}
          onChange={() => setPasswordValue(passwordInputRef.current?.value as string)}
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
        <button type="submit" onClick={onSubmit}>
          login
        </button>
        <span>или</span>
        <button aria-labelledby="google" onClick={() => dispatch(googleLogin())}>
          <img src={googleIcon} alt="" />
        </button>
        <Link to="../register">или зарегистрироваться</Link>
      </div>
    </div>
  );
};

export default Login;
