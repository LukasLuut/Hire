import { mockServices } from "../data/mockServices";

const API_URL = "https://seu-backend/api/services";

// Timeout helper
const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout = 3000) =>
  new Promise<Response>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), timeout);
    fetch(url, options)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });

export const ServiceAPI = {
  async getServices() {
    try {
      const res = await fetchWithTimeout(API_URL);
      if (!res.ok) throw new Error("Erro na API");
      return await res.json();
    } catch (err) {
      console.warn("Usando mockServices (sem conexão com o backend)");
      return mockServices;
    }
  },

  async updateService(id: number, data: any) {
    try {
      const res = await fetchWithTimeout(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao atualizar");
      return await res.json();
    } catch {
      console.warn("Simulando atualização local (modo mock)");
      return { ...data, id };
    }
  },
};
