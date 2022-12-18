import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { addDoc, collection, getDoc, getDocs } from 'firebase/firestore/lite';
import { auth, DB } from '../firebase';

export type UserType = {
  name: string;
  lastname: string;
  email: string | null;
  token: string | null;
  id: string | null;
  isAuth: boolean;
  photo: string;
};

type fetchUserData = { email: string; password: string; name: string; lastname: string };

const initialState: UserType = {
  name: '',
  lastname: '',
  email: null,
  token: null,
  id: null,
  isAuth: false,
  photo: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserType>) {
      state.name = action.payload.name;
      state.lastname = action.payload.lastname;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.isAuth = action.payload.isAuth;
      state.photo = action.payload.photo;
      localStorage.setItem('userName', action.payload.name as string);
      localStorage.setItem('userLastname', action.payload.lastname as string);
      localStorage.setItem('token', action.payload.token as string);
      localStorage.setItem('userId', action.payload.id as string);
      localStorage.setItem('userEmail', action.payload.email as string);
      localStorage.setItem('isAuth', JSON.stringify(action.payload.isAuth));
      localStorage.setItem('userPhoto', action.payload.photo);
    },
    getUser(state) {
      let name = localStorage.getItem('userName') as string;
      let lastname = localStorage.getItem('userLastname') as string;
      let token = localStorage.getItem('token') as string;
      let id = localStorage.getItem('userId') as string;
      let email = localStorage.getItem('userEmail') as string;
      let isAuth = localStorage.getItem('isAuth') as string;
      let photo = localStorage.getItem('userPhoto') as string;

      state.name = name;
      state.lastname = lastname;
      state.email = email;
      state.token = token;
      state.id = id;
      state.isAuth = isAuth === 'true' ? true : false;
      state.photo = photo === "null" ? "" : photo ;
    },
    removeUser(state) {
      state.name = '';
      state.lastname = '';
      state.email = null;
      state.token = null;
      state.id = null;
      state.isAuth = false;
      state.photo = '';
      localStorage.removeItem('userName');
      localStorage.removeItem('userLastname');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAuth');
      localStorage.removeItem('userPhoto');
    },
  },
});

const provider = new GoogleAuthProvider();

export const googleLogin = createAsyncThunk('googleAuthStatus', async (_, Thunk) => {
  const dispatch = Thunk.dispatch;
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const { uid, email, displayName, photoURL } = result.user;
      dispatch(
        setUser({
          id: uid,
          token: token as string,
          email: email,
          isAuth: true,
          name: displayName ?? '',
          lastname: '',
          photo: photoURL ?? '',
        }),
      );
      let userID = localStorage.getItem('userId') as string;

      !userID &&
        addDoc(collection(DB, `userData/${uid}/user`), {
          email,
          password: null,
          name: displayName,
          lastname: '',
          photo: photoURL,
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + ' ' + errorMessage);
    });
});

export const register = createAsyncThunk<void, fetchUserData>(
  'registerStatus',
  async ({ name, lastname, email, password }, Thunk) => {
    const dispatch = Thunk.dispatch;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const { uid, email } = userCredential.user;
        addDoc(collection(DB, `userData/${uid}/user`), {
          email,
          password: password,
          name,
          lastname,
          photo: null,
        });
        dispatch(
          setUser({
            id: uid,
            email: email,
            token: '',
            isAuth: true,
            name,
            lastname,
            photo: '',
          }),
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + ' ' + errorMessage);
      });
  },
);

export const login = createAsyncThunk<void, fetchUserData>(
  'emailAuthStatus',
  async ({ email, password  }, Thunk) => {
    const dispatch = Thunk.dispatch;

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const { uid, email, refreshToken } = userCredential.user;

        const querySnapshot = await getDocs(collection(DB, `userData/${uid}/user`));
        const {name, lastname, photo} = querySnapshot.docs[0].data();
        dispatch(
          setUser({
            id: uid,
            token: refreshToken,
            email,
            isAuth: true,
            name,
            lastname,
            photo: photo,
          }),
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + ' ' + errorMessage);
      });
  },
);

export const { setUser, removeUser, getUser } = userSlice.actions;
export default userSlice.reducer;
