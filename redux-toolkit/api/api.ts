import { API_URL } from '@/constants/Constant';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const customBaseQuery = async (args:any, api:any, extraOptions:AnalyserNode) => {
  //console.log(' API Request:', args);

  const rawBaseQuery = fetchBaseQuery({ baseUrl: API_URL });
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    //console.error('API Error:', result.error);
  } else {
   // console.log('API Response:', result.data);
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
});


