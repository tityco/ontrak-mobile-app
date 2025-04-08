
import { configureStore } from "@reduxjs/toolkit";
import todoSlice from "./todoReducerSliceTookit";
import userSlice from "./userReducerSliceToolkit";
import findingSlice from "./findingReducerSliceTookit";
import mapInfoSlice from "./mapInfoReducerSliceTookit";
import tagsInfolice from "./tagsInfoReducerSliceToolkit";
import tagsInfoSlice from "./tagsInfoReducerSliceToolkit";


const storeToolkit = configureStore({
  reducer: {
    todoList: todoSlice.reducer,
    user: userSlice.reducer,
    finding: findingSlice.reducer,
    mapInfo: mapInfoSlice.reducer,
    tagsInfo: tagsInfoSlice.reducer,
  },
})
export default storeToolkit;