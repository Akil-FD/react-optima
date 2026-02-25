import type { AuthResponse } from "../../store/auth/auth.types";
import { handleApiError } from "../../utils/apiError";
import { API_END_POINTS } from "../../utils/constant";
import { isJsonString } from "../../utils/utils";
import { api } from "../axios";
import type { ApiResponse, CorporateRegisterRequest, OTPMailRequest, OTPMailVerify, OTPSmsRequest, OTPSmsVerify, RegisterRes } from "../types";


export const authService = {
    async requestOTPMail(payload: OTPMailRequest): Promise<ApiResponse<RegisterRes>> {
        try {
            const response = await api.post<ApiResponse<RegisterRes>>(API_END_POINTS.OTP_MAIL_REQUEST, payload);
            return response.data;
        } catch (error) {
            const message = handleApiError(error);
            alert(`${isJsonString(message) ? JSON.parse(message).error.mail[0] : message}`);
            throw new Error(message);
        }
    },
    async verifyOTPMail(payload: OTPMailVerify): Promise<RegisterRes> {
        try {
            const response = await api.post<ApiResponse<RegisterRes>>(API_END_POINTS.OTP_MAIL_VERIFY, payload);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
    async requestSmsMail(payload: OTPSmsRequest): Promise<RegisterRes> {
        try {
            const response = await api.post<ApiResponse<RegisterRes>>(API_END_POINTS.OTP_SMS_REQUEST, payload);
            return response.data;
        } catch (error) {
            const message = handleApiError(error);
            alert(`${isJsonString(message) ? JSON.parse(message).error.mobile[0] : message}`);
            throw new Error(message);
        }
    },
    async verifySmsMail(payload: OTPSmsVerify): Promise<RegisterRes> {
        try {
            const response = await api.post<ApiResponse<RegisterRes>>(API_END_POINTS.OTP_SMS_VERIFY, payload);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    async registerUser(
        payload: CorporateRegisterRequest
    ): Promise<AuthResponse> {
        try {
            const response = await api.post<AuthResponse>(
                API_END_POINTS.REGISTER,
                payload
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    }

};
