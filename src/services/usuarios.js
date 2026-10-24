import { db, auth } from "../../firebase-config";

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

const usuariosRef = collection(db, "usuarios");

export const ReadByEmail = async ({ email = "" }) => {
  const emailNormalizado = email.trim().toLowerCase();
  const usuarioAutenticado = auth.currentUser;

  console.log("[LOGIN] Projeto Firestore:", db.app.options.projectId);
  console.log("[LOGIN] Projeto Auth:", auth.app.options.projectId);
  console.log("[LOGIN] Usuário autenticado:", usuarioAutenticado?.uid);
  console.log("[LOGIN] E-mail consultado:", emailNormalizado);

  if (!usuarioAutenticado) {
    return {
      status: 401,
      data: null,
      message: "Usuário não está autenticado no Firebase.",
    };
  }

  try {
    const consulta = query(usuariosRef, where("email", "==", emailNormalizado));

    const snapshot = await getDocs(consulta);

    console.log("[LOGIN] Usuários encontrados:", snapshot.size);

    if (snapshot.empty) {
      return {
        status: 404,
        data: null,
        message: "Cadastro não encontrado na coleção usuarios.",
      };
    }

    const documento = snapshot.docs[0];
    const dados = documento.data();

    return {
      status: 200,
      data: {
        ...dados,
        id: documento.id,
      },
    };
  } catch (error) {
    console.error("[LOGIN] Falha ao consultar Firestore:", {
      code: error.code,
      message: error.message,
      projeto: db.app.options.projectId,
      uid: usuarioAutenticado.uid,
    });

    return {
      status: 500,
      data: null,
      code: error.code,
      message: error.message || "Erro ao consultar o cadastro no Firestore.",
    };
  }
};

export const Create = ({
  nome = "",
  email = "",
  senha = "",
  ativo = false,
  tipoDeUsuario = "",
  clienteId = null,
}) =>
  new Promise((resolve) => {
    try {
      createUserWithEmailAndPassword(auth, email, senha)
        .then(async (userCredential) => {
          const usuario = {
            fbId: userCredential.user.uid,
            email,
            nome,
            ativo,
            tipoDeUsuario,
            clienteId,
          };
          const newDoc = await addDoc(usuariosRef, { ...usuario });

          resolve({ status: 200, data: { id: newDoc.id, ...usuario } });
        })
        .catch(() => resolve({ status: 400, data: null }));
    } catch (error) {
      resolve({ status: 400, data: null });
    }
  });

export const Update = ({
  id = "",
  fbId = "",
  nome = "",
  ativo = false,
  tipoDeUsuario = "",
  clienteId = null,
}) =>
  new Promise(async (resolve) => {
    try {
      const segmentoDoc = doc(db, "usuarios", id);
      const newFields = {
        fbId,
        nome,
        ativo,
        tipoDeUsuario,
        clienteId,
      };

      await updateDoc(segmentoDoc, newFields);

      resolve({ status: 200, data: newFields });
    } catch (error) {
      resolve({ status: 400, data: null });
    }
  });

export const Delete = ({ id = "", fbId = "" }) =>
  new Promise(async (resolve) => {
    const segmentoDoc = doc(db, "usuarios", id);

    await deleteDoc(segmentoDoc);

    resolve({ status: 200, data: {} });
  });

export const GetAddressFromCep = ({ cep = "" }) =>
  new Promise((resolve) => {
    axios
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((retorno) => resolve(retorno))
      .catch(() => resolve({ status: 400, data: {} }));
  });

const makeRandomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
