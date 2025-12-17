import type { Service } from "../interfaces/ServiceInterface";
import { apiRequest } from "./ApiClient";


export interface ServiceData {
  id: number,
  title: string,
  description_service: string,
  category: {id: number, name: string, description: string},
  subcategory: string,
  price: number,
  active: boolean,
  duration: string,
  rating: number,
  imageUrl: string
}

export const serviceAPI = {

  create: async (data: FormData) => {
    return await apiRequest("/services", {
      method: "POST",
      body: data,
    });
  },

  getServices: async (): Promise<ServiceData[] | null> => {
    const response: ServiceData[] = await apiRequest("/services", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(!response || typeof(response) == undefined) return null;

    const services =
    response.map((e) => {
      return {
        id: e.id,
        title: e.title,
        description_service: e.description_service,
        category: e.category,
        subcategory: e.subcategory,
        price: e.price,
        active: true,
        duration: e.duration,
        rating: 4.6,
        imageUrl: e.imageUrl
  
      }
    })

    return services;
    },


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


