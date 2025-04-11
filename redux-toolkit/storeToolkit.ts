
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api/api";
import findingSlice from "./slice/finding-slice";
import mapInfoSlice from "./slice/mapInfo-slice";
import listTagsInfoSlice from "./slice/lsittagsInfo-slice";


const storeToolkit = configureStore({
  reducer: {
    finding: findingSlice.reducer,
    mapInfo: mapInfoSlice.reducer,
    listtagsInfo: listTagsInfoSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export default storeToolkit;