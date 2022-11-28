import React from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/storeHook';
import { setUser } from '../../Redux/userSlice';
import { auth } from '../../firebase';

import styles from './Register.module.scss';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [emailValue, setEmailValue] = React.useState<string>('');
  const [passwordValue, setPasswordValue] = React.useState<string>('');
  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (localStorage.getItem('isAuth')) {
      navigate('/overview')
    }
  }, []);

  const register = () => {
    createUserWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((userCredential) => {
        navigate('/login');
        const { uid, email } = userCredential.user;
        dispatch(setUser({ id: uid, email: email, token: '', isAuth: false }));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + ' ' + errorMessage);
      });
  };

  return (
    <div className={styles.register_page}>
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
        <button onClick={register}>Register</button>
        <Link to={'/login'}>или войти</Link>
      </div>
    </div>
  );
};

export default Register;
