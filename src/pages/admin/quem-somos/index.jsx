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
  FormControlLabel,
  Tooltip,
} from "@mui/material";

import {
  Add,
  Delete,
  Save,
  Refresh,
  Image as ImageIcon,
  ArrowUpward,
  ArrowDownward,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const CONFIG_COLLECTION = "paginas";
const CONFIG_DOCUMENT = "quem-somos";

const SECOES = [
  { id: "hero", label: "Banner principal" },
  { id: "historia", label: "Nossa história" },
  { id: "etapas", label: "Etapas de produção" },
  { id: "video", label: "Vídeo institucional" },
  { id: "valores", label: "Missão, visão e valores" },
  { id: "cta", label: "Chamada para contato" },
];

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

  sectionsVisibility: {
    hero: true,
    historia: true,
    etapas: true,
    video: true,
    valores: true,
    cta: true,
  },

  sectionOrder: ["hero", "historia", "etapas", "video", "valores", "cta"],
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

function criarFormulario(dados = {}) {
  const ordemSalva = Array.isArray(dados.sectionOrder)
    ? dados.sectionOrder
    : conteudoInicial.sectionOrder;

  // Mantém as seções novas mesmo quando o documento é antigo.
  const ordemNormalizada = [
    ...ordemSalva.filter((id) => SECOES.some((secao) => secao.id === id)),
    ...SECOES.map((secao) => secao.id).filter((id) => !ordemSalva.includes(id)),
  ];

  return {
    ...conteudoInicial,
    ...dados,

    stages: Array.isArray(dados.stages)
      ? dados.stages
      : [...conteudoInicial.stages],

    values: Array.isArray(dados.values)
      ? dados.values.map((item) => ({
          title: item?.title || "",
          description: item?.description || "",
        }))
      : conteudoInicial.values.map((item) => ({ ...item })),

    sectionsVisibility: {
      ...conteudoInicial.sectionsVisibility,
      ...(dados.sectionsVisibility || {}),
    },

    sectionOrder: ordemNormalizada,
  };
}

function nomeSeguro(nome = "imagem") {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "-");
}

function moverItem(lista, index, direcao) {
  const novaLista = [...lista];
  const destino = index + direcao;

  if (destino < 0 || destino >= novaLista.length) {
    return novaLista;
  }

  [novaLista[index], novaLista[destino]] = [
    novaLista[destino],
    novaLista[index],
  ];

  return novaLista;
}

export default function QuemSomosAdmin() {
  const [form, setForm] = useState(() => criarFormulario());
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [imagemFabrica, setImagemFabrica] = useState(null);
  const [imagemEngenharia, setImagemEngenharia] = useState(null);

  const [previewFabrica, setPreviewFabrica] = useState("");
  const [previewEngenharia, setPreviewEngenharia] = useState("");

  useEffect(() => {
    return () => {
      if (previewFabrica) URL.revokeObjectURL(previewFabrica);
      if (previewEngenharia) URL.revokeObjectURL(previewEngenharia);
    };
  }, [previewFabrica, previewEngenharia]);

  async function carregarConteudo() {
    setCarregando(true);
    setErro("");
    setSucesso("");

    try {
      const snapshot = await getDoc(
        doc(db, CONFIG_COLLECTION, CONFIG_DOCUMENT),
      );

      setForm(criarFormulario(snapshot.exists() ? snapshot.data() : {}));

      setImagemFabrica(null);
      setImagemEngenharia(null);

      setPreviewFabrica((anterior) => {
        if (anterior) URL.revokeObjectURL(anterior);
        return "";
      });

      setPreviewEngenharia((anterior) => {
        if (anterior) URL.revokeObjectURL(anterior);
        return "";
      });
    } catch (error) {
      console.error("Erro ao carregar Quem Somos:", error);
      setErro(
        "Não foi possível carregar o conteúdo. Verifique a conexão com o Firestore e as permissões de leitura.",
      );
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

  function alterarVisibilidade(secao, visivel) {
    setForm((anterior) => ({
      ...anterior,
      sectionsVisibility: {
        ...anterior.sectionsVisibility,
        [secao]: visivel,
      },
    }));

    setSucesso("");
  }

  function moverSecao(index, direcao) {
    alterar("sectionOrder", moverItem(form.sectionOrder, index, direcao));
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

  function moverEtapa(index, direcao) {
    alterar("stages", moverItem(form.stages, index, direcao));
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

  function moverValor(index, direcao) {
    alterar("values", moverItem(form.values, index, direcao));
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

    const preview = URL.createObjectURL(arquivo);

    if (tipo === "fabrica") {
      setPreviewFabrica((anterior) => {
        if (anterior) URL.revokeObjectURL(anterior);
        return preview;
      });
      setImagemFabrica(arquivo);
    }

    if (tipo === "engenharia") {
      setPreviewEngenharia((anterior) => {
        if (anterior) URL.revokeObjectURL(anterior);
        return preview;
      });
      setImagemEngenharia(arquivo);
    }

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

    await uploadBytes(referencia, arquivo, {
      contentType: arquivo.type,
    });

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

    let novaImagemFabrica = null;
    let novaImagemEngenharia = null;

    try {
      const snapshotAtual = await getDoc(
        doc(db, CONFIG_COLLECTION, CONFIG_DOCUMENT),
      );

      const dadosAnteriores = snapshotAtual.exists()
        ? snapshotAtual.data()
        : {};

      const dados = {
        ...form,

        stages: form.stages
          .map((etapa) => String(etapa).trim())
          .filter(Boolean),

        values: form.values
          .map((item) => ({
            title: String(item.title || "").trim(),
            description: String(item.description || "").trim(),
          }))
          .filter((item) => item.title || item.description),

        sectionsVisibility: {
          ...conteudoInicial.sectionsVisibility,
          ...form.sectionsVisibility,
        },

        sectionOrder: [
          ...form.sectionOrder.filter((id) =>
            SECOES.some((secao) => secao.id === id),
          ),
          ...SECOES.map((secao) => secao.id).filter(
            (id) => !form.sectionOrder.includes(id),
          ),
        ],

        atualizadoEm: serverTimestamp(),
      };

      const arquivosAntigos = [];

      if (imagemFabrica) {
        novaImagemFabrica = await enviarImagem(imagemFabrica, "fabrica");

        if (novaImagemFabrica) {
          const caminhoAntigo =
            dadosAnteriores.factoryImagePath || dados.factoryImagePath;

          if (caminhoAntigo) arquivosAntigos.push(caminhoAntigo);

          dados.factoryImage = novaImagemFabrica.url;
          dados.factoryImagePath = novaImagemFabrica.path;
        }
      }

      if (imagemEngenharia) {
        novaImagemEngenharia = await enviarImagem(
          imagemEngenharia,
          "engenharia",
        );

        if (novaImagemEngenharia) {
          const caminhoAntigo =
            dadosAnteriores.engineeringImagePath || dados.engineeringImagePath;

          if (caminhoAntigo) arquivosAntigos.push(caminhoAntigo);

          dados.engineeringImage = novaImagemEngenharia.url;
          dados.engineeringImagePath = novaImagemEngenharia.path;
        }
      }

      await setDoc(
        doc(db, CONFIG_COLLECTION, CONFIG_DOCUMENT),
        {
          ...dados,
          criadoEm:
            dadosAnteriores.criadoEm || form.criadoEm || serverTimestamp(),
        },
        { merge: true },
      );

      // Só apaga as imagens antigas depois que o Firestore salva.
      for (const caminho of arquivosAntigos) {
        await removerArquivoAntigo(caminho);
      }

      setForm(criarFormulario(dados));
      setImagemFabrica(null);
      setImagemEngenharia(null);

      setPreviewFabrica((anterior) => {
        if (anterior) URL.revokeObjectURL(anterior);
        return "";
      });

      setPreviewEngenharia((anterior) => {
        if (anterior) URL.revokeObjectURL(anterior);
        return "";
      });

      setSucesso("Conteúdo de Quem Somos salvo com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar Quem Somos:", error);

      setErro(
        "Não foi possível salvar. Verifique as permissões do Firestore e do Storage. Se o erro continuar, confira o console do navegador.",
      );
    } finally {
      setSalvando(false);
    }
  }

  function renderImagem({ titulo, imagemAtual, preview, alt, tipo, arquivo }) {
    const imagemExibida = preview || imagemAtual;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography fontWeight={600} sx={{ mb: 1 }}>
          {titulo}
        </Typography>

        {imagemExibida && (
          <Box
            component="img"
            src={imagemExibida}
            alt={alt || titulo}
            sx={{
              display: "block",
              width: "100%",
              maxWidth: 560,
              maxHeight: 280,
              objectFit: "cover",
              mb: 2,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        )}

        <Button component="label" variant="outlined" startIcon={<ImageIcon />}>
          Substituir imagem
          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => selecionarImagem(e, tipo)}
          />
        </Button>

        {arquivo && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Nova imagem selecionada: {arquivo.name}
          </Typography>
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mt: 1 }}
        >
          Formatos de imagem aceitos pelo navegador. Tamanho máximo: 10 MB.
        </Typography>
      </Box>
    );
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
              Gerencie textos, imagens, seções e ordem de exibição da página
              institucional.
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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography fontWeight={700}>Publicação da página</Typography>
              <Typography variant="body2" color="text.secondary">
                Define se o conteúdo institucional está publicado. A página
                pública precisará respeitar este campo.
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(form.ativo)}
                  onChange={(e) => alterar("ativo", e.target.checked)}
                />
              }
              label={form.ativo ? "Publicada" : "Desativada"}
            />
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            Ordem e visibilidade das seções
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Use as setas para alterar a ordem. Desative uma seção para ocultá-la
            na página pública. O SEO é mantido independentemente destas seções.
          </Typography>

          <Stack spacing={1.5}>
            {form.sectionOrder.map((id, index) => {
              const secao = SECOES.find((item) => item.id === id);

              if (!secao) return null;

              const visivel = form.sectionsVisibility?.[secao.id] !== false;

              return (
                <Paper key={secao.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={1}
                  >
                    <Typography
                      sx={{
                        width: 32,
                        color: "text.secondary",
                        fontWeight: 600,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Typography>

                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight={600}>{secao.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {visivel ? "Visível no site" : "Oculta no site"}
                      </Typography>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Tooltip title="Mover para cima">
                        <span>
                          <IconButton
                            disabled={index === 0}
                            onClick={() => moverSecao(index, -1)}
                            aria-label={`Mover ${secao.label} para cima`}
                          >
                            <ArrowUpward />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Mover para baixo">
                        <span>
                          <IconButton
                            disabled={index === form.sectionOrder.length - 1}
                            onClick={() => moverSecao(index, 1)}
                            aria-label={`Mover ${secao.label} para baixo`}
                          >
                            <ArrowDownward />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <FormControlLabel
                        sx={{ ml: 1, mr: 0 }}
                        control={
                          <Switch
                            checked={visivel}
                            onChange={(e) =>
                              alterarVisibilidade(secao.id, e.target.checked)
                            }
                          />
                        }
                        label={
                          visivel ? (
                            <Visibility fontSize="small" />
                          ) : (
                            <VisibilityOff fontSize="small" />
                          )
                        }
                      />
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
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

                const meiaLargura = [
                  "seoTitle",
                  "ogTitle",
                  "foundingYear",
                  "heroButton",
                  "ctaButton",
                  "ctaLink",
                ].includes(campo);

                return (
                  <Grid item xs={12} md={meiaLargura ? 6 : 12} key={campo}>
                    <TextField
                      fullWidth
                      label={label}
                      value={form[campo] ?? ""}
                      onChange={(e) => alterar(campo, e.target.value)}
                      multiline={multiline}
                      minRows={multiline ? 3 : undefined}
                      helperText={
                        campo === "videoUrl"
                          ? "Cole a URL do vídeo do YouTube. O site público fará a conversão para incorporação."
                          : campo === "ctaLink"
                            ? "Ex.: /contato ou uma URL completa."
                            : undefined
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>

            {grupo.titulo === "Banner principal" &&
              renderImagem({
                titulo: "Imagem da fábrica",
                imagemAtual: form.factoryImage,
                preview: previewFabrica,
                alt: form.factoryImageAlt,
                tipo: "fabrica",
                arquivo: imagemFabrica,
              })}

            {grupo.titulo === "Nossa história" &&
              renderImagem({
                titulo: "Imagem de engenharia",
                imagemAtual: form.engineeringImage,
                preview: previewEngenharia,
                alt: form.engineeringImageAlt,
                tipo: "engenharia",
                arquivo: imagemEngenharia,
              })}
          </Paper>
        ))}

        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Etapas de produção
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Edite os nomes, altere a ordem ou remova etapas.
              </Typography>
            </Box>

            <Button startIcon={<Add />} onClick={adicionarEtapa}>
              Adicionar etapa
            </Button>
          </Stack>

          <Stack spacing={2}>
            {form.stages.map((etapa, index) => (
              <Stack
                key={`etapa-${index}`}
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "stretch", sm: "center" }}
              >
                <Typography
                  sx={{
                    width: 32,
                    color: "text.secondary",
                    flexShrink: 0,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </Typography>

                <TextField
                  fullWidth
                  label={`Etapa ${index + 1}`}
                  value={etapa}
                  onChange={(e) => alterarEtapa(index, e.target.value)}
                />

                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    disabled={index === 0}
                    onClick={() => moverEtapa(index, -1)}
                    title="Mover para cima"
                  >
                    <ArrowUpward />
                  </IconButton>

                  <IconButton
                    disabled={index === form.stages.length - 1}
                    onClick={() => moverEtapa(index, 1)}
                    title="Mover para baixo"
                  >
                    <ArrowDownward />
                  </IconButton>

                  <IconButton
                    color="error"
                    onClick={() => removerEtapa(index)}
                    title="Remover etapa"
                  >
                    <Delete />
                  </IconButton>
                </Stack>
              </Stack>
            ))}

            {form.stages.length === 0 && (
              <Typography color="text.secondary">
                Nenhuma etapa cadastrada. Clique em “Adicionar etapa”.
              </Typography>
            )}
          </Stack>
        </Paper>

        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Missão, visão e valores
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Os títulos são livres: você pode editar, adicionar, remover e
                reorganizar os itens.
              </Typography>
            </Box>

            <Button startIcon={<Add />} onClick={adicionarValor}>
              Adicionar item
            </Button>
          </Stack>

          <Stack spacing={3}>
            {form.values.map((item, index) => (
              <Box key={`valor-${index}`}>
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
                    <Stack
                      direction={{ xs: "row", md: "column" }}
                      spacing={0.5}
                    >
                      <IconButton
                        disabled={index === 0}
                        onClick={() => moverValor(index, -1)}
                        title="Mover para cima"
                      >
                        <ArrowUpward />
                      </IconButton>

                      <IconButton
                        disabled={index === form.values.length - 1}
                        onClick={() => moverValor(index, 1)}
                        title="Mover para baixo"
                      >
                        <ArrowDownward />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => removerValor(index)}
                        title="Remover item"
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            ))}

            {form.values.length === 0 && (
              <Typography color="text.secondary">
                Nenhum item cadastrado. Clique em “Adicionar item”.
              </Typography>
            )}
          </Stack>
        </Paper>

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={
            salvando ? <CircularProgress size={18} color="inherit" /> : <Save />
          }
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
