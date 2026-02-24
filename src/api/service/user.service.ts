import { handleApiError } from "../../utils/apiError";
import { API_END_POINTS } from "../../utils/constant";
import { api } from "../axios";
import type { ApiResponse, PropertyListRequest, PropertyPagination } from "../types";


export const userService = {
   async getUsers(req: PropertyListRequest): Promise<PropertyPagination> {
          try {
              const response = await api.get<ApiResponse<PropertyPagination>>(API_END_POINTS.USER_PROPERTY_LIST_GET, {
                  params: { ...req },
              });
              return response.data.data;
          } catch (error) {
              throw handleApiError(error);
          }
      },
};
