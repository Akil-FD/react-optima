import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./users/users.slice";
import authReducer from "./auth/auth.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        users: usersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;