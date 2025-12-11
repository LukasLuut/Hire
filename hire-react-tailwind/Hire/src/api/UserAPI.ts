import type { User } from "../interfaces/UserInterface";
import { apiRequest } from "./ApiClient";

export const userAPI = {

  create: async (data: UserAPI) => {
    return await apiRequest("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        cpf_cnpj: data.cpf,
        password: data.password,
        acceptedTerms: data.acceptedTerms,
      }),
    });
  },

  getUser: async (token: string): Promise<User | null> => {
    const response: User = await apiRequest("/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
    });

    console.log("CCCCCCCCCCCCCCCCCC");
    console.log(response);
    if(!response || typeof(response) == undefined) return null;
    return response;
  },

  login: (data: UserLoginAPI) =>
    apiRequest("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    }),

  update: async (
    user: {
      name: string;
      about: string;
    },
    token: string
  ) => {
    const response = await apiRequest("/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token, // ← garante que token é válido
      },
      body: JSON.stringify({
        name: user.name,
        about: user.about,
      }),
    })
    return response;
  }
};

export interface UserAPI {
  name: string;
  cpf: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
}

export interface UserLoginAPI {
  email: string;
  password: string;
}
