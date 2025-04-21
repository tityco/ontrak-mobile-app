
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api/api";
import findingSlice from "./slice/finding-slice";
import mapInfoSlice from "./slice/mapInfo-slice";
import listTagsInfoSlice from "./slice/lsittagsInfo-slice";
import loadingSlice from "./slice/loading-slice";
import userSlice from "./slice/user-slice";
import searchSlice from "./slice/search-slice";
import { listenerMiddleware } from "./middleware/listenerMiddleware";
import listPathInfoSlice from "./slice/pathInfo-slice";


const storeToolkit = configureStore({
  reducer: {
    finding: findingSlice.reducer,
    mapInfo: mapInfoSlice.reducer,
    listtagsInfo: listTagsInfoSlice.reducer,
    listPathInfo: listPathInfoSlice.reducer,
    loading: loadingSlice.reducer,
    user: userSlice.reducer,
    search: searchSlice.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(api.middleware),
})

export default storeToolkit;