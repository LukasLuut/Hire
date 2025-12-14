import { apiRequest } from "./ApiClient";

export const providerApi = {

  create: async (data: FormData, token: string) => {
    return await apiRequest("/providers", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      },
      body: data,
    });
  },

};


