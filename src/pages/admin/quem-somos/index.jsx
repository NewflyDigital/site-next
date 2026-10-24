import { useEffect, useState } from "react";
import Admin from "../../../components/admin";
import { db, storage } from "../../../../firebase-config";

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Delete,
  Save,
  Refresh,
  Image as ImageIcon,
} from "@mui/icons-material";

const CONFIG_COLLECTION = "paginas";
const CONFIG_DOCUMENT = "quem-somos";

const conteudoInicial = {
  seoTitle: "Quem Somos | NEXT Implementos",
  seoDescription:
    "Conheça a NEXT Implementos, sua engenharia, fábrica e compromisso com operações profissionais.",
  ogTitle: "Somos a NEXT",
  ogDescription:
    "Engenharia, pessoas e tecnologia transformando desafios em soluções.",

  heroEyebrow: "Quem somos",
  heroTitle: "Somos a NEXT.",
  heroDescription:
    "Engenharia, pessoas e tecnologia transformando desafios em soluções.",
  heroButton: "Conheça nossa história",

  factoryImage: "/static/images/next-factory.jpg",
  factoryImagePath: "",
  factoryImageAlt: "Estrutura industrial da NEXT Implementos",

  historyEyebrow: "Nossa história",
  historyTitle: "Construída para transformar desafios em soluções.",
  historyDescription:
    "Fundada em 2012, a NEXT atua no desenvolvimento de equipamentos para trabalho em altura e implementos rodoviários. Sua estrutura reúne engenharia, fabricação e atendimento orientados às necessidades reais de cada operação.",
  foundingYear: "2012",

  engineeringImage: "/static/images/next-engineering.jpg",
  engineeringImagePath: "",
  engineeringImageAlt: "Especialista trabalhando em equipamento da NEXT",

  stagesEyebrow: "Estrutura integrada",
  stagesTitle: "Da ideia à expedição, controle em cada etapa.",
  stages: [
    "Engenharia",
    "Montagem",
    "Soldagem",
    "Pintura",
    "Testes",
    "Expedição",
  ],

  videoEyebrow: "NEXT em movimento",
  videoTitle: "Conheça nossa estrutura e nosso trabalho.",
  videoDescription:
    "Engenharia, tecnologia e pessoas trabalhando juntas para desenvolver soluções que atendam às necessidades de cada operação.",
  videoUrl: "https://www.youtube.com/watch?v=3TOzM23TuZ0",

  values: [
    {
      title: "Missão",
      description:
        "Desenvolver soluções que contribuam para operações mais seguras, produtivas e confiáveis.",
    },
    {
      title: "Visão",
      description:
        "Evoluir continuamente como referência brasileira em equipamentos e implementos profissionais.",
    },
    {
      title: "Valores",
      description:
        "Engenharia, segurança, qualidade, confiança, melhoria contínua e respeito aos clientes.",
    },
  ],

  ctaEyebrow: "Vamos conversar?",
  ctaTitle: "Sua operação merece soluções à altura do seu desafio.",
  ctaButton: "Fale com a NEXT",
  ctaLink: "/contato",

  ativo: true,
};

const camposTexto = [
  {
    titulo: "SEO e compartilhamento",
    campos: [
      ["seoTitle", "Título SEO"],
      ["seoDescription", "Descrição SEO"],
      ["ogTitle", "Título para compartilhamento"],
      ["ogDescription", "Descrição para compartilhamento"],
    ],
  },
  {
    titulo: "Banner principal",
    campos: [
      ["heroEyebrow", "Texto pequeno acima do título"],
      ["heroTitle", "Título principal"],
      ["heroDescription", "Texto de apresentação"],
      ["heroButton", "Texto do botão"],
      ["factoryImageAlt", "Descrição acessível da imagem da fábrica"],
    ],
  },
  {
    titulo: "Nossa história",
    campos: [
      ["historyEyebrow", "Texto pequeno acima do título"],
      ["historyTitle", "Título da história"],
      ["historyDescription", "Texto da história"],
      ["foundingYear", "Ano de fundação"],
      ["engineeringImageAlt", "Descrição acessível da imagem de engenharia"],
    ],
  },
  {
    titulo: "Estrutura integrada",
    campos: [
      ["stagesEyebrow", "Texto pequeno acima do título"],
      ["stagesTitle", "Título da seção"],
    ],
  },
  {
    titulo: "Vídeo institucional",
    campos: [
      ["videoEyebrow", "Texto pequeno acima do título"],
      ["videoTitle", "Título da seção"],
      ["videoDescription", "Descrição do vídeo"],
      ["videoUrl", "URL do vídeo do YouTube"],
    ],
  },
  {
    titulo: "Chamada para contato",
    campos: [
      ["ctaEyebrow", "Texto pequeno acima do título"],
      ["ctaTitle", "Título da chamada"],
      ["ctaButton", "Texto do botão"],
      ["ctaLink", "Link do botão"],
    ],
  },
];

function nomeSeguro(nome = "imagem") {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "-");
}

export default function QuemSomosAdmin() {
  const [form, setForm] = useState(conteudoInicial);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [imagemFabrica, setImagemFabrica] = useState(null);
  const [imagemEngenharia, setImagemEngenharia] = useState(null);

  async function carregarConteudo() {
    setCarregando(true);
    setErro("");
    setSucesso("");

    try {
      const snapshot = await getDoc(
        doc(db, CONFIG_COLLECTION, CONFIG_DOCUMENT),
      );

      if (snapshot.exists()) {
        const dados = snapshot.data();

        setForm({
          ...conteudoInicial,
          ...dados,
          stages: Array.isArray(dados.stages)
            ? dados.stages
            : conteudoInicial.stages,
          values: Array.isArray(dados.values)
            ? dados.values
            : conteudoInicial.values,
        });
      } else {
        setForm(conteudoInicial);
      }

      setImagemFabrica(null);
      setImagemEngenharia(null);
    } catch (error) {
      console.error("Erro ao carregar Quem Somos:", error);
      setErro("Não foi possível carregar o conteúdo do Firestore.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarConteudo();
  }, []);

  function alterar(campo, valor) {
    setForm((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setSucesso("");
  }

  function alterarEtapa(index, valor) {
    const stages = [...form.stages];
    stages[index] = valor;
    alterar("stages", stages);
  }

  function adicionarEtapa() {
    alterar("stages", [...form.stages, ""]);
  }

  function removerEtapa(index) {
    alterar(
      "stages",
      form.stages.filter((_, i) => i !== index),
    );
  }

  function alterarValor(index, campo, valor) {
    const values = [...form.values];

    values[index] = {
      ...values[index],
      [campo]: valor,
    };

    alterar("values", values);
  }

  function adicionarValor() {
    alterar("values", [...form.values, { title: "", description: "" }]);
  }

  function removerValor(index) {
    alterar(
      "values",
      form.values.filter((_, i) => i !== index),
    );
  }

  function selecionarImagem(evento, tipo) {
    const arquivo = evento.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      setErro("Selecione um arquivo de imagem válido.");
      evento.target.value = "";
      return;
    }

    if (arquivo.size > 10 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 10 MB.");
      evento.target.value = "";
      return;
    }

    if (tipo === "fabrica") setImagemFabrica(arquivo);
    if (tipo === "engenharia") setImagemEngenharia(arquivo);

    setErro("");
    setSucesso("");
    evento.target.value = "";
  }

  async function enviarImagem(arquivo, destino) {
    if (!arquivo) return null;

    const caminho =
      `paginas/quem-somos/${destino}/` +
      `${Date.now()}-${nomeSeguro(arquivo.name)}`;

    const referencia = ref(storage, caminho);

    await uploadBytes(referencia, arquivo);

    return {
      url: await getDownloadURL(referencia),
      path: caminho,
    };
  }

  async function removerArquivoAntigo(caminho) {
    if (!caminho) return;

    try {
      await deleteObject(ref(storage, caminho));
    } catch (error) {
      console.warn("Não foi possível remover a imagem antiga:", error);
    }
  }

  async function salvar() {
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const dados = {
        ...form,
        stages: form.stages.filter((etapa) => etapa.trim()),
        values: form.values.filter(
          (item) => item.title.trim() || item.description.trim(),
        ),
        atualizadoEm: serverTimestamp(),
      };

      const arquivosAntigos = [];

      if (imagemFabrica) {
        const novo = await enviarImagem(imagemFabrica, "fabrica");

        if (novo) {
          if (dados.factoryImagePath) {
            arquivosAntigos.push(dados.factoryImagePath);
          }

          dados.factoryImage = novo.url;
          dados.factoryImagePath = novo.path;
        }
      }

      if (imagemEngenharia) {
        const novo = await enviarImagem(imagemEngenharia, "engenharia");

        if (novo) {
          if (dados.engineeringImagePath) {
            arquivosAntigos.push(dados.engineeringImagePath);
          }

          dados.engineeringImage = novo.url;
          dados.engineeringImagePath = novo.path;
        }
      }

      await setDoc(
        doc(db, CONFIG_COLLECTION, CONFIG_DOCUMENT),
        {
          ...dados,
          criadoEm: form.criadoEm || serverTimestamp(),
        },
        { merge: true },
      );

      for (const caminho of arquivosAntigos) {
        await removerArquivoAntigo(caminho);
      }

      setForm(dados);
      setImagemFabrica(null);
      setImagemEngenharia(null);
      setSucesso("Conteúdo de Quem Somos salvo com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar Quem Somos:", error);
      setErro(
        "Não foi possível salvar. Verifique as permissões do Firestore e do Storage.",
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <Admin>
        <Box sx={{ p: 5, textAlign: "center" }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>
            Carregando conteúdo institucional...
          </Typography>
        </Box>
      </Admin>
    );
  }

  return (
    <Admin>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Quem Somos
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Edite o conteúdo institucional da NEXT Implementos.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={carregarConteudo}
              disabled={salvando}
            >
              Recarregar
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
              onClick={salvar}
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
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

        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Switch
              checked={Boolean(form.ativo)}
              onChange={(e) => alterar("ativo", e.target.checked)}
            />

            <Box>
              <Typography fontWeight={600}>Página publicada</Typography>
              <Typography variant="body2" color="text.secondary">
                Controle de publicação para a futura integração com o site.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {camposTexto.map((grupo) => (
          <Paper key={grupo.titulo} sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              {grupo.titulo}
            </Typography>

            <Grid container spacing={2}>
              {grupo.campos.map(([campo, label]) => {
                const multiline = [
                  "seoDescription",
                  "ogDescription",
                  "heroDescription",
                  "historyDescription",
                  "videoDescription",
                  "ctaTitle",
                ].includes(campo);

                return (
                  <Grid
                    item
                    xs={12}
                    md={
                      [
                        "seoTitle",
                        "ogTitle",
                        "foundingYear",
                        "heroButton",
                        "ctaButton",
                        "ctaLink",
                      ].includes(campo)
                        ? 6
                        : 12
                    }
                    key={campo}
                  >
                    <TextField
                      fullWidth
                      label={label}
                      value={form[campo] ?? ""}
                      onChange={(e) => alterar(campo, e.target.value)}
                      multiline={multiline}
                      minRows={multiline ? 3 : undefined}
                      helperText={
                        campo === "videoUrl"
                          ? "Informe a URL completa do YouTube."
                          : undefined
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>

            {grupo.titulo === "Banner principal" && (
              <Box sx={{ mt: 3 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  Imagem da fábrica
                </Typography>

                {form.factoryImage && (
                  <Box
                    component="img"
                    src={form.factoryImage}
                    alt={form.factoryImageAlt}
                    sx={{
                      display: "block",
                      width: "100%",
                      maxWidth: 500,
                      maxHeight: 220,
                      objectFit: "cover",
                      mb: 2,
                      borderRadius: 1,
                    }}
                  />
                )}

                <Button component="label" variant="outlined">
                  <ImageIcon sx={{ mr: 1 }} />
                  Substituir imagem da fábrica
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => selecionarImagem(e, "fabrica")}
                  />
                </Button>

                {imagemFabrica && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Arquivo selecionado: {imagemFabrica.name}
                  </Typography>
                )}
              </Box>
            )}

            {grupo.titulo === "Nossa história" && (
              <Box sx={{ mt: 3 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>
                  Imagem de engenharia
                </Typography>

                {form.engineeringImage && (
                  <Box
                    component="img"
                    src={form.engineeringImage}
                    alt={form.engineeringImageAlt}
                    sx={{
                      display: "block",
                      width: "100%",
                      maxWidth: 500,
                      maxHeight: 220,
                      objectFit: "cover",
                      mb: 2,
                      borderRadius: 1,
                    }}
                  />
                )}

                <Button component="label" variant="outlined">
                  <ImageIcon sx={{ mr: 1 }} />
                  Substituir imagem de engenharia
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => selecionarImagem(e, "engenharia")}
                  />
                </Button>

                {imagemEngenharia && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Arquivo selecionado: {imagemEngenharia.name}
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        ))}

        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight={700}>
              Etapas de produção
            </Typography>

            <Button startIcon={<Add />} onClick={adicionarEtapa}>
              Adicionar etapa
            </Button>
          </Stack>

          <Stack spacing={2}>
            {form.stages.map((etapa, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Typography sx={{ width: 32, color: "text.secondary" }}>
                  {String(index + 1).padStart(2, "0")}
                </Typography>

                <TextField
                  fullWidth
                  label={`Etapa ${index + 1}`}
                  value={etapa}
                  onChange={(e) => alterarEtapa(index, e.target.value)}
                />

                <IconButton
                  color="error"
                  onClick={() => removerEtapa(index)}
                  title="Remover etapa"
                >
                  <Delete />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight={700}>
              Missão, visão e valores
            </Typography>

            <Button startIcon={<Add />} onClick={adicionarValor}>
              Adicionar item
            </Button>
          </Stack>

          <Stack spacing={3}>
            {form.values.map((item, index) => (
              <Box key={index}>
                {index > 0 && <Divider sx={{ mb: 3 }} />}

                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Título"
                      value={item.title}
                      onChange={(e) =>
                        alterarValor(index, "title", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Descrição"
                      value={item.description}
                      onChange={(e) =>
                        alterarValor(index, "description", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={1}>
                    <IconButton
                      color="error"
                      onClick={() => removerValor(index)}
                      title="Remover item"
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={salvar}
          disabled={salvando}
          sx={{ py: 1.5, mb: 4 }}
        >
          {salvando ? "Salvando..." : "Salvar conteúdo de Quem Somos"}
        </Button>
      </Box>
    </Admin>
  );
}
