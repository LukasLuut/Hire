import { apiRequest } from "./ApiClient";


export const hireAPI = {

  create: async (data: {price:number, providerId: number, userId: number, serviceId: number}) => {

    const response: any =  await apiRequest("/hires", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price: data.price,
        description_service: "Serviço realizado para o cliente",
        userId: data.userId,
        providerId: data.providerId,
        serviceId: data.serviceId
      }),
    });

    if(!response) return;
    return response.id;
  },

  deleteHire: async (id: number) => {
    const response = await apiRequest(`/hires/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
    return response;
  },

  concludeHire: async (id: number) => {
    const response = await apiRequest(`/hires/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "CONCLUIDO"
      })
    })
    return response;
  }
};


