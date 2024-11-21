import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem("token") || null,
        user: JSON.parse(localStorage.getItem("user")) || null,
        username: localStorage.getItem("username") || null,
        isLoggedIn: localStorage.getItem("isLoggedIn") || false,
        role: localStorage.getItem("role") || null
    },
    reducers: {
        login(state, action) {
            const { token, username, role } = action.payload;
            state.isLoggedIn = true;
            state.token = token;
            state.username = username;
            state.role = role;

            ['token', 'username', 'isLoggedIn', 'role'].forEach(key => {
                localStorage.setItem(key, state[key]);
            });

            const { user } = action.payload;
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));

        },

        logout(state) {
            state.isLoggedIn = false;
            state.token = null;
            state.user = null;
            state.username = null;
            state.role = null;

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('username');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('role');
        }
    }
});

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;