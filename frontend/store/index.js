import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice'
import projectReducer from '@/features/projects/projectSlice'
const store = configureStore({
  reducer:{
    auth : authReducer,
    Projects :projectReducer,
  }
});

export default store


