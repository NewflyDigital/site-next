import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, storage } from "../../../../firebase-config";
import Admin from "../../../components/admin";

const CONFIG_REF = doc(db, "siteConfig", "popup");

export default function AdminPopup() {
  const [form, setForm] = useState({
    ativo: false,
    titulo: "",
    texto: "",
    botaoTexto: "",
    botaoLink: "",
    imagemFundoUrl: "",
    imagemFundoPath: "",
  });

  const [imagem, setImagem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const snapshot = await getDoc(CONFIG_REF);

        if (snapshot.exists()) {
          setForm((anterior) => ({
            ...anterior,
            ...snapshot.data(),
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar configuração do pop-up:", error);
        setMensagem({
          tipo: "error",
          texto: "Não foi possível carregar a configuração do pop-up.",
        });
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  function alterarCampo(campo, valor) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function enviarImagem() {
    if (!imagem) {
      setMensagem({
        tipo: "warning",
        texto: "Selecione uma imagem antes de enviar.",
      });
      return;
    }

    try {
      setEnviandoImagem(true);
      setMensagem(null);

      const nomeSeguro = imagem.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const caminho = `popups/${Date.now()}-${nomeSeguro}`;
      const arquivoRef = ref(storage, caminho);

      // 1. Envia o arquivo para o Firebase Storage
      await uploadBytes(arquivoRef, imagem, {
        contentType: imagem.type || "image/jpeg",
      });

      // 2. Obtém a URL pública de download
      const url = await getDownloadURL(arquivoRef);

      // 3. Salva a URL e o caminho no Firestore imediatamente
      await setDoc(
        CONFIG_REF,
        {
          imagemFundoUrl: url,
          imagemFundoPath: caminho,
          atualizadoEm: serverTimestamp(),
        },
        { merge: true },
      );

      // 4. Atualiza o formulário e a prévia
      setForm((anterior) => ({
        ...anterior,
        imagemFundoUrl: url,
        imagemFundoPath: caminho,
      }));

      setImagem(null);

      setMensagem({
        tipo: "success",
        texto: "Imagem enviada e salva com sucesso!",
      });

      console.log("Imagem salva no Storage:", caminho);
      console.log("URL salva no Firestore:", url);
    } catch (error) {
      console.error("Erro no upload ou salvamento da imagem:", error);

      setMensagem({
        tipo: "error",
        texto: `Falha ao salvar a imagem: ${error.code || error.message}`,
      });
    } finally {
      setEnviandoImagem(false);
    }
  }

  async function salvar(event) {
    event.preventDefault();

    try {
      setSalvando(true);
      setMensagem(null);

      await setDoc(
        CONFIG_REF,
        {
          ...form,
          atualizadoEm: serverTimestamp(),
        },
        { merge: true },
      );

      setMensagem({
        tipo: "success",
        texto: "Configuração do pop-up salva com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao salvar pop-up:", error);
      setMensagem({
        tipo: "error",
        texto: "Não foi possível salvar. Verifique as permissões do Firestore.",
      });
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <Admin>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Admin>
    );
  }

  return (
    <Admin>
      <Box sx={{ maxWidth: 1000, mx: "auto", p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Pop-up da página inicial
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Configure a mensagem que será exibida aos visitantes do site.
        </Typography>

        {mensagem && (
          <Alert
            severity={mensagem.tipo}
            sx={{ mb: 3 }}
            onClose={() => setMensagem(null)}
          >
            {mensagem.texto}
          </Alert>
        )}

        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(form.ativo)}
                onChange={(event) =>
                  alterarCampo("ativo", event.target.checked)
                }
                color="error"
              />
            }
            label={
              <Typography fontWeight={700}>
                {form.ativo ? "Pop-up ativado" : "Pop-up desativado"}
              </Typography>
            }
          />

          <Typography variant="body2" color="text.secondary">
            Quando desativado, o pop-up não será exibido na página inicial.
          </Typography>
        </Paper>

        <Box component="form" onSubmit={salvar}>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Conteúdo
            </Typography>

            <TextField
              fullWidth
              label="Título"
              value={form.titulo}
              onChange={(event) => alterarCampo("titulo", event.target.value)}
              margin="normal"
              placeholder="Ex.: Conheça as novidades da NEXT"
            />

            <TextField
              fullWidth
              label="Texto"
              value={form.texto}
              onChange={(event) => alterarCampo("texto", event.target.value)}
              margin="normal"
              multiline
              minRows={4}
              placeholder="Escreva a mensagem que será exibida no pop-up."
            />
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Botão de ação
            </Typography>

            <TextField
              fullWidth
              label="Texto do botão"
              value={form.botaoTexto}
              onChange={(event) =>
                alterarCampo("botaoTexto", event.target.value)
              }
              margin="normal"
              placeholder="Ex.: Conheça nossos produtos"
            />

            <TextField
              fullWidth
              label="Link do botão"
              value={form.botaoLink}
              onChange={(event) =>
                alterarCampo("botaoLink", event.target.value)
              }
              margin="normal"
              placeholder="/produtos ou https://exemplo.com"
              helperText="Pode ser uma página do site (ex.: /contato) ou um endereço externo."
            />
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Imagem de fundo
            </Typography>

            <Button
              component="label"
              variant="outlined"
              color="error"
              sx={{ mt: 1 }}
            >
              Escolher imagem
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(event) => setImagem(event.target.files?.[0] || null)}
              />
            </Button>

            {imagem && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Arquivo selecionado: {imagem.name}
                </Typography>

                <Button
                  variant="contained"
                  color="error"
                  onClick={enviarImagem}
                  disabled={enviandoImagem}
                >
                  {enviandoImagem ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Enviar imagem"
                  )}
                </Button>
              </Box>
            )}

            {form.imagemFundoUrl && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Prévia da imagem atual
                </Typography>

                <Box
                  component="img"
                  src={form.imagemFundoUrl}
                  alt="Prévia do fundo do pop-up"
                  sx={{
                    display: "block",
                    width: "100%",
                    maxWidth: 560,
                    maxHeight: 280,
                    objectFit: "cover",
                    borderRadius: 1,
                    bgcolor: "#222",
                  }}
                />

                <Button
                  color="error"
                  sx={{ mt: 1 }}
                  onClick={() => {
                    alterarCampo("imagemFundoUrl", "");
                    alterarCampo("imagemFundoPath", "");
                  }}
                >
                  Remover imagem da configuração
                </Button>
              </Box>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              A imagem é opcional. Sem imagem, o pop-up usa o fundo escuro
              padrão da NEXT. Remover a imagem daqui não apaga o arquivo do
              Storage.
            </Typography>
          </Paper>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              color="error"
              type="submit"
              disabled={salvando || enviandoImagem}
              sx={{ px: 4, py: 1.3, fontWeight: 800 }}
            >
              {salvando ? "Salvando..." : "Salvar configuração"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Admin>
  );
}
