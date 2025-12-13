import type { Address } from "../interfaces/AddressInterface";
import { apiRequest } from "./ApiClient";



export const addressAPI = {

  create: async (data: Address, token: string) => {
    return await apiRequest("/users/me/address", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         "Authorization": "Bearer " + token
         },
      body: JSON.stringify({
        num: data.num,
        street: data.street,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        country: "Brazil",
        postalCode: data.postalCode
      }),
    });
  },

  
};


