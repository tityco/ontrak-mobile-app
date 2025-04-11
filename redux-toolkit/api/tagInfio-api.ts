import { api } from "./api";

export const tagInfoApi = api.injectEndpoints({
  endpoints: (build) => ({
    getListTagInfo: build.query<any, any>({
      query: (mapid) =>`/TagMapApi/SelectAllBuyMapID?mapid=${mapid}`,
    }),
  }),
});

export const { useGetListTagInfoQuery } = tagInfoApi;