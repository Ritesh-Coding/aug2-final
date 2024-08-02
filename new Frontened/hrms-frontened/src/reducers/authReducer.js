
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  role: null,
  isAuthenticated: false,
  userId:null,
  firstName : null,
  lastName : null,
  navTitle : null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    navbarTitle : (state,action)=>{
      state.navTitle = action.payload.navTitle
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.isAuthenticated = false;
      state.userId= null;
      state.firstName = null;
      state.lastName = null;
    },
  },
});

export const { loginSuccess, logout,navbarTitle } = authSlice.actions;
export default authSlice.reducer;
