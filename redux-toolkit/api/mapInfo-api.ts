import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import { api } from "./api";

export const mapInfoApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMapInfo: build.query<any, any>({
      query: (mapid) =>`${API_ENDPOINTS.MAP_API.CONTROLLER}${API_ENDPOINTS.MAP_API.GET_MAP_BY_ID}?id=${mapid}`,
    }),
  }),
});

export const { useGetMapInfoQuery } = mapInfoApi;