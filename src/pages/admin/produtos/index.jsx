import { useEffect, useState } from "react";
import Admin from "../../../components/admin";

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
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

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
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
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
} from "@mui/material";

import {
  Add,
  Delete,
  Edit,
  Image as ImageIcon,
  PictureAsPdf,
  Refresh,
  Save,
  VideoLibrary,
} from "@mui/icons-material";

const COLLECTION = "produtos";

const produtoVazio = {
  name: "",
  slug: "",
  line: "",
  family: "",
  description: "",
  image: "",
  imagePath: "",
  specifications: [],
  loadChart: "",
  loadChartPath: "",
  loadChartPdf: "",
  loadChartPdfPath: "",
  videoUrl: "",
  ativo: true,
  ordem: 0,
};

const slugify = (texto = "") =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const nomeSeguro = (nome = "arquivo") =>
  nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "-");

export default function ProdutosAdmin() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [busca, setBusca] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoId, setProdutoId] = useState(null);
  const [form, setForm] = useState(produtoVazio);

  const [imagemArquivo, setImagemArquivo] = useState(null);
  const [graficoArquivo, setGraficoArquivo] = useState(null);
  const [pdfArquivo, setPdfArquivo] = useState(null);

  async function carregarProdutos() {
    setCarregando(true);
    setErro("");

    try {
      const snapshot = await getDocs(collection(db, COLLECTION));

      const lista = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      lista.sort((a, b) => (Number(a.ordem) || 0) - (Number(b.ordem) || 0));

      setProdutos(lista);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setErro("Não foi possível carregar os produtos. Verifique o Firebase.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  function abrirNovo() {
    setProdutoId(null);
    setForm({ ...produtoVazio });
    setImagemArquivo(null);
    setGraficoArquivo(null);
    setPdfArquivo(null);
    setErro("");
    setSucesso("");
    setModalAberto(true);
  }

  function abrirEdicao(produto) {
    setProdutoId(produto.id);

    setForm({
      ...produtoVazio,
      ...produto,
      specifications: Array.isArray(produto.specifications)
        ? produto.specifications
        : [],
    });

    setImagemArquivo(null);
    setGraficoArquivo(null);
    setPdfArquivo(null);
    setErro("");
    setSucesso("");
    setModalAberto(true);
  }

  function atualizarCampo(campo, valor) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  function selecionarArquivo(evento, tipo) {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) return;

    const limite = tipo === "pdf" ? 20 : 10;

    if (arquivo.size > limite * 1024 * 1024) {
      setErro(`O arquivo deve ter no máximo ${limite} MB.`);
      evento.target.value = "";
      return;
    }

    if (tipo === "imagem" || tipo === "grafico") {
      if (!arquivo.type.startsWith("image/")) {
        setErro("Selecione um arquivo de imagem válido.");
        evento.target.value = "";
        return;
      }

      if (tipo === "imagem") setImagemArquivo(arquivo);
      else setGraficoArquivo(arquivo);
    }

    if (tipo === "pdf") {
      if (
        arquivo.type !== "application/pdf" &&
        !arquivo.name.toLowerCase().endsWith(".pdf")
      ) {
        setErro("Selecione um arquivo PDF válido.");
        evento.target.value = "";
        return;
      }

      setPdfArquivo(arquivo);
    }

    setErro("");
    evento.target.value = "";
  }

  async function enviarArquivo(arquivo, caminho) {
    if (!arquivo) return null;

    const caminhoFinal = `${caminho}/${Date.now()}-${nomeSeguro(arquivo.name)}`;

    const referencia = ref(storage, caminhoFinal);

    await uploadBytes(referencia, arquivo);

    const url = await getDownloadURL(referencia);

    return {
      url,
      path: caminhoFinal,
    };
  }

  async function removerArquivoStorage(caminho) {
    if (!caminho) return;

    try {
      await deleteObject(ref(storage, caminho));
    } catch (error) {
      // O arquivo pode já ter sido removido ou não existir.
      console.warn("Não foi possível remover o arquivo:", error);
    }
  }

  function adicionarEspecificacao() {
    atualizarCampo("specifications", [
      ...(form.specifications || []),
      { label: "", value: "" },
    ]);
  }

  function atualizarEspecificacao(index, campo, valor) {
    const novas = [...(form.specifications || [])];

    novas[index] = {
      ...novas[index],
      [campo]: valor,
    };

    atualizarCampo("specifications", novas);
  }

  function removerEspecificacao(index) {
    atualizarCampo(
      "specifications",
      (form.specifications || []).filter((_, i) => i !== index),
    );
  }

  async function salvarProduto() {
    setErro("");
    setSucesso("");

    if (!form.name.trim()) {
      setErro("Informe o nome do produto.");
      return;
    }

    if (!form.line.trim()) {
      setErro("Informe a linha do produto.");
      return;
    }

    if (!form.slug.trim()) {
      setErro("Informe o slug do produto.");
      return;
    }

    setSalvando(true);

    try {
      const dados = {
        name: form.name.trim(),
        slug: slugify(form.slug),
        line: form.line.trim(),
        family: form.family.trim(),
        description: form.description.trim(),
        image: form.image || "",
        imagePath: form.imagePath || "",
        specifications: (form.specifications || [])
          .filter((item) => item.label?.trim() || item.value?.trim())
          .map((item) => ({
            label: item.label?.trim() || "",
            value: item.value?.trim() || "",
          })),
        loadChart: form.loadChart || "",
        loadChartPath: form.loadChartPath || "",
        loadChartPdf: form.loadChartPdf || "",
        loadChartPdfPath: form.loadChartPdfPath || "",
        videoUrl: form.videoUrl.trim(),
        ativo: Boolean(form.ativo),
        ordem: Number(form.ordem) || 0,
        atualizadoEm: serverTimestamp(),
      };

      const arquivosAntigos = [];

      if (imagemArquivo) {
        const novo = await enviarArquivo(imagemArquivo, "produtos/imagens");

        if (novo) {
          if (dados.imagePath) arquivosAntigos.push(dados.imagePath);

          dados.image = novo.url;
          dados.imagePath = novo.path;
        }
      }

      if (graficoArquivo) {
        const novo = await enviarArquivo(graficoArquivo, "produtos/graficos");

        if (novo) {
          if (dados.loadChartPath) {
            arquivosAntigos.push(dados.loadChartPath);
          }

          dados.loadChart = novo.url;
          dados.loadChartPath = novo.path;
        }
      }

      if (pdfArquivo) {
        const novo = await enviarArquivo(pdfArquivo, "produtos/documentos");

        if (novo) {
          if (dados.loadChartPdfPath) {
            arquivosAntigos.push(dados.loadChartPdfPath);
          }

          dados.loadChartPdf = novo.url;
          dados.loadChartPdfPath = novo.path;
        }
      }

      if (produtoId) {
        await updateDoc(doc(db, COLLECTION, produtoId), dados);
      } else {
        await addDoc(collection(db, COLLECTION), {
          ...dados,
          criadoEm: serverTimestamp(),
        });
      }

      for (const caminho of arquivosAntigos) {
        await removerArquivoStorage(caminho);
      }

      setModalAberto(false);
      setSucesso(
        produtoId
          ? "Produto atualizado com sucesso."
          : "Produto cadastrado com sucesso.",
      );

      await carregarProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      setErro(
        "Não foi possível salvar o produto. Verifique as permissões do Firebase e tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  async function alternarStatus(produto) {
    setErro("");
    setSucesso("");

    try {
      await updateDoc(doc(db, COLLECTION, produto.id), {
        ativo: !produto.ativo,
        atualizadoEm: serverTimestamp(),
      });

      setSucesso(!produto.ativo ? "Produto ativado." : "Produto desativado.");

      await carregarProdutos();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      setErro("Não foi possível alterar o status do produto.");
    }
  }

  async function excluirProduto(produto) {
    const confirmado = window.confirm(
      `Deseja realmente excluir "${produto.name}"? Esta ação não pode ser desfeita.`,
    );

    if (!confirmado) return;

    setErro("");
    setSucesso("");

    try {
      await deleteDoc(doc(db, COLLECTION, produto.id));

      await Promise.all([
        removerArquivoStorage(produto.imagePath),
        removerArquivoStorage(produto.loadChartPath),
        removerArquivoStorage(produto.loadChartPdfPath),
      ]);

      setSucesso("Produto excluído com sucesso.");
      await carregarProdutos();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      setErro("Não foi possível excluir o produto.");
    }
  }

  const produtosFiltrados = produtos.filter((produto) => {
    const termo = busca.toLowerCase();

    return (
      produto.name?.toLowerCase().includes(termo) ||
      produto.line?.toLowerCase().includes(termo) ||
      produto.family?.toLowerCase().includes(termo) ||
      produto.slug?.toLowerCase().includes(termo)
    );
  });

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
              Produtos
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Gerencie o catálogo de produtos da NEXT Implementos.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={carregarProdutos}
              disabled={carregando}
            >
              Atualizar
            </Button>

            <Button variant="contained" startIcon={<Add />} onClick={abrirNovo}>
              Novo produto
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
            label="Buscar produto"
            placeholder="Nome, linha, família ou slug..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </Paper>

        <Paper>
          {carregando ? (
            <Box sx={{ p: 5, textAlign: "center" }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Carregando produtos...</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell>Linha</TableCell>
                    <TableCell>Ordem</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {produtosFiltrados.map((produto) => (
                    <TableRow key={produto.id} hover>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          {produto.image ? (
                            <Box
                              component="img"
                              src={produto.image}
                              alt={produto.name}
                              sx={{
                                width: 64,
                                height: 48,
                                objectFit: "contain",
                                borderRadius: 1,
                                bgcolor: "#f5f5f5",
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 64,
                                height: 48,
                                display: "grid",
                                placeItems: "center",
                                bgcolor: "#f5f5f5",
                                borderRadius: 1,
                              }}
                            >
                              <ImageIcon color="disabled" />
                            </Box>
                          )}

                          <Box>
                            <Typography fontWeight={600}>
                              {produto.name}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {produto.slug}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>{produto.line || "—"}</TableCell>
                      <TableCell>{produto.ordem ?? 0}</TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={produto.ativo ? "Ativo" : "Inativo"}
                          color={produto.ativo ? "success" : "default"}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            title="Editar produto"
                            onClick={() => abrirEdicao(produto)}
                          >
                            <Edit />
                          </IconButton>

                          <IconButton
                            title={
                              produto.ativo
                                ? "Desativar produto"
                                : "Ativar produto"
                            }
                            onClick={() => alternarStatus(produto)}
                          >
                            <Switch
                              size="small"
                              checked={Boolean(produto.ativo)}
                              onChange={() => {}}
                              inputProps={{ "aria-label": "Status do produto" }}
                            />
                          </IconButton>

                          <IconButton
                            title="Excluir produto"
                            color="error"
                            onClick={() => excluirProduto(produto)}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}

                  {produtosFiltrados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Box sx={{ py: 5 }}>
                          <Typography color="text.secondary">
                            {busca
                              ? "Nenhum produto encontrado."
                              : "Nenhum produto cadastrado ainda."}
                          </Typography>

                          {!busca && (
                            <Button
                              sx={{ mt: 2 }}
                              variant="contained"
                              startIcon={<Add />}
                              onClick={abrirNovo}
                            >
                              Cadastrar primeiro produto
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
          {produtosFiltrados.length} produto(s) encontrado(s).
        </Typography>
      </Box>

      <Dialog
        open={modalAberto}
        onClose={() => !salvando && setModalAberto(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {produtoId ? "Editar produto" : "Cadastrar produto"}
        </DialogTitle>

        <DialogContent dividers>
          {erro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {erro}
            </Alert>
          )}

          <Stack spacing={3} sx={{ pt: 1 }}>
            <Box>
              <Typography fontWeight={700} sx={{ mb: 2 }}>
                Identificação
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <TextField
                    fullWidth
                    required
                    label="Nome do produto"
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;

                      setForm((anterior) => ({
                        ...anterior,
                        name,
                        ...(produtoId ? {} : { slug: slugify(name) }),
                      }));
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    required
                    label="Slug / URL"
                    helperText="Ex.: plataforma-elevatoria"
                    value={form.slug}
                    onChange={(e) => atualizarCampo("slug", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Linha do produto"
                    placeholder="Ex.: Plataformas"
                    value={form.line}
                    onChange={(e) => atualizarCampo("line", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Família"
                    placeholder="Ex.: Linha agrícola"
                    value={form.family}
                    onChange={(e) => atualizarCampo("family", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Ordem de exibição"
                    helperText="Menor número aparece primeiro."
                    value={form.ordem}
                    onChange={(e) => atualizarCampo("ordem", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(form.ativo)}
                        onChange={(e) =>
                          atualizarCampo("ativo", e.target.checked)
                        }
                      />
                    }
                    label="Produto ativo no catálogo"
                    sx={{ mt: 1 }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box>
              <Typography fontWeight={700} sx={{ mb: 2 }}>
                Conteúdo do produto
              </Typography>

              <TextField
                fullWidth
                multiline
                minRows={4}
                label="Descrição"
                value={form.description}
                onChange={(e) => atualizarCampo("description", e.target.value)}
              />

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  Imagem principal
                </Typography>

                {form.image && !imagemArquivo && (
                  <Box
                    component="img"
                    src={form.image}
                    alt="Imagem atual do produto"
                    sx={{
                      display: "block",
                      width: "100%",
                      maxWidth: 300,
                      maxHeight: 180,
                      objectFit: "contain",
                      mb: 1,
                      bgcolor: "#f5f5f5",
                      borderRadius: 1,
                    }}
                  />
                )}

                <Button component="label" variant="outlined">
                  <ImageIcon sx={{ mr: 1 }} />
                  Selecionar imagem
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => selecionarArquivo(e, "imagem")}
                  />
                </Button>

                {imagemArquivo && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Novo arquivo: {imagemArquivo.name}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider />

            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography fontWeight={700}>
                  Especificações técnicas
                </Typography>

                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={adicionarEspecificacao}
                >
                  Adicionar especificação
                </Button>
              </Stack>

              {(form.specifications || []).map((item, index) => (
                <Grid
                  container
                  spacing={1}
                  key={index}
                  sx={{ mb: 1 }}
                  alignItems="center"
                >
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Característica"
                      placeholder="Ex.: Capacidade"
                      value={item.label || ""}
                      onChange={(e) =>
                        atualizarEspecificacao(index, "label", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Valor"
                      placeholder="Ex.: 5.000 kg"
                      value={item.value || ""}
                      onChange={(e) =>
                        atualizarEspecificacao(index, "value", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <IconButton
                      color="error"
                      onClick={() => removerEspecificacao(index)}
                      title="Remover especificação"
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              {(!form.specifications || form.specifications.length === 0) && (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma especificação adicionada.
                </Typography>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography fontWeight={700} sx={{ mb: 2 }}>
                Gráfico de carga e documento técnico
              </Typography>

              <Stack spacing={2}>
                {form.loadChart && !graficoArquivo && (
                  <Typography variant="body2">
                    Gráfico atual:{" "}
                    <a href={form.loadChart} target="_blank" rel="noreferrer">
                      Visualizar imagem
                    </a>
                  </Typography>
                )}

                <Button
                  component="label"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start" }}
                >
                  <ImageIcon sx={{ mr: 1 }} />
                  Selecionar gráfico de carga
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => selecionarArquivo(e, "grafico")}
                  />
                </Button>

                {graficoArquivo && (
                  <Typography variant="body2">
                    Novo gráfico: {graficoArquivo.name}
                  </Typography>
                )}

                {form.loadChartPdf && !pdfArquivo && (
                  <Typography variant="body2">
                    PDF atual:{" "}
                    <a
                      href={form.loadChartPdf}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir documento
                    </a>
                  </Typography>
                )}

                <Button
                  component="label"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start" }}
                >
                  <PictureAsPdf sx={{ mr: 1 }} />
                  Selecionar PDF técnico
                  <input
                    hidden
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => selecionarArquivo(e, "pdf")}
                  />
                </Button>

                {pdfArquivo && (
                  <Typography variant="body2">
                    Novo PDF: {pdfArquivo.name}
                  </Typography>
                )}
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography fontWeight={700} sx={{ mb: 2 }}>
                Vídeo do produto
              </Typography>

              <TextField
                fullWidth
                label="URL ou ID do vídeo"
                placeholder="https://www.youtube.com/watch?v=..."
                value={form.videoUrl}
                onChange={(e) => atualizarCampo("videoUrl", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <VideoLibrary sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
                helperText="Pode ser uma URL completa ou um ID, conforme o formato utilizado pelo site."
              />
            </Box>
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
            onClick={salvarProduto}
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar produto"}
          </Button>
        </DialogActions>
      </Dialog>
    </Admin>
  );
}
