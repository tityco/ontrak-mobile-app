import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import { api } from "./api";

export const pathInfoApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAllPath: build.query<any, any>({
      query: (mapid) =>`${API_ENDPOINTS.PATH_MAP_API.CONTROLLER}${API_ENDPOINTS.PATH_MAP_API.GET_ALL_PATH_MAP}?mapid=${mapid}`,
    }),
  }),
});

export const { useGetAllPathQuery } = pathInfoApi;