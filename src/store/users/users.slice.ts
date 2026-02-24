import { createSlice, type ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { fetchUsers } from "./users.thunk";
import type { UsersState } from "./users.types";
import type { Property, PropertyPagination } from "../../api/types";

const initialState: UsersState = {
  items: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUsers: () => initialState,
    setPage(state, action) {
      state.page = action.payload;
    },
    setHasMore(state, action) {
      state.hasMore = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<UsersState>) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        const pagination = action.payload as PropertyPagination;
        
        if (!pagination || !pagination.data) {
          state.hasMore = false;
          return;
        }

        const properties: Property[] = pagination.data;
        const PER_PAGE = 10; // Default per page count
        
        const newItems = properties.filter(
          (newItem) =>
            !state.items.some((item) => item.id === newItem.id)
        );

        if (newItems.length > 0) {
          state.items.push(...newItems);
          state.page += 1;
          state.hasMore = newItems.length >= PER_PAGE;
        } else {
          state.hasMore = false;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUsers, setPage, setHasMore } = usersSlice.actions;
export default usersSlice.reducer;
