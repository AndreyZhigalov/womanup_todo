import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

export type UserType = {
  email: string | null;
  token: string | null;
  id: string | null;
  isAuth: boolean;
};

const initialState: UserType = {
  email: null,
  token: null,
  id: null,
  isAuth: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserType>) {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
      state.isAuth = action.payload.isAuth;
      localStorage.setItem('token', action.payload.token as string);
      localStorage.setItem('userId', action.payload.id as string);
      localStorage.setItem('userEmail', action.payload.email as string);
      localStorage.setItem('isAuth', JSON.stringify(action.payload.isAuth));
    },
    removeUser(state) {
      state.email = null;
      state.token = null;
      state.id = null;
      state.isAuth = false;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAuth');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(googleLogin.pending, (state, action) => {});
    builder.addCase(googleLogin.rejected, (state, action) => {});
    builder.addCase(googleLogin.fulfilled, (state, action) => {});
  },
});

const provider = new GoogleAuthProvider();

export const googleLogin = createAsyncThunk('googleAuthStatus', async (_, Thunk) => {
  const dispatch = Thunk.dispatch;
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const { uid, email } = result.user;
      dispatch(setUser({ id: uid, token: token as string, email: email, isAuth: true }));
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + ' ' + errorMessage);
    });
});

export const login = createAsyncThunk<void, { email: string; password: string }>(
  'emailAuthStatus',
  async ({ email, password }, Thunk) => {
    const dispatch = Thunk.dispatch;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const { uid, email, refreshToken } = userCredential.user;
        dispatch(setUser({ id: uid, token: refreshToken, email: email, isAuth: true }));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + ' ' + errorMessage);
      });
  },
);

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
