import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { storage } from "../../firebase-config";

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

const EXTENSOES_PERMITIDAS = ["jpg", "jpeg", "png", "webp"];
const TAMANHO_MAXIMO = 5 * 1024 * 1024;

export const UploadFotoCarga = async (arquivo, cargaId) => {
  if (!arquivo || !cargaId) {
    throw new Error("Selecione uma imagem e informe a carga.");
  }

  if (!TIPOS_PERMITIDOS.includes(arquivo.type)) {
    throw new Error("Formato inválido. Use JPG, PNG ou WEBP.");
  }

  if (arquivo.size > TAMANHO_MAXIMO) {
    throw new Error("A imagem deve ter no máximo 5 MB.");
  }

  const extensao = arquivo.name.split(".").pop()?.toLowerCase();

  if (!extensao || !EXTENSOES_PERMITIDAS.includes(extensao)) {
    throw new Error("A extensão do arquivo não é permitida.");
  }

  if (!globalThis.crypto?.randomUUID) {
    throw new Error("Não foi possível gerar um identificador para a imagem.");
  }

  const nomeArquivo = `foto_${crypto.randomUUID()}.${extensao}`;
  const caminho = `cargas/${cargaId}/${nomeArquivo}`;
  const arquivoRef = ref(storage, caminho);

  try {
    await uploadBytes(arquivoRef, arquivo, {
      contentType: arquivo.type,
    });

    const url = await getDownloadURL(arquivoRef);

    return {
      url,
      nome: nomeArquivo,
      caminho,
    };
  } catch (error) {
    console.error("Erro ao enviar foto da carga:", {
      code: error.code,
      message: error.message,
      caminho,
      projeto: storage.app.options.projectId,
      bucket: storage.app.options.storageBucket,
    });

    throw error;
  }
};

export const ExcluirFotoCarga = async (fotoUrlOuCaminho) => {
  if (!fotoUrlOuCaminho) return;

  try {
    const arquivoRef = ref(storage, fotoUrlOuCaminho);
    await deleteObject(arquivoRef);
  } catch (error) {
    console.error("Erro ao excluir foto da carga:", {
      code: error.code,
      message: error.message,
    });

    throw error;
  }
};
