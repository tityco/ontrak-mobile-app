import { createSelector } from "@reduxjs/toolkit"

export const userNameSelector = (state: any) => state.user.name
export const todoListSelector = (state: any) => state.todoList
export const selectedStartSelector = (state: any) => state.finding.selectedStart
export const selectedDestinationSelector = (state: any) => state.finding.selectedDestination
export const mapInfoSelector = (state: any) => state.mapInfo
export const tagsInfoSelector = (state: any) => state.tagsInfo