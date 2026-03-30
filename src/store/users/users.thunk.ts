import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "../../api/service/user.service";
import type { PropertyListRequest, PropertyPagination } from "../../api/types";

export const fetchUsers = createAsyncThunk<
  PropertyPagination,
  { page: number; filters?: Partial<PropertyListRequest> },
  { rejectValue: string }
>(
  "users/fetchUsers",
  async ({ page, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers({ page, ...filters });
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
