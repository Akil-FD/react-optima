import type { Property, PropertyPagination, PropertyListRequest } from "../../api/types";

export interface UsersState {
  items: Property[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  filters: Partial<PropertyListRequest>;
}

export type UsersResponse = PropertyPagination;
