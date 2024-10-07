import useReducer from './user/userSlice'
import { configureStore } from '@reduxjs/toolkit'


export const store = configureStore({
  reducer: {
    user: useReducer
  },
})
