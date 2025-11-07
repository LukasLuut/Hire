export const userAPI = {
  create: async (data: UserAPI) => {
    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        cpf_cnpj: data.cpf,
        password: data.password,
      }),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      // lança um erro com informação do servidor (se existir)
      let message = "Erro na requisição";

      if (Array.isArray(body)) {
        // pega o primeiro erro, se existir
        message = Object.values(body[0])[0] as string;
      } else if (typeof body === "object" && body !== null) {
        // se vier um objeto único com mensagem
        message = body.message || body.error || message;
      }

      throw new Error(message);
    }
    return body;
  },

  login: async (data: UserLoginAPI) => {
    
  }
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
