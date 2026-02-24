import type { Property, PropertyPagination } from "../../api/types";

export interface UsersState {
  items: Property[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

export type UsersResponse = PropertyPagination;
