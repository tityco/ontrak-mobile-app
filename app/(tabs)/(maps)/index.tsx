import React, { useEffect, useState, } from 'react';
import { View, ActivityIndicator, Text} from 'react-native';
import { MAP_ID } from '@/constants/Constant';
import SignalRService from '@/services/signalr.service'
import { useDispatch, useSelector } from 'react-redux';
import { isLoadingMapScreenSelector} from '@/redux-toolkit/selector/selector-toolkit';
import { useGetMapInfoQuery } from '@/redux-toolkit/api/mapInfo-api';
import mapInfoSlice from '@/redux-toolkit/slice/mapInfo-slice';
import { useGetListTagInfoQuery } from '@/redux-toolkit/api/tagInfio-api';
import listTagsInfoSlice from '@/redux-toolkit/slice/lsittagsInfo-slice';
import MapViewComponent from '@/components/map-view/map-view.component';
import loadingSlice from '@/redux-toolkit/slice/loading-slice';
import styMap from '@/style_sheet/app/tabs/map';
import SearchTagComponent from '@/components/search-tag/search-tag.component';
import { MESSAGE } from '@/constants/Message';
import { useGetAllPathQuery } from '@/redux-toolkit/api/pathInfo-api';
import listPathInfoSlice from '@/redux-toolkit/slice/pathInfo-slice';

export default function MapScreen() {

  const dispatch = useDispatch();
  const { data: mapInfo, error: mapError, isLoading: isLoadingMap } = useGetMapInfoQuery(MAP_ID);
  const { data: listTagInfo, error: tagError, isLoading: isLoadingTag} = useGetListTagInfoQuery(MAP_ID);
  const { data: listPath, error: pathError, isLoading: isLoadingPath} = useGetAllPathQuery(MAP_ID);
  const isLoading = useSelector(isLoadingMapScreenSelector);

  const [serverTime, setServerTime] = useState(`${MESSAGE.CONNECTING}...`)

  useEffect(() => {
    dispatch(loadingSlice.actions.setLoadingMapScreen(MESSAGE.LOAIND_MAP));
  },[]);

  useEffect(() => {
    if(!isLoadingMap && !isLoadingTag && !isLoadingPath) {
      dispatch(loadingSlice.actions.removeLoadingMapScreen(MESSAGE.LOAIND_MAP));
      initData();
    }
  },[isLoadingMap, isLoadingTag, isLoadingPath]);

  const onReceivePosition = (data: any) => {
    dispatch(listTagsInfoSlice.actions.updateTag(data));
  }

  const onReceivePing = (data:any)=>{
   setServerTime(data)
  }

  const configSignalR = () => {
    SignalRService.onDisconnectCallback = (error: any) => {
      setServerTime(`${MESSAGE.CONNECTING}...`)
    }
    SignalRService.startConnection();
    SignalRService.on("SendPing", onReceivePing);
    SignalRService.on("SendPosition", onReceivePosition);
    SignalRService.on("Connected", (msg: any) => {});
    SignalRService.on("sendbasestation", (msg: any) => {})
  }

  const initData = () => {
    dispatch(mapInfoSlice.actions.changeMap(mapInfo));
    dispatch(listTagsInfoSlice.actions.changeTags(listTagInfo));
    dispatch(listPathInfoSlice.actions.changeTags(listPath));
    configSignalR();
  }


  return (
    <View style={{ flex: 1 }} >
      {isLoading && (
        <View style={styMap.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
      <MapViewComponent />
      <SearchTagComponent/>
      <View style={styMap.containerTime}>
        <Text>{serverTime}</Text>
      </View>
    </View>

  );
}
