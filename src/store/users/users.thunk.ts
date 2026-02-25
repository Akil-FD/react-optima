import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../api/service/user.service";
import type { PropertyPagination } from "../../api/types";

export const fetchUsers = createAsyncThunk<
  PropertyPagination,
  number,
  { rejectValue: string }
>(
  "users/fetchUsers",
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers({ page });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        Object.values(error.errors).flat().length
          ? Object.values(error.errors).flat().join(" , ")
          : "Failed to fetch users"
      );
    }
  }
);
