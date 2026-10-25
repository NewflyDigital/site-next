import { useEffect, useState } from "react";
import Admin from "../../../components/admin";
import { db } from "../../../../firebase-config";

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

const COLLECTION = "linhas";

const linhaVazia = {
  nome: "",
  slug: "",
  headline: "",
  description: "",
  image: "",
  ordem: 0,
  ativo: true,
};

function slugify(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminLinhas() {
  const [linhas, setLinhas] = useState([]);
  const [form, setForm] = useState(linhaVazia);
  const [linhaId, setLinhaId] = useState(null);
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarLinhas() {
    setCarregando(true);
    setErro("");

    try {
      const snapshot = await getDocs(
        query(collection(db, COLLECTION), orderBy("ordem", "asc")),
      );

      setLinhas(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })),
      );
    } catch (error) {
      console.error("Erro ao carregar linhas:", error);
      setErro("Não foi possível carregar as linhas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarLinhas();
  }, []);

  function novaLinha() {
    setLinhaId(null);
    setForm({ ...linhaVazia });
    setErro("");
    setAberto(true);
  }

  function editarLinha(linha) {
    setLinhaId(linha.id);
    setForm({
      ...linhaVazia,
      ...linha,
    });
    setErro("");
    setAberto(true);
  }

  function alterarCampo(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor,
      ...(campo === "nome" && !linhaId ? { slug: slugify(valor) } : {}),
    }));
  }

  async function salvarLinha() {
    if (!form.nome.trim()) {
      setErro("Informe o nome da linha.");
      return;
    }

    const slug = slugify(form.slug || form.nome);

    if (!slug) {
      setErro("Informe um nome ou identificador válido.");
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      const dados = {
        nome: form.nome.trim(),
        slug,
        headline: form.headline.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        ordem: Number(form.ordem) || 0,
        ativo: Boolean(form.ativo),
        atualizadoEm: serverTimestamp(),
      };

      if (linhaId) {
        await updateDoc(doc(db, COLLECTION, linhaId), dados);
      } else {
        await addDoc(collection(db, COLLECTION), {
          ...dados,
          criadoEm: serverTimestamp(),
        });
      }

      setAberto(false);
      await carregarLinhas();
    } catch (error) {
      console.error("Erro ao salvar linha:", error);
      setErro("Não foi possível salvar. Verifique as permissões do Firestore.");
    } finally {
      setSalvando(false);
    }
  }

  async function alternarStatus(linha) {
    try {
      await updateDoc(doc(db, COLLECTION, linha.id), {
        ativo: !linha.ativo,
        atualizadoEm: serverTimestamp(),
      });

      await carregarLinhas();
    } catch (error) {
      console.error(error);
      setErro("Não foi possível alterar o status da linha.");
    }
  }

  async function excluirLinha(linha) {
    const vinculados = await getDocs(query(collection(db, "produtos")));

    const possuiProdutos = vinculados.docs.some((item) => {
      const produto = item.data();
      return (
        produto.linhaId === linha.id ||
        produto.lineId === linha.id ||
        produto.line === linha.slug
      );
    });

    if (possuiProdutos) {
      setErro(
        "Esta linha possui produtos vinculados. Desative-a em vez de excluí-la.",
      );
      return;
    }

    if (!window.confirm(`Deseja excluir a linha "${linha.nome}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, COLLECTION, linha.id));
      await carregarLinhas();
    } catch (error) {
      console.error(error);
      setErro("Não foi possível excluir a linha.");
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
              Linhas de produtos
            </Typography>
            <Typography color="text.secondary">
              Cadastre e organize as linhas da NEXT Implementos.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={carregarLinhas}
            >
              Atualizar
            </Button>

            <Button variant="contained" startIcon={<Add />} onClick={novaLinha}>
              Nova linha
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
                <TableCell>Nome</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {carregando ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : linhas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhuma linha cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                linhas.map((linha) => (
                  <TableRow key={linha.id} hover>
                    <TableCell>{linha.ordem ?? 0}</TableCell>
                    <TableCell>{linha.nome}</TableCell>
                    <TableCell>{linha.slug}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={linha.ativo ? "Ativa" : "Inativa"}
                        color={linha.ativo ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        title="Editar"
                        onClick={() => editarLinha(linha)}
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        title={linha.ativo ? "Desativar" : "Ativar"}
                        onClick={() => alternarStatus(linha)}
                      >
                        <Switch
                          size="small"
                          checked={Boolean(linha.ativo)}
                          readOnly
                        />
                      </IconButton>

                      <IconButton
                        title="Excluir"
                        color="error"
                        onClick={() => excluirLinha(linha)}
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
            {linhaId ? "Editar linha" : "Cadastrar linha"}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField
                label="Nome da linha"
                value={form.nome}
                onChange={(e) => alterarCampo("nome", e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Slug / URL"
                value={form.slug}
                onChange={(e) => alterarCampo("slug", e.target.value)}
                helperText="Ex.: guindastes"
                required
                fullWidth
              />

              <TextField
                label="Título principal"
                value={form.headline}
                onChange={(e) => alterarCampo("headline", e.target.value)}
                fullWidth
              />

              <TextField
                label="Descrição"
                value={form.description}
                onChange={(e) => alterarCampo("description", e.target.value)}
                multiline
                minRows={3}
                fullWidth
              />

              <TextField
                label="URL da imagem de capa"
                value={form.image}
                onChange={(e) => alterarCampo("image", e.target.value)}
                helperText="Pode ser preenchida com a URL da imagem no Firebase Storage."
                fullWidth
              />

              <TextField
                label="Ordem de exibição"
                type="number"
                value={form.ordem}
                onChange={(e) => alterarCampo("ordem", e.target.value)}
                fullWidth
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(form.ativo)}
                    onChange={(e) => alterarCampo("ativo", e.target.checked)}
                  />
                }
                label="Linha ativa"
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setAberto(false)} disabled={salvando}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={salvarLinha}
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar linha"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Admin>
  );
}
