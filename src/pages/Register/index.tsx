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

  const validate = () => {
    let nameValid = /^[а-яёА-Яёa-zA-Z]+$/.test(name);
    let lastnameValid = /^[а-яёА-Яёa-zA-Z]+$/.test(lastname);
    let emailValid = /^([a-zA-Z0-9\\.\\_\\-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+)$/.test(email);
    let passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );

    if (!nameValid) {
      name.length === 0
        ? setNameError('Обязательное поле')
        : setNameError('Имя может содержать только буквы');
    }
    if (!lastnameValid) {
      if (lastname && lastname.length > 0) {
        setLastnameError('Фамилия может содержать только буквы');
      }
    }
    if (!emailValid) {
      email.length === 0
        ? setEmailError('Обязательное поле')
        : setEmailError('Неправильный Email. Пример: example@mail.ru');
    }
    if (!passwordValid) {
      password.length === 0
        ? setPasswordError('Обязательное поле')
        : setPasswordError(`От 8-ми символов. Включая заглавные, цифры и символы(!"'№;%:?*)`);
    }

    if (nameValid && emailValid && passwordValid) {
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
