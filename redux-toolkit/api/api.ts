import { API_URL } from '@/constants/Constant';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}` }),
  endpoints: () => ({}),
});