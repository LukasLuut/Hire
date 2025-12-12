import type { Service } from "../interfaces/ServiceInterface";
import { apiRequest } from "./ApiClient";



export const serviceAPI = {

  create: async (data: Service) => {
    return await apiRequest("/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        description_service: data.description_service,
        negotiable: data.negotiable,
        price: data.price,
        duration: data.duration,
        providerId: 1,
        categoryId: data.categoryId,
        requiresScheduling: data.requiresScheduling,
        subcategory: data.subcategory
      }),
    });
  },

  // getUser: async (token: string): Promise<User | null> => {
  //   const response: User = await apiRequest("/users/me", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": "Bearer " + token,
  //     },
  //   });

  //   console.log("CCCCCCCCCCCCCCCCCC");
  //   console.log(response);
  //   if(!response || typeof(response) == undefined) return null;
  //   return response;
  // },

  // login: (data: UserLoginAPI) =>
  //   apiRequest("/auth/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       email: data.email,
  //       password: data.password,
  //     }),
  //   }),

  // update: async (
  //   user: {
  //     name: string;
  //     about: string;
  //   },
  //   token: string
  // ) => {
  //   const response = await apiRequest("/users/me", {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": "Bearer " + token, // ← garante que token é válido
  //     },
  //     body: JSON.stringify({
  //       name: user.name,
  //       about: user.about,
  //     }),
  //   })
  //   return response;
  // }
};


