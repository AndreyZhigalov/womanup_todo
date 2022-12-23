import React from 'react';
import { useAppSelector } from '../../../hooks/storeHook';
import useAvatarUpload from '../../../hooks/useAvatarUpload';
import { settingsSliceSelector, UserdataUpdateStatus } from '../../../Redux/settingsSlice';
import { userSliceSelector } from '../../../Redux/userSlice';

import avatarPlaceholder from '../../../assets/avatar_placeholder.png';

import styles from "./AvatarField.module.scss"

const AvatarField = () => {
  const { photo } = useAppSelector(userSliceSelector);
  const { errors, avatarError, status } = useAppSelector(settingsSliceSelector);

  const avatarRef = React.useRef<HTMLInputElement>(null);
  const setAvatar = useAvatarUpload();
  
  const [fileChanged, setFileChanged] = React.useState<boolean>(false);

  React.useEffect(() => {
    setAvatar(avatarRef);
  }, [fileChanged]);

  return (
    <fieldset className={styles.avatar_wrapper}>
      <img className={styles.avatar} src={photo || avatarPlaceholder} alt="Аватарка" />
      <input
        className={styles.hidden}
        ref={avatarRef}
        type="file"
        name="photo"
        id="photo"
        accept="image/jpeg"
        onChange={() => setFileChanged((state) => !state)}
      />
      <button
        type="button"
        disabled={status === UserdataUpdateStatus.UPLOADING}
        className={`${styles.avatar_upload_button} ${
          status === UserdataUpdateStatus.UPLOADING && styles.button_uploading_animation
        }`}
        onClick={() => avatarRef.current?.click()}>
        Обновить
      </button>
      {avatarError && <span className={styles.error}>{errors.avatar}</span>}
    </fieldset>
  );
};

export default AvatarField;
