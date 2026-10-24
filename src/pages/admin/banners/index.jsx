import * as React from "react";
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

import { db, storage } from "../../../../firebase-config";

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
  FormControlLabel,
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
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

import Admin from "../../../components/admin";

const bannersCollection = collection(db, "banners");

const formularioInicial = {
  titulo: "",
  subtitulo: "",
  link: "",
  ordem: 1,
  ativo: true,
  imagemUrl: "",
  imagemPath: "",
};

export default function BannersPage() {
  const [banners, setBanners] = React.useState([]);
  const [formulario, setFormulario] = React.useState(formularioInicial);
  const [imagem, setImagem] = React.useState(null);
  const [bannerEditando, setBannerEditando] = React.useState(null);

  const [modalAberto, setModalAberto] = React.useState(false);
  const [carregando, setCarregando] = React.useState(true);
  const [salvando, setSalvando] = React.useState(false);
  const [excluindo, setExcluindo] = React.useState("");
  const [erro, setErro] = React.useState("");
  const [sucesso, setSucesso] = React.useState("");

  const carregarBanners = React.useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const snapshot = await getDocs(bannersCollection);

      const lista = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      lista.sort((a, b) => Number(a.ordem || 0) - Number(b.ordem || 0));

      setBanners(lista);
    } catch (error) {
      console.error("Erro ao carregar banners:", error);
      setErro(
        "Não foi possível carregar os banners. Verifique a conexão com o Firebase e as regras do Firestore.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  React.useEffect(() => {
    carregarBanners();
  }, [carregarBanners]);

  const abrirNovo = () => {
    setBannerEditando(null);
    setFormulario({
      ...formularioInicial,
      ordem: banners.length + 1,
    });
    setImagem(null);
    setErro("");
    setSucesso("");
    setModalAberto(true);
  };

  const abrirEdicao = (banner) => {
    setBannerEditando(banner.id);

    setFormulario({
      titulo: banner.titulo || "",
      subtitulo: banner.subtitulo || "",
      link: banner.link || "",
      ordem: Number(banner.ordem || 1),
      ativo: banner.ativo !== false,
      imagemUrl: banner.imagemUrl || "",
      imagemPath: banner.imagemPath || "",
    });

    setImagem(null);
    setErro("");
    setSucesso("");
    setModalAberto(true);
  };

  const fecharModal = () => {
    if (salvando) return;

    setModalAberto(false);
    setImagem(null);
    setErro("");
  };

  const alterarCampo = (campo, valor) => {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const salvarBanner = async (event) => {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (!formulario.titulo.trim()) {
      setErro("Informe o título do banner.");
      return;
    }

    if (!bannerEditando && !imagem) {
      setErro("Selecione uma imagem para o banner.");
      return;
    }

    if (imagem && !imagem.type.startsWith("image/")) {
      setErro("O arquivo selecionado precisa ser uma imagem.");
      return;
    }

    if (imagem && imagem.size > 10 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 10 MB.");
      return;
    }

    setSalvando(true);

    let caminhoNovaImagem = "";

    try {
      let imagemUrl = formulario.imagemUrl;
      let imagemPath = formulario.imagemPath;

      if (imagem) {
        const nomeSeguro = imagem.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9._-]/g, "-");

        caminhoNovaImagem = `banners/${Date.now()}-${nomeSeguro}`;

        const arquivoRef = ref(storage, caminhoNovaImagem);

        await uploadBytes(arquivoRef, imagem, {
          contentType: imagem.type,
        });

        imagemUrl = await getDownloadURL(arquivoRef);
        imagemPath = caminhoNovaImagem;
      }

      const dados = {
        titulo: formulario.titulo.trim(),
        subtitulo: formulario.subtitulo.trim(),
        link: formulario.link.trim(),
        ordem: Math.max(1, Number(formulario.ordem) || 1),
        ativo: Boolean(formulario.ativo),
        imagemUrl,
        imagemPath,
        atualizadoEm: serverTimestamp(),
      };

      if (bannerEditando) {
        await updateDoc(doc(db, "banners", bannerEditando), dados);
      } else {
        await addDoc(bannersCollection, {
          ...dados,
          criadoEm: serverTimestamp(),
        });
      }

      // A imagem anterior só é removida depois que a atualização do
      // documento termina. Falhas ao remover o arquivo não desfazem o cadastro.
      if (
        bannerEditando &&
        imagem &&
        formulario.imagemPath &&
        formulario.imagemPath !== imagemPath
      ) {
        try {
          await deleteObject(ref(storage, formulario.imagemPath));
        } catch (error) {
          console.warn("Não foi possível remover a imagem anterior:", error);
        }
      }

      setModalAberto(false);
      setImagem(null);
      setSucesso(
        bannerEditando
          ? "Banner atualizado com sucesso."
          : "Banner cadastrado com sucesso.",
      );

      await carregarBanners();
    } catch (error) {
      console.error("Erro ao salvar banner:", error);

      // Evita deixar um arquivo novo órfão se o cadastro falhar.
      if (caminhoNovaImagem) {
        try {
          await deleteObject(ref(storage, caminhoNovaImagem));
        } catch (cleanupError) {
          console.warn(
            "Não foi possível limpar a imagem enviada:",
            cleanupError,
          );
        }
      }

      setErro(
        "Não foi possível salvar o banner. Confira as permissões do Firebase e tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  };

  const excluirBanner = async (banner) => {
    const confirmado = window.confirm(
      `Deseja realmente excluir o banner "${banner.titulo || "Sem título"}"?`,
    );

    if (!confirmado) return;

    setExcluindo(banner.id);
    setErro("");
    setSucesso("");

    try {
      await deleteDoc(doc(db, "banners", banner.id));

      if (banner.imagemPath) {
        try {
          await deleteObject(ref(storage, banner.imagemPath));
        } catch (error) {
          console.warn(
            "Documento excluído, mas a imagem não foi removida:",
            error,
          );
        }
      }

      setBanners((anteriores) =>
        anteriores.filter((item) => item.id !== banner.id),
      );

      setSucesso("Banner excluído.");
    } catch (error) {
      console.error("Erro ao excluir banner:", error);
      setErro("Não foi possível excluir o banner. Verifique as permissões.");
    } finally {
      setExcluindo("");
    }
  };

  return (
    <Admin>
      <Box sx={{ width: "100%", pb: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Banners
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Gerencie as imagens e os textos dos banners do site.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={abrirNovo}
            sx={{ alignSelf: { xs: "flex-start", sm: "auto" } }}
          >
            Novo banner
          </Button>
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

        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          {carregando ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
              <CircularProgress />
            </Box>
          ) : banners.length === 0 ? (
            <Box sx={{ textAlign: "center", p: { xs: 4, sm: 7 } }}>
              <ImageOutlinedIcon
                sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
              />
              <Typography variant="h6" color="text.primary">
                Nenhum banner cadastrado
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                Cadastre o primeiro banner para começar a organizar o conteúdo.
              </Typography>
              <Button variant="contained" onClick={abrirNovo}>
                Cadastrar primeiro banner
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Imagem</TableCell>
                    <TableCell>Título</TableCell>
                    <TableCell>Ordem</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id} hover>
                      <TableCell sx={{ width: 150 }}>
                        {banner.imagemUrl ? (
                          <Box
                            component="img"
                            src={banner.imagemUrl}
                            alt={banner.titulo || "Banner"}
                            sx={{
                              display: "block",
                              width: 120,
                              height: 66,
                              objectFit: "cover",
                              borderRadius: 1,
                              bgcolor: "grey.100",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 120,
                              height: 66,
                              display: "grid",
                              placeItems: "center",
                              bgcolor: "grey.100",
                              borderRadius: 1,
                            }}
                          >
                            <ImageOutlinedIcon color="disabled" />
                          </Box>
                        )}
                      </TableCell>

                      <TableCell>
                        <Typography fontWeight={600} color="text.primary">
                          {banner.titulo || "Sem título"}
                        </Typography>
                        {banner.subtitulo && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              maxWidth: 260,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {banner.subtitulo}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>{banner.ordem || 1}</TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={banner.ativo === false ? "Inativo" : "Ativo"}
                          color={banner.ativo === false ? "default" : "success"}
                          variant={
                            banner.ativo === false ? "outlined" : "filled"
                          }
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="Editar banner">
                          <IconButton
                            aria-label="Editar banner"
                            onClick={() => abrirEdicao(banner)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Excluir banner">
                          <span>
                            <IconButton
                              aria-label="Excluir banner"
                              color="error"
                              disabled={excluindo === banner.id}
                              onClick={() => excluirBanner(banner)}
                            >
                              {excluindo === banner.id ? (
                                <CircularProgress size={22} />
                              ) : (
                                <DeleteOutlineIcon />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Dialog
          open={modalAberto}
          onClose={fecharModal}
          fullWidth
          maxWidth="sm"
        >
          <Box component="form" onSubmit={salvarBanner}>
            <DialogTitle>
              {bannerEditando ? "Editar banner" : "Cadastrar banner"}
            </DialogTitle>

            <DialogContent dividers>
              <Stack spacing={2.5} sx={{ pt: 1 }}>
                {erro && <Alert severity="error">{erro}</Alert>}

                <TextField
                  label="Título"
                  value={formulario.titulo}
                  onChange={(event) =>
                    alterarCampo("titulo", event.target.value)
                  }
                  required
                  fullWidth
                  inputProps={{ maxLength: 120 }}
                />

                <TextField
                  label="Subtítulo"
                  value={formulario.subtitulo}
                  onChange={(event) =>
                    alterarCampo("subtitulo", event.target.value)
                  }
                  fullWidth
                  multiline
                  minRows={2}
                  inputProps={{ maxLength: 300 }}
                />

                <TextField
                  label="Link do banner (opcional)"
                  value={formulario.link}
                  onChange={(event) => alterarCampo("link", event.target.value)}
                  fullWidth
                  placeholder="/produtos ou https://..."
                  helperText="Pode ser uma página do site ou um endereço externo."
                />

                <Box>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<ImageOutlinedIcon />}
                  >
                    Selecionar imagem
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setImagem(event.target.files?.[0] || null)
                      }
                    />
                  </Button>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 1 }}
                  >
                    Formatos de imagem aceitos pelo navegador. Tamanho máximo:
                    10 MB.
                  </Typography>

                  {imagem && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Novo arquivo: {imagem.name}
                    </Typography>
                  )}

                  {(imagem || formulario.imagemUrl) && (
                    <Box
                      component="img"
                      src={
                        imagem
                          ? URL.createObjectURL(imagem)
                          : formulario.imagemUrl
                      }
                      alt="Pré-visualização do banner"
                      sx={{
                        mt: 2,
                        display: "block",
                        width: "100%",
                        maxHeight: 220,
                        objectFit: "contain",
                        borderRadius: 1,
                        bgcolor: "grey.100",
                      }}
                    />
                  )}
                </Box>

                <TextField
                  label="Ordem de exibição"
                  type="number"
                  value={formulario.ordem}
                  onChange={(event) =>
                    alterarCampo("ordem", event.target.value)
                  }
                  inputProps={{ min: 1, step: 1 }}
                  required
                  fullWidth
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={formulario.ativo}
                      onChange={(event) =>
                        alterarCampo("ativo", event.target.checked)
                      }
                    />
                  }
                  label="Banner ativo"
                />
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={fecharModal} disabled={salvando}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={salvando}
                startIcon={
                  salvando ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : undefined
                }
              >
                {salvando ? "Salvando..." : "Salvar banner"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Admin>
  );
}
