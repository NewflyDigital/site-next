import { useEffect, useState } from "react";
import Admin from "../../../components/admin";
import { db, storage } from "../../../../firebase-config";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControlLabel,
} from "@mui/material";

import { Add, Delete, Edit, Refresh, Save } from "@mui/icons-material";

const COLLECTION = "homeLinhas";
const COLLECTION_LINHAS = "linhas";

const cardVazio = {
  titulo: "",
  ordem: 1,
  imagem: "",
  descricao: "",
  linhaSlug: "",
  ativo: true,
};

export default function AdminHomeLinhas() {
  const [cards, setCards] = useState([]);
  const [linhas, setLinhas] = useState([]);
  const [form, setForm] = useState({ ...cardVazio });
  const [cardId, setCardId] = useState(null);

  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [previewImagem, setPreviewImagem] = useState("");
  const [enviandoImagem, setEnviandoImagem] = useState(false);

  function alterarCampo(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const [cardsSnapshot, linhasSnapshot] = await Promise.all([
        getDocs(query(collection(db, COLLECTION), orderBy("ordem", "asc"))),
        getDocs(
          query(collection(db, COLLECTION_LINHAS), orderBy("ordem", "asc")),
        ),
      ]);

      setCards(
        cardsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })),
      );

      setLinhas(
        linhasSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })),
      );
    } catch (error) {
      console.error("Erro ao carregar cards da página inicial:", error);
      setErro("Não foi possível carregar os cards e as linhas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function novoCard() {
    setCardId(null);
    setForm({
      ...cardVazio,
      ordem: cards.length + 1,
    });
    setArquivoImagem(null);
    setPreviewImagem("");
    setErro("");
    setAberto(true);
  }

  function editarCard(card) {
    setCardId(card.id);
    setForm({
      ...cardVazio,
      ...card,
    });
    setArquivoImagem(null);
    setPreviewImagem("");
    setErro("");
    setAberto(true);
  }

  async function salvarCard() {
    if (!form.titulo.trim()) {
      setErro("Informe o título do card.");
      return;
    }

    if (!form.linhaSlug) {
      setErro("Selecione a linha de destino.");
      return;
    }

    // Em novos cards, uma imagem é obrigatória.
    // Na edição, a imagem existente pode ser mantida.
    if (!arquivoImagem && !form.imagem) {
      setErro("Selecione uma imagem para o card.");
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      const linhaSelecionada = linhas.find(
        (linha) => linha.slug === form.linhaSlug,
      );

      if (!linhaSelecionada) {
        setErro("A linha selecionada não foi encontrada.");
        return;
      }

      let imagemFinal = form.imagem || "";

      // Envia a imagem ao Firebase Storage, se houver um novo arquivo.
      if (arquivoImagem) {
        setEnviandoImagem(true);

        const nomeArquivo = `${Date.now()}-${arquivoImagem.name.replace(
          /[^a-zA-Z0-9._-]/g,
          "-",
        )}`;

        const caminhoImagem = `homeLinhas/${nomeArquivo}`;
        const imagemRef = ref(storage, caminhoImagem);

        await uploadBytes(imagemRef, arquivoImagem);
        imagemFinal = await getDownloadURL(imagemRef);
      }

      const dados = {
        titulo: form.titulo.trim(),
        ordem: Number(form.ordem) || 0,
        imagem: imagemFinal,
        descricao: form.descricao.trim(),
        linhaSlug: linhaSelecionada.slug,
        ativo: Boolean(form.ativo),
        atualizadoEm: serverTimestamp(),
      };

      if (cardId) {
        await updateDoc(doc(db, COLLECTION, cardId), dados);
      } else {
        await addDoc(collection(db, COLLECTION), {
          ...dados,
          criadoEm: serverTimestamp(),
        });
      }

      setArquivoImagem(null);
      setPreviewImagem("");
      setAberto(false);

      await carregarDados();
    } catch (error) {
      console.error("Erro ao salvar card ou enviar imagem:", error);

      setErro(
        "Não foi possível salvar o card. Verifique as permissões do Firebase Storage e do Firestore.",
      );
    } finally {
      setSalvando(false);
      setEnviandoImagem(false);
    }
  }

  async function alternarStatus(card) {
    try {
      await updateDoc(doc(db, COLLECTION, card.id), {
        ativo: !card.ativo,
        atualizadoEm: serverTimestamp(),
      });

      await carregarDados();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      setErro("Não foi possível alterar o status do card.");
    }
  }

  async function excluirCard(card) {
    const confirmou = window.confirm(
      `Deseja excluir o card "${card.titulo}"? Esta ação não pode ser desfeita.`,
    );

    if (!confirmou) return;

    setErro("");

    try {
      // Primeiro exclui o registro do Firestore.
      await deleteDoc(doc(db, COLLECTION, card.id));

      // Depois tenta excluir a imagem armazenada no Firebase.
      if (
        card.imagem &&
        card.imagem.includes("firebasestorage.googleapis.com")
      ) {
        try {
          await deleteObject(ref(storage, card.imagem));
        } catch (erroImagem) {
          console.error("Não foi possível excluir a imagem:", erroImagem);

          setErro(
            "O card foi excluído, mas a imagem permaneceu no Storage. Verifique as permissões do Firebase Storage.",
          );
        }
      }

      await carregarDados();
    } catch (error) {
      console.error("Erro ao excluir card:", error);
      setErro(
        "Não foi possível excluir o card. Verifique as permissões do Firestore.",
      );
    }
  }

  return (
    <Admin>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Linhas da página inicial
            </Typography>

            <Typography color="text.secondary">
              Configure os cards exibidos na home da NEXT Implementos.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={carregarDados}
            >
              Atualizar
            </Button>

            <Button variant="contained" startIcon={<Add />} onClick={novoCard}>
              Novo card
            </Button>
          </Stack>
        </Stack>

        {erro && (
          <Alert severity="error" onClose={() => setErro("")} sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ordem</TableCell>
                <TableCell>Imagem</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {carregando ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : cards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Nenhum card cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                cards.map((card) => (
                  <TableRow key={card.id} hover>
                    <TableCell>{card.ordem ?? 0}</TableCell>

                    <TableCell>
                      {card.imagem ? (
                        <Box
                          component="img"
                          src={card.imagem}
                          alt={card.titulo}
                          sx={{
                            width: 76,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 1,
                          }}
                        />
                      ) : (
                        "Sem imagem"
                      )}
                    </TableCell>

                    <TableCell>{card.titulo}</TableCell>
                    <TableCell>/produtos/{card.linhaSlug}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={card.ativo ? "Ativo" : "Inativo"}
                        color={card.ativo ? "success" : "default"}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        title="Editar"
                        onClick={() => editarCard(card)}
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        title={card.ativo ? "Desativar" : "Ativar"}
                        onClick={() => alternarStatus(card)}
                      >
                        <Switch
                          size="small"
                          checked={Boolean(card.ativo)}
                          readOnly
                        />
                      </IconButton>

                      <IconButton
                        title="Excluir"
                        color="error"
                        onClick={() => excluirCard(card)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={aberto}
          onClose={() => !salvando && setAberto(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {cardId
              ? "Editar card da página inicial"
              : "Novo card da página inicial"}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Título do card"
                value={form.titulo}
                onChange={(e) => alterarCampo("titulo", e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Ordem de exibição"
                type="number"
                value={form.ordem}
                onChange={(e) => alterarCampo("ordem", e.target.value)}
                helperText="Menor número aparece primeiro."
                required
                fullWidth
              />

              <TextField
                select
                label="Linha de destino"
                value={form.linhaSlug}
                onChange={(e) => alterarCampo("linhaSlug", e.target.value)}
                required
                fullWidth
                helperText="Ao clicar no card, o visitante será direcionado para a página desta linha."
              >
                {linhas.map((linha) => (
                  <MenuItem key={linha.id} value={linha.slug}>
                    {linha.nome} ({linha.slug})
                    {!linha.ativo ? " — Inativa" : ""}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Descrição do card"
                value={form.descricao}
                onChange={(e) => alterarCampo("descricao", e.target.value)}
                multiline
                minRows={3}
                helperText="Texto exibido na faixa vermelha do card."
                fullWidth
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Imagem da linha
                </Typography>

                <Button variant="outlined" component="label">
                  Selecionar imagem
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const arquivo = e.target.files?.[0];

                      if (!arquivo) return;

                      if (!arquivo.type.startsWith("image/")) {
                        alert("Selecione um arquivo de imagem válido.");
                        e.target.value = "";
                        return;
                      }

                      if (arquivo.size > 5 * 1024 * 1024) {
                        alert("A imagem deve ter no máximo 5 MB.");
                        e.target.value = "";
                        return;
                      }

                      setArquivoImagem(arquivo);

                      setPreviewImagem((anterior) => {
                        if (anterior) URL.revokeObjectURL(anterior);
                        return URL.createObjectURL(arquivo);
                      });
                    }}
                  />
                </Button>

                {arquivoImagem && (
                  <Alert severity="success" sx={{ mt: 2, mb: 1 }}>
                    Imagem selecionada: <strong>{arquivoImagem.name}</strong>
                  </Alert>
                )}

                {previewImagem ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Prévia da nova imagem
                    </Typography>

                    <Box
                      component="img"
                      src={previewImagem}
                      alt="Prévia da nova imagem"
                      sx={{
                        display: "block",
                        width: "100%",
                        maxWidth: 320,
                        maxHeight: 260,
                        objectFit: "contain",
                        borderRadius: 1,
                        bgcolor: "grey.100",
                      }}
                    />
                  </Box>
                ) : form.imagem ? (
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Imagem atual
                    </Typography>

                    <Box
                      component="img"
                      src={form.imagem}
                      alt="Imagem atual do card"
                      sx={{
                        display: "block",
                        width: "100%",
                        maxWidth: 320,
                        maxHeight: 260,
                        objectFit: "contain",
                        borderRadius: 1,
                        bgcolor: "grey.100",
                      }}
                    />
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Nenhuma imagem selecionada.
                  </Typography>
                )}

                {enviandoImagem && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Enviando imagem para o Firebase...
                  </Typography>
                )}
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(form.ativo)}
                    onChange={(e) => alterarCampo("ativo", e.target.checked)}
                  />
                }
                label="Exibir card na página inicial"
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAberto(false)} disabled={salvando}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              startIcon={
                salvando ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <Save />
                )
              }
              onClick={salvarCard}
              disabled={salvando || enviandoImagem}
            >
              {salvando
                ? enviandoImagem
                  ? "Enviando imagem..."
                  : "Salvando..."
                : "Salvar card"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Admin>
  );
}
