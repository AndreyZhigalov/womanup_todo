import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import { AuthStatus, register, userSliceSelector } from '../../Redux/userSlice';
import useSignValidate from '../../hooks/useSignValidate';

import Loader from '../../components/Loader';

import styles from './Register.module.scss';


const Register = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(userSliceSelector);
  const navigate = useNavigate();
  const validate = useSignValidate()

  const [name, setName] = React.useState<string>('');
  const [lastname, setLastname] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

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
        name: name,
        lastname: lastname,
        email: email,
        password: password,
      }),
    );
  };

  return (
    <div className={styles.register_page}>
      {status === AuthStatus.LOADING && <Loader />}
      <form
        className={styles.wrapper}
        onSubmit={(e) => {
          e.preventDefault();
          validate({
            email,
            password,
            name,
            lastname,
            submitCallback: onSubmit,
            errorsCallback: {
              nameError: setNameError,
              lastnameError: setLastnameError,
              emailError: setEmailError,
              passwordError: setPasswordError,
            },
          });
        }}>
        <h1>WomanUP todo</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          name="name"
          id="name"
          placeholder="Имя*"
          maxLength={40}
        />
        <span className={styles.register_error}>{nameError}</span>
        <input
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          type="text"
          name="lastname"
          id="lastname"
          placeholder="Фамилия"
          maxLength={40}
        />
        <span className={styles.register_error}>{lastnameError}</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          id="email"
          placeholder="Email*"
          maxLength={40}
        />
        <span className={styles.register_error}>{emailError}</span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
