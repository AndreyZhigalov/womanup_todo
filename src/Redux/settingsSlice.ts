import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type settingsSliceType = {
  nameInput: string;
  lastnameInput: string;
  emailInput: string;
  currentPasswordInput: string;
  newPasswordInput: string;
  repeatNewPasswordInput: string;
  errors: ErrorsType;
  avatarError: boolean;
  nameError: boolean;
  lastnameError: boolean;
  emailError: boolean;
  currentPasswordError: boolean;
  passwordMatchError: boolean;
  passwordError: boolean;
};

type ErrorsType = {
  avatar: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  notMatch: string;
  wrongPassword: string;
};

const initialState: settingsSliceType = {
  nameInput: '',
  lastnameInput: '',
  emailInput: '',
  currentPasswordInput: '',
  newPasswordInput: '',
  repeatNewPasswordInput: '',
  errors: {
    avatar: 'Не более 3Mb',
    name: 'Может содержать только буквы',
    lastname: 'Может содержать только буквы',
    email: 'Неправильный формат Email. Пример: example@mail.ru',
    password: 'От 8-ми символов. Включая заглавные, цифры и символы(!"\'№;%:?*)',
    notMatch: 'Пароли не совпадают',
    wrongPassword: 'Неверный пароль',
  },
  avatarError: false,
  nameError: false,
  lastnameError: false,
  emailError: false,
  currentPasswordError: false,
  passwordMatchError: false,
  passwordError: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setNameInput(state, action: PayloadAction<string>) {
      state.nameInput = action.payload;
    },
    setLastnameInput(state, action: PayloadAction<string>) {
      state.lastnameInput = action.payload;
    },
    setEmailInput(state, action: PayloadAction<string>) {
      state.emailInput = action.payload;
    },
    setCurrentPasswordInput(state, action: PayloadAction<string>) {
      state.currentPasswordInput = action.payload;
    },
    setNewPasswordInput(state, action: PayloadAction<string>) {
      state.newPasswordInput = action.payload;
    },
    setRepeatNewPasswordInput(state, action: PayloadAction<string>) {
      state.repeatNewPasswordInput = action.payload;
    },
    setSettingsInitialState(
      state,
      action: PayloadAction<{ name: string; email: string; lastname: string }>,
    ) {
      state.nameInput = action.payload.name;
      state.lastnameInput = action.payload.lastname;
      state.emailInput = action.payload.email;
    },
    setAvatarError(state, action: PayloadAction<boolean>) {
      state.avatarError = action.payload;
    },
    setNameError(state, action: PayloadAction<boolean>) {
      state.nameError = action.payload;
    },
    setLastnameError(state, action: PayloadAction<boolean>) {
      state.lastnameError = action.payload;
    },
    setEmailError(state, action: PayloadAction<boolean>) {
      state.emailError = action.payload;
    },
    setCurrentPasswordError(state, action: PayloadAction<boolean>) {
      state.currentPasswordError = action.payload;
    },
    setPasswordMatchError(state, action: PayloadAction<boolean>) {
      state.passwordMatchError = action.payload;
    },
    setPasswordError(state, action: PayloadAction<boolean>) {
      state.passwordError = action.payload;
    },
    clearInputs(state) {
      state.currentPasswordInput = ""
      state.newPasswordInput = ""
      state.repeatNewPasswordInput = ""
    }
  },
});

export const {
  setNameInput,
  setLastnameInput,
  setEmailInput,
  setCurrentPasswordInput,
  setNewPasswordInput,
  setRepeatNewPasswordInput,
  setSettingsInitialState,
  setAvatarError,
  setNameError,
  setLastnameError,
  setEmailError,
  setCurrentPasswordError,
  setPasswordMatchError,
  setPasswordError,
  clearInputs,
} = settingsSlice.actions;

export default settingsSlice.reducer;
