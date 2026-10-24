import { useEffect, useState } from "react";
import Admin from "../../../components/admin";
import { db } from "../../../../firebase-config";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowDownward,
  ArrowUpward,
  Save,
  Refresh,
  Star,
} from "@mui/icons-material";

const CONFIG_COLLECTION = "siteConfig";
const CONFIG_DOCUMENT = "home";
const PRODUCTS_COLLECTION = "produtos";

export default function DestaquesAdmin() {
  const [produtos, setProdutos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function carregarDados() {
    setCarregando(true);
    setErro("");
    setSucesso("");

    try {
      const [produtosSnapshot, configSnapshot] = await Promise.all([
        getDocs(collection(db, PRODUCTS_COLLECTION)),
        getDoc(doc(db, CONFIG_COLLECTION, CONFIG_DOCUMENT)),
      ]);

      const lista = produtosSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      lista.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""), "pt-BR"),
      );

      setProdutos(lista);

      const config = configSnapshot.exists() ? configSnapshot.data() : {};

      const destaquesSalvos = Array.isArray(config.produtosDestaque)
        ? config.produtosDestaque
        : [];

      // Mantém somente IDs de produtos que ainda existem.
      const idsExistentes = new Set(lista.map((produto) => produto.id));

      setSelecionados(destaquesSalvos.filter((id) => idsExistentes.has(id)));
    } catch (error) {
      console.error("Erro ao carregar destaques:", error);
      setErro(
        "Não foi possível carregar os produtos ou a configuração da home. Verifique as permissões do Firebase.",
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function alternarProduto(id) {
    setSelecionados((anteriores) => {
      if (anteriores.includes(id)) {
        return anteriores.filter((item) => item !== id);
      }

      return [...anteriores, id];
    });

    setErro("");
    setSucesso("");
  }

  function moverProduto(index, direcao) {
    const novaLista = [...selecionados];
    const novoIndex = index + direcao;

    if (novoIndex < 0 || novoIndex >= novaLista.length) return;

    [novaLista[index], novaLista[novoIndex]] = [
      novaLista[novoIndex],
      novaLista[index],
    ];

    setSelecionados(novaLista);
    setSucesso("");
  }

  async function salvarDestaques() {
    setSalvando(true);
    setErro("");
    setSucesso("");

    try {
      await setDoc(
        doc(db, CONFIG_COLLECTION, CONFIG_DOCUMENT),
        {
          produtosDestaque: selecionados,
          atualizadoEm: serverTimestamp(),
        },
        { merge: true },
      );

      setSucesso("Destaques da página inicial salvos com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar destaques:", error);
      setErro(
        "Não foi possível salvar os destaques. Verifique as permissões do Firestore.",
      );
    } finally {
      setSalvando(false);
    }
  }

  const produtosSelecionados = selecionados
    .map((id) => produtos.find((produto) => produto.id === id))
    .filter(Boolean);

  const produtosDisponiveis = produtos.filter(
    (produto) => !selecionados.includes(produto.id),
  );

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
              Destaques da página inicial
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Escolha os produtos que terão prioridade na página inicial.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={carregarDados}
              disabled={carregando || salvando}
            >
              Atualizar
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
              onClick={salvarDestaques}
              disabled={carregando || salvando}
            >
              {salvando ? "Salvando..." : "Salvar destaques"}
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

        {carregando ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>
              Carregando produtos e configuração...
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            <Paper sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Produtos selecionados
                </Typography>

                <Typography color="text.secondary" variant="body2">
                  {selecionados.length} selecionado(s)
                </Typography>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Use as setas para definir a ordem. O primeiro produto da lista
                terá a primeira posição na configuração.
              </Typography>

              {produtosSelecionados.length === 0 && (
                <Alert severity="info">
                  Nenhum produto selecionado. Escolha produtos na lista abaixo.
                </Alert>
              )}

              <Stack spacing={1}>
                {produtosSelecionados.map((produto, index) => (
                  <Paper key={produto.id} variant="outlined" sx={{ p: 1.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography
                        sx={{
                          minWidth: 28,
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                      >
                        {index + 1}
                      </Typography>

                      {produto.image ? (
                        <Box
                          component="img"
                          src={produto.image}
                          alt={produto.name || "Produto"}
                          sx={{
                            width: 76,
                            height: 58,
                            objectFit: "contain",
                            bgcolor: "#f5f5f5",
                            borderRadius: 1,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 76,
                            height: 58,
                            display: "grid",
                            placeItems: "center",
                            bgcolor: "#f5f5f5",
                            borderRadius: 1,
                          }}
                        >
                          <Star color="disabled" />
                        </Box>
                      )}

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={600}>
                          {produto.name || "Produto sem nome"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {produto.line || "Sem linha cadastrada"}
                        </Typography>
                      </Box>

                      <Stack>
                        <IconButton
                          size="small"
                          title="Mover para cima"
                          disabled={index === 0}
                          onClick={() => moverProduto(index, -1)}
                        >
                          <ArrowUpward />
                        </IconButton>

                        <IconButton
                          size="small"
                          title="Mover para baixo"
                          disabled={index === produtosSelecionados.length - 1}
                          onClick={() => moverProduto(index, 1)}
                        >
                          <ArrowDownward />
                        </IconButton>
                      </Stack>

                      <Button
                        color="error"
                        size="small"
                        onClick={() => alternarProduto(produto.id)}
                      >
                        Remover
                      </Button>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                Adicionar produtos
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Marque os produtos que deseja incluir nos destaques. Os produtos
                precisam estar cadastrados no Firestore.
              </Typography>

              {produtos.length === 0 ? (
                <Alert severity="warning">
                  Ainda não existem produtos cadastrados. Cadastre produtos
                  antes de configurar os destaques.
                </Alert>
              ) : produtosDisponiveis.length === 0 ? (
                <Alert severity="success">
                  Todos os produtos cadastrados já foram selecionados.
                </Alert>
              ) : (
                <Stack spacing={1}>
                  {produtosDisponiveis.map((produto) => (
                    <Box key={produto.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={false}
                            onChange={() => alternarProduto(produto.id)}
                          />
                        }
                        label={
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            {produto.image ? (
                              <Box
                                component="img"
                                src={produto.image}
                                alt={produto.name || "Produto"}
                                sx={{
                                  width: 64,
                                  height: 48,
                                  objectFit: "contain",
                                  bgcolor: "#f5f5f5",
                                  borderRadius: 1,
                                }}
                              />
                            ) : null}

                            <Box>
                              <Typography fontWeight={600}>
                                {produto.name || "Produto sem nome"}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {produto.line || "Sem linha cadastrada"}
                                {produto.ativo === false ? " · Inativo" : ""}
                              </Typography>
                            </Box>
                          </Stack>
                        }
                        sx={{ m: 0, width: "100%" }}
                      />

                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>

            <Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                onClick={salvarDestaques}
                disabled={salvando}
              >
                Salvar destaques
              </Button>
            </Box>
          </Stack>
        )}
      </Box>
    </Admin>
  );
}
