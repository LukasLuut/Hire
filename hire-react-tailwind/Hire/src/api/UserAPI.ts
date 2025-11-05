export const userAPI = {

  create: async (data: {
    name: string;
    email: string;
    cpf: string;
    password: string;
  }) => {
    const response = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        cpf_cnpj: data.cpf,
        password: data.password
      }),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      // lança um erro com informação do servidor (se existir)
      const msg = body?.message || "Erro na requisição";
      throw new Error(msg);
    }
    return body;
  },
};
