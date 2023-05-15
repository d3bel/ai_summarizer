import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;
const articleBaseURL =
  "https://article-extractor-and-summarizer.p.rapidapi.com/";
const translatorBaseURL = "https://deep-translate1.p.rapidapi.com";

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: articleBaseURL,
    prepareHeaders: (headers) => {
      headers.set("X-RapidAPI-Key", rapidApiKey);
      headers.set(
        "X-RapidAPI-Host",
        "article-extractor-and-summarizer.p.rapidapi.com"
      );
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (params) =>
        `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`,
    }),
  }),
});

export const translatorApi = createApi({
  reducerPath: "translatorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: translatorBaseURL,
    prepareHeaders: (headers) => {
      headers.set("X-RapidAPI-Key", rapidApiKey);
      headers.set("X-RapidAPI-Host", "deep-translate1.p.rapidapi.com");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getTranslate: builder.query({
      query: ({ text, source, target }) => {
        const data = {
          q: text[0],
          target,
          source,
        };
        return {
          method: "POST",
          url: "/language/translate/v2",
          body: JSON.stringify(data),
        };
      },
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
export const { useLazyGetTranslateQuery } = translatorApi;
