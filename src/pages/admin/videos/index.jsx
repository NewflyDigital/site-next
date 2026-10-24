import { useEffect, useState } from "react";
import Admin from "../../../components/admin";
import { db } from "../../../../firebase-config";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
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
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
} from "@mui/material";

import {
  Add,
  Delete,
  Edit,
  Refresh,
  Save,
  VideoLibrary,
  OpenInNew,
} from "@mui/icons-material";

const VIDEOS_COLLECTION = "videos";
const PRODUCTS_COLLECTION = "produtos";

const videoVazio = {
  titulo: "",
  descricao: "",
  url: "",
  local: "quem-somos",
  produtoId: "",
  ordem: 0,
  ativo: true,
};

function extrairIdYoutube(url = "") {
  const valor = url.trim();

  if (!valor) return "";

  // Permite informar diretamente um ID de vídeo do YouTube.
  if (/^[a-zA-Z0-9_-]{11}$/.test(valor)) {
    return valor;
  }

  try {
    const urlObj = new URL(valor);
    const host = urlObj.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return urlObj.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (urlObj.pathname === "/watch") {
        return urlObj.searchParams.get("v") || "";
      }

      const partes = urlObj.pathname.split("/").filter(Boolean);

      if (["embed", "shorts", "live"].includes(partes[0])) {
        return partes[1] || "";
      }
    }
  } catch {
    return "";
  }

  return "";
}

function urlIncorporacao(url) {
  const id = extrairIdYoutube(url);

  return id ? `https://www.youtube-nocookie.com/embed/${id}` : "";
}

function nomeLocal(local) {
  const nomes = {
    home: "Página inicial",
    "quem-somos": "Quem Somos",
    produto: "Página de produto",
  };

  return nomes[local] || local || "Não definido";
}

export default function VideosAdmin() {
  const [videos, setVideos] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [busca, setBusca] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [form, setForm] = useState(videoVazio);

  async function carregarDados() {
    setCarregando(true);
    setErro("");

    try {
      const [videosSnapshot, produtosSnapshot] = await Promise.all([
        getDocs(collection(db, VIDEOS_COLLECTION)),
        getDocs(collection(db, PRODUCTS_COLLECTION)),
      ]);

      const listaVideos = videosSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      listaVideos.sort(
        (a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0),
      );

      const listaProdutos = produtosSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      listaProdutos.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), "pt-BR"),
      );

      setVideos(listaVideos);
      setProdutos(listaProdutos);
    } catch (error) {
      console.error("Erro ao carregar vídeos:", error);
      setErro(
        "Não foi possível carregar os vídeos. Verifique as permissões do Firebase.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function abrirNovo() {
    setVideoId(null);
    setForm({ ...videoVazio });
    setErro("");
    setSucesso("");
    setModalAberto(true);
  }

  function abrirEdicao(video) {
    setVideoId(video.id);

    setForm({
      ...videoVazio,
      ...video,
    });

    setErro("");
    setSucesso("");
    setModalAberto(true);
  }

  function alterar(campo, valor) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function salvarVideo() {
    setErro("");
    setSucesso("");

    if (!form.titulo.trim()) {
      setErro("Informe o título do vídeo.");
      return;
    }

    if (!form.url.trim()) {
      setErro("Informe a URL ou o ID do vídeo do YouTube.");
      return;
    }

    if (!extrairIdYoutube(form.url)) {
      setErro(
        "A URL não parece ser válida. Informe um link do YouTube ou um ID de vídeo de 11 caracteres.",
      );
      return;
    }

    if (form.local === "produto" && !form.produtoId) {
      setErro("Selecione o produto ao qual este vídeo será associado.");
      return;
    }

    setSalvando(true);

    try {
      const dados = {
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        url: form.url.trim(),
        youtubeId: extrairIdYoutube(form.url),
        local: form.local,
        produtoId: form.local === "produto" ? form.produtoId : "",
        ordem: Number(form.ordem) || 0,
        ativo: Boolean(form.ativo),
        atualizadoEm: serverTimestamp(),
      };

      if (videoId) {
        await updateDoc(doc(db, VIDEOS_COLLECTION, videoId), dados);
      } else {
        await addDoc(collection(db, VIDEOS_COLLECTION), {
          ...dados,
          criadoEm: serverTimestamp(),
        });
      }

      setModalAberto(false);
      setSucesso(
        videoId
          ? "Vídeo atualizado com sucesso."
          : "Vídeo cadastrado com sucesso.",
      );

      await carregarDados();
    } catch (error) {
      console.error("Erro ao salvar vídeo:", error);
      setErro(
        "Não foi possível salvar o vídeo. Verifique as permissões do Firestore.",
      );
    } finally {
      setSalvando(false);
    }
  }

  async function alternarStatus(video) {
    setErro("");
    setSucesso("");

    try {
      await updateDoc(doc(db, VIDEOS_COLLECTION, video.id), {
        ativo: !video.ativo,
        atualizadoEm: serverTimestamp(),
      });

      setSucesso(video.ativo ? "Vídeo desativado." : "Vídeo ativado.");

      await carregarDados();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      setErro("Não foi possível alterar o status do vídeo.");
    }
  }

  async function excluirVideo(video) {
    const confirmado = window.confirm(
      `Deseja realmente excluir o vídeo "${video.titulo}"?`,
    );

    if (!confirmado) return;

    setErro("");
    setSucesso("");

    try {
      await deleteDoc(doc(db, VIDEOS_COLLECTION, video.id));
      setSucesso("Vídeo excluído com sucesso.");
      await carregarDados();
    } catch (error) {
      console.error("Erro ao excluir vídeo:", error);
      setErro("Não foi possível excluir o vídeo.");
    }
  }

  const videosFiltrados = videos.filter((video) => {
    const termo = busca.toLowerCase();

    const nomeProduto =
      produtos.find((produto) => produto.id === video.produtoId)?.name || "";

    return (
      video.titulo?.toLowerCase().includes(termo) ||
      video.descricao?.toLowerCase().includes(termo) ||
      nomeLocal(video.local).toLowerCase().includes(termo) ||
      nomeProduto.toLowerCase().includes(termo)
    );
  });

  const incorporacao = urlIncorporacao(form.url);

  return (
    <Admin>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Vídeos
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Cadastre e organize os vídeos do site da NEXT Implementos.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={carregarDados}
              disabled={carregando}
            >
              Atualizar
            </Button>

            <Button variant="contained" startIcon={<Add />} onClick={abrirNovo}>
              Novo vídeo
            </Button>
          </Stack>
        </Stack>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErro("")}>
            {erro}
          </Alert>
        )}

        {sucesso && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSucesso("")}
          >
            {sucesso}
          </Alert>
        )}

        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Buscar vídeo"
            placeholder="Título, descrição, local ou produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </Paper>

        <Paper>
          {carregando ? (
            <Box sx={{ p: 5, textAlign: "center" }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Carregando vídeos...</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vídeo</TableCell>
                    <TableCell>Local de exibição</TableCell>
                    <TableCell>Ordem</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {videosFiltrados.map((video) => {
                    const produto = produtos.find(
                      (item) => item.id === video.produtoId,
                    );

                    const embedUrl = urlIncorporacao(video.url);

                    return (
                      <TableRow key={video.id} hover>
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            {embedUrl ? (
                              <Box
                                component="img"
                                src={`https://img.youtube.com/vi/${extrairIdYoutube(
                                  video.url,
                                )}/mqdefault.jpg`}
                                alt={video.titulo}
                                sx={{
                                  width: 100,
                                  height: 56,
                                  objectFit: "cover",
                                  borderRadius: 1,
                                  bgcolor: "#eee",
                                }}
                              />
                            ) : (
                              <VideoLibrary color="disabled" />
                            )}

                            <Box>
                              <Typography fontWeight={600}>
                                {video.titulo}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  maxWidth: 320,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {video.descricao || "Sem descrição"}
                              </Typography>

                              {produto && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Produto: {produto.name}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>{nomeLocal(video.local)}</TableCell>
                        <TableCell>{video.ordem ?? 0}</TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={video.ativo ? "Ativo" : "Inativo"}
                            color={video.ativo ? "success" : "default"}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="flex-end"
                          >
                            {embedUrl && (
                              <IconButton
                                title="Abrir vídeo"
                                component="a"
                                href={video.url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <OpenInNew />
                              </IconButton>
                            )}

                            <IconButton
                              title="Editar vídeo"
                              onClick={() => abrirEdicao(video)}
                            >
                              <Edit />
                            </IconButton>

                            <IconButton
                              title={
                                video.ativo ? "Desativar vídeo" : "Ativar vídeo"
                              }
                              onClick={() => alternarStatus(video)}
                            >
                              <Switch
                                size="small"
                                checked={Boolean(video.ativo)}
                                onChange={() => {}}
                                inputProps={{
                                  "aria-label": "Status do vídeo",
                                }}
                              />
                            </IconButton>

                            <IconButton
                              title="Excluir vídeo"
                              color="error"
                              onClick={() => excluirVideo(video)}
                            >
                              <Delete />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {videosFiltrados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Box sx={{ py: 5 }}>
                          <VideoLibrary
                            sx={{ fontSize: 42, color: "text.disabled" }}
                          />

                          <Typography color="text.secondary" sx={{ mt: 1 }}>
                            {busca
                              ? "Nenhum vídeo encontrado."
                              : "Nenhum vídeo cadastrado ainda."}
                          </Typography>

                          {!busca && (
                            <Button
                              sx={{ mt: 2 }}
                              variant="contained"
                              startIcon={<Add />}
                              onClick={abrirNovo}
                            >
                              Cadastrar primeiro vídeo
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {videosFiltrados.length} vídeo(s) encontrado(s).
        </Typography>
      </Box>

      <Dialog
        open={modalAberto}
        onClose={() => !salvando && setModalAberto(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {videoId ? "Editar vídeo" : "Cadastrar vídeo"}
        </DialogTitle>

        <DialogContent dividers>
          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              required
              label="Título do vídeo"
              value={form.titulo}
              onChange={(e) => alterar("titulo", e.target.value)}
            />

            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Descrição"
              value={form.descricao}
              onChange={(e) => alterar("descricao", e.target.value)}
            />

            <TextField
              fullWidth
              required
              label="URL ou ID do YouTube"
              placeholder="https://www.youtube.com/watch?v=..."
              helperText="Aceita links padrão do YouTube, youtu.be e IDs de vídeo."
              value={form.url}
              onChange={(e) => alterar("url", e.target.value)}
            />

            {incorporacao && (
              <Box>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  Pré-visualização
                </Typography>

                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 640,
                    aspectRatio: "16 / 9",
                    bgcolor: "#111",
                    overflow: "hidden",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    component="iframe"
                    src={incorporacao}
                    title={form.titulo || "Pré-visualização do vídeo"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    sx={{
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                  />
                </Box>
              </Box>
            )}

            <FormControl fullWidth>
              <InputLabel id="video-local-label">Local de exibição</InputLabel>

              <Select
                labelId="video-local-label"
                label="Local de exibição"
                value={form.local}
                onChange={(e) => {
                  const local = e.target.value;

                  setForm((anterior) => ({
                    ...anterior,
                    local,
                    produtoId: local === "produto" ? anterior.produtoId : "",
                  }));
                }}
              >
                <MenuItem value="home">Página inicial</MenuItem>
                <MenuItem value="quem-somos">Quem Somos</MenuItem>
                <MenuItem value="produto">Página de produto</MenuItem>
              </Select>
            </FormControl>

            {form.local === "produto" && (
              <FormControl fullWidth>
                <InputLabel id="video-produto-label">
                  Produto associado
                </InputLabel>

                <Select
                  labelId="video-produto-label"
                  label="Produto associado"
                  value={form.produtoId}
                  onChange={(e) => alterar("produtoId", e.target.value)}
                >
                  {produtos.map((produto) => (
                    <MenuItem key={produto.id} value={produto.id}>
                      {produto.name || produto.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              fullWidth
              type="number"
              label="Ordem de exibição"
              helperText="Menor número representa maior prioridade."
              value={form.ordem}
              onChange={(e) => alterar("ordem", e.target.value)}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(form.ativo)}
                  onChange={(e) => alterar("ativo", e.target.checked)}
                />
              }
              label="Vídeo ativo"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setModalAberto(false)} disabled={salvando}>
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
            onClick={salvarVideo}
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar vídeo"}
          </Button>
        </DialogActions>
      </Dialog>
    </Admin>
  );
}
