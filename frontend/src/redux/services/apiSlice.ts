import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fireStoreApi = createApi({
 reducerPath: "firestoreApi",
 baseQuery: fetchBaseQuery({
  baseUrl: "https://backend.sanskaraggarwal2025.workers.dev", // Replace with your actual backend URL
  prepareHeaders: (headers) => {
   // Retrieve the token from localStorage
   const token = localStorage.getItem("token"); // Replace 'token' with your actual key in localStorage

   if (token) {
    headers.set("Authorization", `Bearer ${token}`);
   }

   return headers;
  },
 }),
 tagTypes: ["Tasks"],
 endpoints: (builder) => ({
  fetchDataFromDb: builder.query<{ [key: string]: any }[], void>({
   async queryFn() {
    try {
     const response = await fetch("https://backend.sanskaraggarwal2025.workers.dev/api/v1/board/", {
      method: "GET",
      headers: {
       Authorization: `Bearer ${localStorage.getItem("token")}`, // Fetch the token from localStorage
      },
     });
     if (!response.ok) {
      throw new Error("Failed to fetch tasks");
     }
     let data = await response.json();
     // console.log(data);
     data = [
      {
       boards: data
      }
     ];
     
     return { data };
    } catch (e: any) {
     return { error: e.message };
    }
   },
   providesTags: ["Tasks"],
  }),
  updateBoardToDb: builder.mutation({
   async queryFn(arg) {
    try {
     const response = await fetch("https://backend.sanskaraggarwal2025.workers.dev/api/tasks", {
      method: "PUT",
      headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${localStorage.getItem("token")}`, // Fetch the token from localStorage
      },
      body: JSON.stringify(arg), // Assuming `arg` is the data to update
     });
     if (!response.ok) {
      throw new Error("Failed to update tasks");
     }
     const data = await response.json();
     return { data };
    } catch (e: any) {
     return { error: e.message };
    }
   },
   invalidatesTags: ["Tasks"],
  }),
 }),
});

// Export hooks for using the created endpoint
export const { useFetchDataFromDbQuery, useUpdateBoardToDbMutation } =
 fireStoreApi;
