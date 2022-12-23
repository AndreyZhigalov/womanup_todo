import { DB, user } from '../firebase';
import { updatePassword, updateProfile, updateEmail } from 'firebase/auth';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore/lite';
import { useAppDispatch, useAppSelector } from './storeHook';
import {
  clearPasswordInputs,
  clearSettingErrors,
  setError,
  settingsSliceSelector,
  setUploadingStatus,
  UserdataUpdateStatus,
} from './../Redux/settingsSlice';
import { setName, setLastname, setEmail, userSliceSelector } from '../Redux/userSlice';

export default function useSettingsValidate() {
  const dispatch = useAppDispatch();
  const {
    nameInput,
    lastnameInput,
    emailInput,
    newPasswordInput,
    currentPasswordInput,
    repeatNewPasswordInput,
  } = useAppSelector(settingsSliceSelector);
  const { id } = useAppSelector(userSliceSelector);

  return async () => {
    dispatch(clearSettingErrors());

    // ВАЛИДАЦИЯ
    let nameValid = /^[а-яёА-Яёa-zA-Z]+$/.test(nameInput as string);
    let lastnameValid = /^[а-яёА-Яёa-zA-Z]+$/.test(lastnameInput as string);
    let emailValid = /^([a-zA-Z0-9\\.\\_\\-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+)$/.test(emailInput);
    let newPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      newPasswordInput as string,
    );

    // ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
    const accountData = await getDocs(collection(DB, `userData/${id}/user/`)).then(
      (res) => res.docs[0],
    );
    const accountID = accountData.id;
    const pass = accountData.data().password;

    // ОБНОВЛЕНИЕ ПАРОЛЯ
    if (currentPasswordInput === pass) {
      dispatch(setUploadingStatus(UserdataUpdateStatus.UPLOADING));

      if (newPassword && newPasswordInput === repeatNewPasswordInput) {

        try {
          user && (await updatePassword(user, newPasswordInput));
          updateDoc(doc(DB, `userData/${id}/user/${accountID}`), {
            password: newPasswordInput,
          });
          dispatch(clearPasswordInputs());
          dispatch(setUploadingStatus(UserdataUpdateStatus.SUCCESS));
        } catch (error) {
          console.error(error);
          alert("Не удалось обновить пароль")
        }

      } else {
        dispatch(setUploadingStatus(UserdataUpdateStatus.ERROR));
        dispatch(setError('new password'));
      }
      
    } else {
      currentPasswordInput.length && dispatch(setError('current password'));
    }

    // ОБНОВЛЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
    !nameValid && dispatch(setError('name'));

    !lastnameValid && lastnameInput.length && dispatch(setError('lastname'));

    !emailValid && dispatch(setError('email'));

    if (nameValid && emailValid && (lastnameValid || !lastnameInput.length)) {
      dispatch(setUploadingStatus(UserdataUpdateStatus.UPLOADING));

      try {
        updateDoc(doc(DB, `userData/${id}/user/${accountID}`), {
          name: nameInput,
          lastname: lastnameInput,
          email: emailInput,
        });

        user &&
          updateProfile(user, { displayName: `${nameInput} ${lastnameInput}` }).then(() => {
            dispatch(setUploadingStatus(UserdataUpdateStatus.SUCCESS));
          });

        user &&
          updateEmail(user, emailInput).then(() => {
            dispatch(setUploadingStatus(UserdataUpdateStatus.SUCCESS));
          });

        dispatch(setName(nameInput));
        dispatch(setLastname(lastnameInput));
        dispatch(setEmail(emailInput));
      } catch (error) {
        console.error(error);
        dispatch(setUploadingStatus(UserdataUpdateStatus.ERROR));
        alert("Не удалось обновить данные пользователя")
      }
    }
  };
}
