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
  imageUrl: string,
  provider?:{
    id?: number,
    professionalName?: string,
    profileImageUrl?: string,
    description?: string
  }
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
        imageUrl: e.imageUrl,
        provider:{
          id: e.provider?.id,
          professionalName: e.provider?.professionalName,
          profileImageUrl: e.provider?.profileImageUrl,
          description: e.provider?.description
        }
  
      }
    })

    return services;
    },

  getServiceById: async (id: number): Promise<ServiceData | null> => {
  const response: ServiceData = await apiRequest(`/services/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if(!response || typeof(response) == undefined) return null;

    return {
      id: response.id,
      title: response.title,
      description_service: response.description_service,
      category: response.category,
      subcategory: response.subcategory,
      price: response.price,
      active: true,
      duration: response.duration,
      rating: 4.6,
      imageUrl: response.imageUrl,
      provider:{
        id: response.provider?.id,
        professionalName: response.provider?.professionalName,
        profileImageUrl: response.provider?.profileImageUrl,
        description: response.provider?.description

      }

    }
  },

  deleteUser: async (id: number) => {
    const response = await apiRequest(`/services/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    })
    return response;
  },

  update: async (
    id: number,
    data: FormData
  ) => {
    const response = await apiRequest(`/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: data
    })
    return response;
  },
};


