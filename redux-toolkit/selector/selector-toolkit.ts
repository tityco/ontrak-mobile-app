import { createSelector } from "@reduxjs/toolkit"


/// Selector for finding slice
export const selectedStartSelector = (state: any) => state.finding.selectedStart
export const selectedDestinationSelector = (state: any) => state.finding.selectedDestination
export const isFindingSelector = (state: any) => state.finding.isFinding

/// Selector for mapInfo slice
export const mapInfoSelector = (state: any) => state.mapInfo

/// Selector for listTagsInfo slice
export const tagsInfoSelector = (state: any) => state.listtagsInfo

/// Selector for listPathInfo slice
export const pathInfoSelector = (state: any) => state.listPathInfo


// Selector for search slice
export const searchTagSelector = (state: any) => state.search.searchTag
export const listTagSearchFilter = createSelector([tagsInfoSelector, searchTagSelector], (tagInfo, search) => {
  if(!search) return tagInfo;
  return tagInfo.filter((tag:any) => tag.tagName.includes(search))
});

/// Selector for loading slice
export const isLoadingAllSelector = (state: any) => state.loading.isLoadingAll
export const isLoadingMapScreenSelector = (state: any) => state.loading.isLoadingMapScreen

/// Selector for user slice
export const isLoginSelector = (state: any) => state.user.isLogin
export const userNameSelector = (state: any) => state.user.name
export const userSelector = (state: any) => state.user.user

