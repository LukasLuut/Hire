import type { Category } from "../interfaces/CategoryInterface";
import { apiRequest } from "./ApiClient";



export const categoryAPI = {

//   create: async (data: Service) => {
//     return await apiRequest("/services", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title: data.title,
//         description_service: data.description_service,
//         negotiable: data.negotiable,
//         price: data.price,
//         duration: data.duration,
//         providerId: 1,
//         categoryId: 1
//       }),
//     });
//   },

  getCategory: async (): Promise<Category[] | null> => {
    const response: Category[] = await apiRequest("/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(!response || typeof(response) == undefined) return null;
    return response;
  },

  getCategoryById: async (id: number): Promise<Category | null> => {
    const response: Category = await apiRequest(`/categories/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(!response || typeof(response) == undefined) return null;
    return response;
  },

  getCategoryNameById: async (id: number): Promise<string | null> => {
    const response: Category = await apiRequest(`/categories/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(!response || typeof(response) == undefined) return null;
    return response.name;
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


