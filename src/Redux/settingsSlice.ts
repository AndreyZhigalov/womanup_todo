import { RootState } from './store';
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
  newPasswordError: boolean;
  repeatPasswordError: boolean;
  theme: string;
  status: string;
};

export enum UserdataUpdateStatus {
  WAITING = 'Waiting for user data updating',
  ERROR = 'User data updating failed',
  UPLOADING = 'User data uploading to DB',
  SUCCESS = 'User data have been uploaded',
}

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
  newPasswordError: false,
  repeatPasswordError: false,
  theme: 'light',
  status: UserdataUpdateStatus.WAITING,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setInputs(state, action: PayloadAction<{ name: string; value: string }>) {
      const name = action.payload.name;
      const value = action.payload.value;
      switch (name) {
        case 'name':
          state.nameInput = value;
          break;
        case 'lastname':
          state.lastnameInput = value;
          break;
        case 'email':
          state.emailInput = value;
          break;
        case 'currentPassword':
          state.currentPasswordInput = value;
          break;
        case 'newPassword':
          state.newPasswordInput = value;
          break;
        case 'repeatNewPassword':
          state.repeatNewPasswordInput = value;
          break;
      }
    },
    setSettingsInitialState(
      state,
      action: PayloadAction<{ name: string; email: string; lastname: string }>,
    ) {
      state.nameInput = action.payload.name;
      state.lastnameInput = action.payload.lastname;
      state.emailInput = action.payload.email;
    },
    setError(state, action: PayloadAction<string>) {
      switch (action.payload) {
        case 'avatar':
          state.avatarError = !state.avatarError;
          break;
        case 'name':
          state.nameError = !state.nameError;
          break;
        case 'lastname':
          state.lastnameError = !state.lastnameError;
          break;
        case 'email':
          state.emailError = !state.emailError;
          break;
        case 'current password':
          state.currentPasswordError = !state.currentPasswordError;
          break;
        case 'new password':
          state.newPasswordError = !state.newPasswordError;
          break;
        case 'repeat password':
          state.repeatPasswordError = !state.repeatPasswordError;
          break;
      }
    },
    clearPasswordInputs(state) {
      state.currentPasswordInput = '';
      state.newPasswordInput = '';
      state.repeatNewPasswordInput = '';
    },
    clearSettingErrors(state) {
      state.avatarError = false;
      state.nameError = false;
      state.lastnameError = false;
      state.emailError = false;
      state.currentPasswordError = false;
      state.newPasswordError = false;
      state.repeatPasswordError = false;
    },
    toggleTheme(state) {
      const theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', theme);
      state.theme = theme;
    },
    setTheme(state, action: PayloadAction<string>) {
      const theme = action.payload;
      localStorage.setItem('theme', theme);
      state.theme = theme;
    },
    setUploadingStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
  },
});

export const settingsSliceSelector = (state: RootState) => state.settingsSlice;

export const {
  setInputs,  
  setSettingsInitialState,
  clearPasswordInputs,
  toggleTheme,
  setTheme,
  setUploadingStatus,
  clearSettingErrors,
  setError,
} = settingsSlice.actions;

export default settingsSlice.reducer;
