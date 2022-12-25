import { RootState } from './store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { addDoc, collection, getDocs } from 'firebase/firestore/lite';
import { auth, DB } from '../firebase';

export type UserType = {
  name: string;
  lastname: string;
  email: string;
  token: string | null;
  id: string | null;
  isAuth: boolean;
  photo: string;
  status: AuthStatus;
};

export enum AuthStatus {
  LOADING = 'Getting user data from server',
  ERROR = 'User data fetching has been failed',
  SUCCESS = 'User data received',
  WAITING = 'Waiting user authorization',
}

type fetchUserData = { email: string; password: string; name: string; lastname: string };

const initialState: UserType = {
  name: '',
  lastname: '',
  email: '',
  token: null,
  id: null,
  isAuth: false,
  photo: '',
  status: AuthStatus.WAITING,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPhoto(state, action: PayloadAction<string>) {
      localStorage.setItem('userPhoto', action.payload);
      state.photo = action.payload;
    },
    setName(state, action: PayloadAction<string>) {
      localStorage.setItem('userName', action.payload);
      state.name = action.payload;
    },
    setLastname(state, action: PayloadAction<string>) {
      localStorage.setItem('userLastname', action.payload);
      state.lastname = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      localStorage.setItem('userEmail', action.payload);
      state.email = action.payload;
    },
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
      state.photo = photo === 'null' ? '' : photo;
    },
    removeUser(state) {
      state.name = '';
      state.lastname = '';
      state.email = '';
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
      state.status = AuthStatus.WAITING;
    },
    setStatus(state, action: PayloadAction<AuthStatus>) {
      state.status = action.payload;
    },
  },
});

const provider = new GoogleAuthProvider();

export const googleLogin = createAsyncThunk('googleAuthStatus', async (_, Thunk) => {
  const dispatch = Thunk.dispatch;
  dispatch(setStatus(AuthStatus.LOADING));

  signInWithPopup(auth, provider)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const { uid, email, displayName, photoURL } = result.user;
      const getUserData = await getDocs(collection(DB, `userData/${uid}/user`));
      const user = getUserData.docs[0]?.data();
      const [name, lastname] = displayName?.split(/\s/) ?? ['', ''];

      dispatch(
        setUser({
          id: uid,
          token: token as string,
          email: email ?? '',
          isAuth: true,
          name: name ?? '',
          lastname: lastname ?? '',
          photo: photoURL ?? '',
          status: AuthStatus.SUCCESS,
        }),
      );

      !user &&
        addDoc(collection(DB, `userData/${uid}/user`), {
          email,
          password: '',
          name: displayName,
          lastname: '',
          photo: photoURL,
        });
    })
    .catch((error) => {
      dispatch(setStatus(AuthStatus.ERROR));
      console.error(error.code);
      throw new Error(error.message);
    });
});

export const register = createAsyncThunk<void, fetchUserData>(
  'registerStatus',
  async ({ name, lastname, email, password }, Thunk) => {
    const dispatch = Thunk.dispatch;
    dispatch(setStatus(AuthStatus.LOADING));

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
            email: email ?? '',
            token: '',
            isAuth: true,
            name,
            lastname,
            photo: '',
            status: AuthStatus.SUCCESS,
          }),
        );
      })
      .catch((error) => {
        dispatch(setStatus(AuthStatus.ERROR));
        console.error(error.code);
        throw new Error(error.message);
      });
  },
);

export const login = createAsyncThunk<void, fetchUserData>(
  'emailAuthStatus',
  async ({ email, password }, Thunk) => {
    const dispatch = Thunk.dispatch;
    dispatch(setStatus(AuthStatus.LOADING));

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const { uid, email, refreshToken } = userCredential.user;
        const querySnapshot = await getDocs(collection(DB, `userData/${uid}/user`));
        const { name, lastname, photo } = querySnapshot.docs[0].data();

        dispatch(
          setUser({
            id: uid,
            token: refreshToken,
            email: email ?? '',
            isAuth: true,
            name,
            lastname,
            photo: photo,
            status: AuthStatus.SUCCESS,
          }),
        );
      })
      .catch((error) => {
        dispatch(setStatus(AuthStatus.ERROR));
        console.error(error.code);
        throw new Error(error.message);
      });
  },
);

export const userSliceSelector = (state: RootState) => state.userSlice;

export const { setUser, removeUser, getUser, setStatus, setPhoto, setName, setLastname, setEmail } =
  userSlice.actions;
export default userSlice.reducer;
