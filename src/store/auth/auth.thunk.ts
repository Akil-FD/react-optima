import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_END_POINTS } from "../../utils/constant";
import { authService } from "../../api/service/auth.service";
import type { CorporateRegisterRequest } from "../../api/types";
import type { AuthResponse } from "./auth.types";
import { isJsonString } from "../../utils/utils";

export const registerUser = createAsyncThunk<
    AuthResponse,
    CorporateRegisterRequest,
    { rejectValue: string }
>(
    API_END_POINTS.REGISTER,
    async (payload: CorporateRegisterRequest, { rejectWithValue }) => {
        try {
            const response = await authService.registerUser(payload);
            return response;
        } catch (error: any) {
            const message = isJsonString(error) ? JSON.parse(error).errors : error;
            return rejectWithValue(
                Object.values(message).flat().length
                    ? Object.values(message).flat().join(" , ")
                    : "Registration failed"
            );
        }
    }
);
