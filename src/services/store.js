import { configureStore } from "@reduxjs/toolkit";

import { articleApi, translatorApi } from "./article";

export const store = configureStore({
  reducer: {
    [articleApi.reducerPath]: articleApi.reducer,
    [translatorApi.reducerPath]: translatorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(articleApi.middleware)
      .concat(translatorApi.middleware),
});
