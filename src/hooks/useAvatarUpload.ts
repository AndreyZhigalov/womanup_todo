import { userSliceSelector } from './../Redux/userSlice';
import { useAppDispatch, useAppSelector } from './storeHook';
import { updateProfile } from 'firebase/auth';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore/lite';
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { DB, storageRef, user } from '../firebase';
import {
  clearSettingErrors,
  setUploadingStatus,
  UserdataUpdateStatus,
  setError,
} from '../Redux/settingsSlice';
import { setPhoto } from '../Redux/userSlice';

export default function useAvatarUpload() {
  const dispatch = useAppDispatch();
  const { photo, id } = useAppSelector(userSliceSelector);

  return async (avatarRef: React.RefObject<HTMLInputElement>) => {
    dispatch(clearSettingErrors());

    let avatar = avatarRef.current?.files?.[0];

    if (avatar && id) {
      dispatch(setUploadingStatus(UserdataUpdateStatus.UPLOADING));
      const accountID = await getDocs(collection(DB, `userData/${id}/user/`)).then(
        (res) => res.docs[0].id,
      );

      if (photo.includes('firebase') && photo !== null) {
        const currentPhotoName = photo.split('%2F')[2].split('?')[0];
        const deleteLink = ref(storageRef, `${id}/avatar/${currentPhotoName}`);
        deleteObject(deleteLink);
      }
      const avatarLink = ref(storageRef, `${id}/avatar/${avatar.name}`);

      if (avatar.size <= 3145728) {
        
        try {
          await uploadBytes(avatarLink, avatar);
          getDownloadURL(avatarLink).then((url) => {
            user && updateProfile(user, { photoURL: url });
            updateDoc(doc(DB, `userData/${id}/user/${accountID}`), {
              photo: url,
            });
            dispatch(setPhoto(url));
            dispatch(setUploadingStatus(UserdataUpdateStatus.SUCCESS));
          });
        } catch (error) {
          dispatch(setUploadingStatus(UserdataUpdateStatus.ERROR));
          alert('Аватар не обновился');
        }

      } else {
        dispatch(setError('avatar'));
      }
    }
  };
}
