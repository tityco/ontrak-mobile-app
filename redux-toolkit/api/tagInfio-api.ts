import { API_ENDPOINTS } from "@/constants/ApiEndpoints";
import { api } from "./api";

export const tagInfoApi = api.injectEndpoints({
  endpoints: (build) => ({
    getListTagInfo: build.query<any, any>({
      query: (mapid) =>`${API_ENDPOINTS.TAG_MAP_API.CONTROLLER}${API_ENDPOINTS.TAG_MAP_API.SElECT_ALL_BY_MAP_ID}?mapid=${mapid}`,
    }),
  }),
});

export const { useGetListTagInfoQuery } = tagInfoApi;