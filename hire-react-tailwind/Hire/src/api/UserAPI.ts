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
        acceptedTerms: data.acceptedTerms
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
  acceptedTerms: boolean
}

export interface UserLoginAPI {
  email: string;
  password: string;
}
