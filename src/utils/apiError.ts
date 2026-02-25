import { AxiosError } from "axios";

export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      console.error("Server error data:", error.response.data);
      console.error("Status code:", error.response.status);

      return JSON.stringify(error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
      return "No response from server";
    } else {
      console.error("Axios setup error:", error.message);
      return error.message;
    }
  } else {
    console.error("Unknown error:", error);
    return "An unknown error occurred";
  }
}