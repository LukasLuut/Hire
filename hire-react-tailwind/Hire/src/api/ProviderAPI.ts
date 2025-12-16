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

  getByUser: async (token: string) => {
    const response = await apiRequest('/providers', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
    });

    if(!response || typeof response == "undefined") return null;
    return response;
  }

};


