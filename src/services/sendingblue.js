import axios from "axios";

const apiKey = process.env.BREVO_API_KEY;

const sender = {
  name: "Agência AL",
  email: "contato@agenciaal.com.br",
};

const defaultRecipients = [
  { email: "contato@agenciaal.com.br" },
  { email: "fabioa.slima1@gmail.com" },
];

export const SendContato = async (dados) => {
  console.log("API KEY:", apiKey);
  console.log("Dados:", dados);

  return axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender,
      to: defaultRecipients,
      subject: `Novo contato pelo site - ${dados.objetivo}`,
      htmlContent: `
        <h2>Novo contato pelo site</h2>

        <p><b>Nome:</b> ${dados.nome}</p>
        <p><b>WhatsApp:</b> ${dados.telefone}</p>
        <p><b>E-mail:</b> ${dados.email}</p>
        <p><b>Objetivo Principal:</b> ${dados.objetivo}</p>

        <hr>

        <p><b>Mensagem:</b></p>
        <p>${dados.mensagem || "-"}</p>
      `,
    },
    {
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
    },
  );
};
