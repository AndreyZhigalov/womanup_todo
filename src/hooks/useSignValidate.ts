type SignValidType = {
  email: string;
  password: string;
  name: string | null;
  lastname: string | null;
  submitCallback: () => void;
  errorsCallback: {
    nameError:  (value: string) => void ;
    emailError: (value: string) => void;
    lastnameError: (value: string) => void;
    passwordError: (value: string) => void;
  };
};


const useSignValidate = () => {
  return ({
    email,
    password,
    name,
    lastname,
    submitCallback,
    errorsCallback: { nameError, emailError, lastnameError, passwordError },
  }: SignValidType) => {
    let nameValid = /^[а-яёА-Яёa-zA-Z]+$/.test(name ?? "");
    let lastnameValid = /^[а-яёА-Яёa-zA-Z]+$/.test(lastname ?? "");
    let emailValid = /^([a-zA-Z0-9\\.\\_\\-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+)$/.test(email);
    let passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );

    if (!emailValid) {
      email.length === 0
        ? emailError('Обязательное поле')
        : emailError('Неправильный Email. Пример: example@mail.ru');
    }
    if (!passwordValid) {
      password.length === 0
        ? passwordError('Обязательное поле')
        : passwordError(`От 8-ми символов. Включая заглавные, цифры и символы(!"'№;%:?*)`);
    }

    if (name) {
      if (!nameValid) {
        name.length === 0
          ? nameError('Обязательное поле')
          : nameError('Имя может содержать только буквы');
      }

      if (!lastnameValid) {
        lastname && lastname.length > 0 && lastnameError('Фамилия может содержать только буквы');
      }

      nameValid && emailValid && passwordValid && submitCallback();
    }

    if (!name) {
      emailValid && passwordValid && submitCallback();
    }
  };
};

export default useSignValidate;
