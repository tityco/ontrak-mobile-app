import { createListenerMiddleware } from "@reduxjs/toolkit";
import listTagsInfoSlice from "../slice/lsittagsInfo-slice";
import threeMapService from "@/services/three-map.service";
import findingSlice from "../slice/finding-slice";

export const listenerMiddleware = createListenerMiddleware();


listenerMiddleware.startListening({
  actionCreator: listTagsInfoSlice.actions.updateTag,
  effect: async (action, listenerApi) => {
    const updatedTags = action.payload;
    threeMapService.onTagUpdate(updatedTags);
  },
});


listenerMiddleware.startListening({
  actionCreator: findingSlice.actions.chageDestination,
  effect: async (action, listenerApi) => {
    const updatedTags = action.payload;
    threeMapService.onChageDestination(updatedTags);
  },
});

listenerMiddleware.startListening({
  actionCreator: findingSlice.actions.changeStart,
  effect: async (action, listenerApi) => {
    const updatedTags = action.payload;
    threeMapService.onChangeStart(updatedTags);
  },
});