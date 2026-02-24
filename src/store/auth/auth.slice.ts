import { createSlice } from "@reduxjs/toolkit";
import { registerUser } from "./auth.thunk";
import type { User } from "./auth.types";

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user")!)
        : null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },

        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(
                registerUser.fulfilled,
                (state, action) => {
                    state.loading = false;

                    if (action.payload) {
                        state.user = action.payload.user || null;
                        state.token = action.payload.access_token || null;
                        state.isAuthenticated = !!(action.payload.access_token);

                        if (action.payload.access_token) {
                            localStorage.setItem("token", action.payload.access_token);
                        }
                        if (action.payload.user) {
                            localStorage.setItem("user", JSON.stringify(action.payload.user));
                        }
                    }
                }
            )

            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
