const BASE_URL = "http://localhost:8080/api";

export const api = {
  // 1. GET (Ir buscar dados)
  get: async (rota) => {
    const resposta = await fetch(`${BASE_URL}${rota}`);
    if (!resposta.ok) throw new Error(`Erro ao buscar dados de ${rota}`);
    return await resposta.json();
  },

  // 2. POST (Enviar novos dados / Criar)
  post: async (rota, dados) => {
    const resposta = await fetch(`${BASE_URL}${rota}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!resposta.ok) throw new Error(`Erro ao salvar dados em ${rota}`);
    return await resposta.json();
  },

  // 3. PUT (Atualizar/Editar dados existentes)
  put: async (rota, dados) => {
    const resposta = await fetch(`${BASE_URL}${rota}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
    if (!resposta.ok) throw new Error(`Erro ao atualizar dados em ${rota}`);
    return await resposta.json();
  },

  // 4. DELETE (Apagar dados)
  delete: async (rota) => {
    const resposta = await fetch(`${BASE_URL}${rota}`, {
      method: "DELETE",
    });
    if (!resposta.ok) throw new Error(`Erro ao excluir dados em ${rota}`);
    return resposta;
  }
};