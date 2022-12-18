import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/storeHook';
import { register } from '../../Redux/userSlice';

import styles from './Register.module.scss';

const Register = () => {
  const dispatch = useAppDispatch();
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
    if (localStorage.getItem('isAuth') === "true") {
      navigate('overview');
    }
  }, []);

  const onSumbit = () => {
    dispatch(register({
      name: nameValue,
      lastname: lastnameValue,
      email: emailValue,
      password: passwordValue,
    }));    
  };

  const validate = () => {
    let name = /^[а-яёА-Яёa-zA-Z]+$/.test(nameInputRef.current?.value as string);
    let lastname = /^[а-яёА-Яёa-zA-Z]+$/.test(lastnameInputRef.current?.value as string);
    let email = /^([a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+)$/.test(
      emailInputRef.current?.value as string,
    );
    let password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      passwordInputRef.current?.value as string,
    );

    if (!name) {
      setNameError('Имя может содержать только буквы');
    }
    if (!lastname) {
      setLastnameError('Фамилия может содержать только буквы');
    }
    if (!email) {
      setEmailError('Неправильный Email. Пример: example@mail.ru');
    }
    if (!password) {
      setPasswordError(`От 8-ми симв. Строчные, заглавные, цифры и символы(!"'№;%:?*)`);
    }

    if (name && lastname && email && password) {
      onSumbit();
    }
  };

  return (
    <div className={styles.register_page}>
      <div className={styles.wrapper}>
        <h1>WomanUP todo</h1>
        <input
          ref={nameInputRef}
          value={nameValue}
          onChange={() => setNameValue(nameInputRef.current?.value as string)}
          type="text"
          name="name"
          id="name"
          placeholder="Имя"
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
        />
        <span className={styles.register_error}>{lastnameError}</span>
        <input
          ref={emailInputRef}
          value={emailValue}
          onChange={() => setEmailValue(emailInputRef.current?.value as string)}
          type="email"
          name="email"
          id="email"
          placeholder="email"
        />
        <span className={styles.register_error}>{emailError}</span>
        <input
          ref={passwordInputRef}
          value={passwordValue}
          onChange={() => setPasswordValue(passwordInputRef.current?.value as string)}
          type="password"
          name="password"
          id="password"
          placeholder="Пароль"
        />
        <span className={styles.register_error}>{passwordError}</span>
        <button onClick={validate}>Register</button>
        <Link to="../login">или войти</Link>
      </div>
    </div>
  );
};

export default Register;
