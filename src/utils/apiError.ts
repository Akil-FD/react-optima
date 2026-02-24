import { AxiosError } from "axios";
import type { ApiError } from "../api/types";

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      status: error.response?.status,
    };
  }

  return {
    message: "Unexpected error occurred",
  };
}
