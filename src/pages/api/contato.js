import { SendContato } from "../../services/sendingblue";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { nome, telefone, email, objetivo, mensagem } = req.body;

    if (!nome || !telefone || !email || !objetivo) {
      return res.status(400).json({
        error: "Campos obrigatórios",
      });
    }

    await SendContato({
      nome,
      telefone,
      email,
      objetivo,
      mensagem,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Erro Brevo:", error?.response?.data || error);

    return res.status(500).json({
      error: "Erro ao enviar contato",
    });
  }
}
