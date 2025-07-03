// frontend/src/utils/api.js
export async function loadData({ jogoId = null, usuarioId = null } = {}) {
  try {
    const params = new URLSearchParams();
    if (jogoId) params.append("jogoId", jogoId.toString());
    if (usuarioId) params.append("usuarioId", usuarioId);

    const url = `${process.env.NEXT_PUBLIC_URL_API}/avaliacoes${params.toString() ? `?${params}` : ""}`;

    console.log("Buscando avaliações:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Resposta do servidor:", text);
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        throw new Error(`Erro HTTP: ${response.status} - Resposta não é JSON: ${text.slice(0, 100)}...`);
      }
      throw new Error(errorData.erro || `Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    throw error;
  }
}

export async function criarAvaliacao({ usuarioId, jogoId, comentario, nota, resposta }) {
  try {
    const body = {
      usuarioId: String(usuarioId),
      jogoId: Number(jogoId),
      comentario,
      nota: Number(nota),
      resposta: resposta || "Nenhuma resposta",
    };

    console.log("Enviando avaliação:", body);

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/avaliacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.erro || `Erro HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    throw error;
  }
}