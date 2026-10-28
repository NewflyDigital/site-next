import { useEffect, useState } from "react";
import Head from "next/head";
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
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import Swal from "sweetalert2";

import { db } from "../../../../firebase-config";
import Admin from "../../../components/admin";

const ESTADOS = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

const FORM_VAZIO = {
  tipo: "comercial",
  estado: "RS",
  contato: "",
  empresa: "",
  cargo: "",
  telefone: "",
  email: "",
  ordem: 0,
  ativo: true,
};

export default function RepresentantesAdmin() {
  const [representantes, setRepresentantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [form, setForm] = useState(FORM_VAZIO);
  const [erro, setErro] = useState("");

  async function carregarRepresentantes() {
    setCarregando(true);

    try {
      const snapshot = await getDocs(collection(db, "representantes"));

      const lista = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      lista.sort(
        (a, b) =>
          Number(a.ordem || 0) - Number(b.ordem || 0) ||
          String(a.contato || a.empresa || "").localeCompare(
            String(b.contato || b.empresa || ""),
            "pt-BR",
          ),
      );

      setRepresentantes(lista);
      setErro("");
    } catch (error) {
      console.error("Erro ao carregar representantes:", error);
      setErro(
        "Não foi possível carregar os cadastros. Verifique as permissões do Firestore.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarRepresentantes();
  }, []);

  function abrirNovo() {
    setEditandoId(null);
    setForm({ ...FORM_VAZIO });
    setErro("");
    setDialogAberto(true);
  }

  function abrirEdicao(item) {
    setEditandoId(item.id);
    setForm({
      ...FORM_VAZIO,
      ...item,
      ordem: Number(item.ordem || 0),
    });
    setErro("");
    setDialogAberto(true);
  }

  function alterarCampo(campo, valor) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function salvarRepresentante() {
    if (!form.contato.trim()) {
      setErro("Informe o nome do contato.");
      return;
    }

    if (form.tipo === "comercial" && !form.estado) {
      setErro("Selecione o estado do representante comercial.");
      return;
    }

    if (form.tipo === "ti" && !form.empresa.trim()) {
      setErro("Informe o nome da empresa de TI.");
      return;
    }

    setSalvando(true);
    setErro("");

    const dados = {
      tipo: form.tipo,
      estado: form.tipo === "comercial" ? form.estado : "",
      contato: form.contato.trim(),
      empresa: form.empresa.trim(),
      cargo: form.cargo.trim(),
      telefone: form.telefone.trim(),
      email: form.email.trim(),
      ordem: Number(form.ordem || 0),
      ativo: Boolean(form.ativo),
      atualizadoEm: serverTimestamp(),
    };

    try {
      if (editandoId) {
        await updateDoc(doc(db, "representantes", editandoId), dados);
      } else {
        await addDoc(collection(db, "representantes"), {
          ...dados,
          criadoEm: serverTimestamp(),
        });
      }

      setDialogAberto(false);
      await carregarRepresentantes();

      await Swal.fire({
        icon: "success",
        title: "Cadastro salvo!",
        text: "Os dados foram salvos com sucesso.",
        confirmButtonColor: "#D90820",
      });
    } catch (error) {
      console.error("Erro ao salvar representante:", error);
      setErro("Não foi possível salvar. Verifique as permissões do Firestore.");
    } finally {
      setSalvando(false);
    }
  }

  async function alternarAtivo(item) {
    try {
      await updateDoc(doc(db, "representantes", item.id), {
        ativo: !item.ativo,
        atualizadoEm: serverTimestamp(),
      });

      await carregarRepresentantes();
    } catch (error) {
      console.error("Erro ao alterar status:", error);

      Swal.fire({
        icon: "error",
        title: "Não foi possível alterar o status",
        text: "Verifique as permissões do Firestore.",
        confirmButtonColor: "#D90820",
      });
    }
  }

  async function excluirRepresentante(item) {
    const resultado = await Swal.fire({
      icon: "warning",
      title: "Excluir cadastro?",
      text: `Deseja excluir ${item.contato || item.empresa}? Esta ação não pode ser desfeita.`,
      showCancelButton: true,
      confirmButtonText: "Excluir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d32f2f",
    });

    if (!resultado.isConfirmed) return;

    try {
      await deleteDoc(doc(db, "representantes", item.id));
      await carregarRepresentantes();
    } catch (error) {
      console.error("Erro ao excluir representante:", error);

      Swal.fire({
        icon: "error",
        title: "Erro ao excluir",
        text: "Não foi possível excluir o cadastro.",
        confirmButtonColor: "#D90820",
      });
    }
  }

  const listaFiltrada = representantes.filter(
    (item) => filtroTipo === "todos" || item.tipo === filtroTipo,
  );

  return (
    <Admin>
      <Head>
        <title>Representantes | NEXT Admin</title>
      </Head>

      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Representantes
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Gerencie os representantes comerciais e os contatos de TI da NEXT.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={abrirNovo}
            sx={{
              backgroundColor: "#D90820",
              "&:hover": { backgroundColor: "#d98500" },
            }}
          >
            Novo cadastro
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 230 }}>
            <InputLabel>Filtrar por tipo</InputLabel>
            <Select
              value={filtroTipo}
              label="Filtrar por tipo"
              onChange={(event) => setFiltroTipo(event.target.value)}
            >
              <MenuItem value="todos">Todos os cadastros</MenuItem>
              <MenuItem value="comercial">Representantes comerciais</MenuItem>
              <MenuItem value="ti">Empresa de TI</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        {erro && !dialogAberto && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        <Paper>
          {carregando ? (
            <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Contato / Empresa</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {listaFiltrada.map((item) => {
                    const estado = ESTADOS.find(
                      (estadoItem) => estadoItem.sigla === item.estado,
                    );

                    return (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Typography fontWeight={600}>
                            {item.contato || "—"}
                          </Typography>
                          {item.empresa && (
                            <Typography variant="body2" color="text.secondary">
                              {item.empresa}
                            </Typography>
                          )}
                          {item.cargo && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {item.cargo}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell>
                          {item.tipo === "ti" ? "Empresa de TI" : "Comercial"}
                        </TableCell>

                        <TableCell>
                          {item.tipo === "comercial"
                            ? estado?.nome || item.estado || "—"
                            : "—"}
                        </TableCell>

                        <TableCell>{item.telefone || "—"}</TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={item.ativo ? "Ativo" : "Inativo"}
                            color={item.ativo ? "success" : "default"}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            title={item.ativo ? "Desativar" : "Ativar"}
                            onClick={() => alternarAtivo(item)}
                            color={item.ativo ? "success" : "default"}
                          >
                            <Switch
                              checked={Boolean(item.ativo)}
                              size="small"
                              sx={{ pointerEvents: "none" }}
                            />
                          </IconButton>

                          <IconButton
                            title="Editar"
                            onClick={() => abrirEdicao(item)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            title="Excluir"
                            onClick={() => excluirRepresentante(item)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {listaFiltrada.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        Nenhum cadastro encontrado. Clique em “Novo cadastro”
                        para começar.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Dialog
          open={dialogAberto}
          onClose={() => !salvando && setDialogAberto(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            {editandoId ? "Editar cadastro" : "Novo cadastro"}
          </DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de cadastro</InputLabel>
                  <Select
                    value={form.tipo}
                    label="Tipo de cadastro"
                    onChange={(event) =>
                      alterarCampo("tipo", event.target.value)
                    }
                  >
                    <MenuItem value="comercial">
                      Representante comercial
                    </MenuItem>
                    <MenuItem value="ti">Empresa de TI</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {form.tipo === "comercial" && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Estado</InputLabel>
                    <Select
                      value={form.estado}
                      label="Estado"
                      onChange={(event) =>
                        alterarCampo("estado", event.target.value)
                      }
                    >
                      {ESTADOS.map((estado) => (
                        <MenuItem key={estado.sigla} value={estado.sigla}>
                          {estado.nome} ({estado.sigla})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Nome do contato"
                  value={form.contato}
                  onChange={(event) =>
                    alterarCampo("contato", event.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Empresa"
                  value={form.empresa}
                  onChange={(event) =>
                    alterarCampo("empresa", event.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cargo / função"
                  value={form.cargo}
                  onChange={(event) =>
                    alterarCampo("cargo", event.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={form.telefone}
                  onChange={(event) =>
                    alterarCampo("telefone", event.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="E-mail"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    alterarCampo("email", event.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Ordem de exibição"
                  type="number"
                  value={form.ordem}
                  onChange={(event) =>
                    alterarCampo("ordem", event.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Switch
                    checked={Boolean(form.ativo)}
                    onChange={(event) =>
                      alterarCampo("ativo", event.target.checked)
                    }
                  />
                  <Typography>Cadastro ativo no site</Typography>
                </Box>
              </Grid>
            </Grid>

            {erro && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {erro}
              </Alert>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogAberto(false)} disabled={salvando}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={salvarRepresentante}
              disabled={salvando}
              sx={{
                backgroundColor: "#D90820",
                "&:hover": { backgroundColor: "#d98500" },
              }}
            >
              {salvando ? "Salvando..." : "Salvar cadastro"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Admin>
  );
}
