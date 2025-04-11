import { api } from "./api";

export const mapInfoApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMapInfo: build.query<any, any>({
      query: (mapid) =>`/MapApi/GetMapByID?id=${mapid}`,
    }),
  }),
});

export const { useGetMapInfoQuery } = mapInfoApi;