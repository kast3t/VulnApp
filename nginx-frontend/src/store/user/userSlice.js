import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    user: null,
    isAuth: false,
    isLoading: true,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload
            state.isAuth = true
            state.isLoading = false
        },
        logout: (state) => {
            state.user = null
            state.isAuth = false
            state.isLoading = false
        },
    },
})

export const { login, logout } = userSlice.actions

export default userSlice.reducer
