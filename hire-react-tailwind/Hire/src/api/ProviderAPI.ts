import type { ProviderForm } from "../components/ProviderRegistration/ProviderRegistration/helpers/types-and-helpers";
import type { Service } from "../interfaces/ServiceInterface";
import { apiRequest } from "./ApiClient";

export const providerApi = {

  create: async (data: FormData, token: string) => {

    data.forEach((e, l) => {
      console.log(l + ": " + e)
    })

    return await apiRequest("/providers", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: data,
    });
  },

  getByUser: async (token: string): Promise<ProviderForm | null>  => {
    const response: ProviderForm = await apiRequest('/providers', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    if(!response || typeof response == "undefined") return null;
    return response;
  },

  getServices: async (token: string) => {
    const response = await apiRequest('/providers/services', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    if(!response) return null;
    return response;
  }
};


