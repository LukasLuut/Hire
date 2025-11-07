import { apiRequest } from "./ApiClient";

export const userAPI = {
  create: async (data: UserAPI) => {
    apiRequest("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        cpf_cnpj: data.cpf,
        password: data.password,
      }),
    });
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


};

export interface UserAPI {
  name: string;
  cpf: string;
  email: string;
  password: string;
}

export interface UserLoginAPI {
  email: string;
  password: string;
}
