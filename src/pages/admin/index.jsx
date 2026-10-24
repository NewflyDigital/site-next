import * as React from "react";
import Head from "next/head";
import Image from "next/image";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { auth } from "../../../firebase-config";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useRouter } from "next/router";
import { ReadByEmail } from "../../services/usuarios";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LocalStorageCache from "../../services/localstorage.cache";

const Alert2 = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://SITE.com.br/">
        NEXT Implementos
      </Link>
      &nbsp;
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme({
  palette: {
    background: {
      default: "#fff",
    },
    primary: {
      main: "#25AAE2",
      contrastText: "#fff",
    },
    secondary: {
      main: "#3363AC",
      contrastText: "#fff",
    },
  },
});

export default function SignInSide() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState({});
  const [logInError, setLogInError] = React.useState({
    status: false,
    message: "",
  });

  const [open, setOpen] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");

    setError({});
    setLogInError({ status: false, message: "" });

    if (!email || !password) {
      setError({
        email: !email,
        senha: !password,
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Autentica no Firebase Authentication
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // 2. Busca o cadastro correspondente no sistema

      const resultado = await ReadByEmail({
        email: credential.user.email,
      });

      console.log("Resultado ReadByEmail:", resultado);

      if (resultado.status !== 200 || !resultado.data) {
        setLogInError({
          status: true,
          message: resultado.message || "Cadastro não encontrado.",
        });
        return;
      }

      const { data } = resultado;

      // 3. Verifica se o cadastro está ativo
      if (data.ativo !== true) {
        setLogInError({
          status: true,
          message: "Usuário desabilitado.",
        });
        return;
      }

      // 4. Confere se o cadastro pertence ao usuário autenticado
      if (data.fbId && data.fbId !== credential.user.uid) {
        setLogInError({
          status: true,
          message:
            "O cadastro do sistema não corresponde ao usuário autenticado.",
        });
        return;
      }

      // 5. Verifica o tipo de usuário antes de liberar o acesso
      if (!["A", "C"].includes(data.tipoDeUsuario)) {
        setLogInError({
          status: true,
          message: "O tipo de usuário não está configurado corretamente.",
        });
        return;
      }

      localStorage.setItem("isAuth", "true");
      localStorage.setItem("user", JSON.stringify(data));

      const localStorageClient = new LocalStorageCache();
      localStorageClient.removeItem("cargas");
      localStorageClient.removeItem("clientes");

      if (data.tipoDeUsuario === "A") {
        await router.push("/admin/dashboard");
      } else {
        await router.push("/admin/cargas/cliente");
      }
    } catch (error) {
      console.error("Erro durante o login:", error);

      const mensagens = {
        "auth/invalid-email": "E-mail inválido.",
        "auth/user-disabled":
          "Usuário desabilitado no Firebase Authentication.",
        "auth/user-not-found":
          "Usuário não encontrado no Firebase Authentication.",
        "auth/wrong-password": "Senha inválida.",
        "auth/invalid-credential": "E-mail ou senha incorretos.",
        "auth/too-many-requests":
          "Muitas tentativas. Aguarde e tente novamente.",
        "permission-denied":
          "O Firebase negou a consulta. Verifique as regras do Firestore.",
        "auth/network-request-failed":
          "Falha de conexão. Verifique sua internet.",
      };

      setLogInError({
        status: true,
        message:
          mensagens[error.code] ||
          error.message ||
          "Não foi possível realizar o login.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = ({ open = false }) => {
    setOpen(open);
  };

  const handleRedefinirSenha = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get("reset-email");

    if (email.trim() === "") {
      const newError = { ...error };
      newError.emailReset = true;
      setError(newError);
      return;
    }

    sendPasswordResetEmail(auth, email.trim())
      .then(() => setShowAlert(true))
      .catch((erro) => console.log(erro))
      .finally(() => handleOpenDialog({ open: false }));
  };

  React.useEffect(() => {
    window.document.body.style.backgroundColor = "white";
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Sistema NEXT Implementos</title>
        <meta name="description" content="Sistema NEXT Implementos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/" />
      </Head>
      {loading && <LinearProgress />}
      <Container component="main" maxWidth="xs" sx={{ background: "white" }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="w-[20rem] h-auto pb-[2rem]">
            <Image
              src={"/static/images/next-logo.png"}
              alt={"Logo Next"}
              width={198}
              height={57}
              layout="responsive"
            />
          </div>

          <Typography component="h1" variant="h5">
            Entrar no sistema
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-Mail"
              name="email"
              autoComplete="email"
              autoFocus
              onFocus={() => {
                const newError = { ...error };
                newError.email = false;
                setError(newError);
              }}
              error={error.email}
              helperText={error.email ? "campo obrigatório" : ""}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              onFocus={() => {
                const newError = { ...error };
                newError.senha = false;
                setError(newError);
              }}
              error={error.senha}
              helperText={error.senha ? "campo obrigatório" : ""}
            />
            {logInError.status && (
              <Alert severity="error">{logInError.message}</Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            <Grid container>
              <Grid item xs>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpen(true)}
                >
                  Esqueceu a senha?
                </span>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>

      <Dialog
        open={open}
        onClose={() => handleOpenDialog({ open: false })}
        component="form"
        noValidate
        onSubmit={handleRedefinirSenha}
        sx={{ mt: 1 }}
      >
        <DialogTitle>Redefiniçao de senha</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para redefinir sua senha, informe seu endereço de e-mail que nós
            enviaremos um link para a alteração da senha.
          </DialogContentText>

          <TextField
            margin="normal"
            required
            fullWidth
            id="reset-email"
            label="E-Mail"
            name="reset-email"
            autoComplete="reset-email"
            autoFocus
            onFocus={() => {
              const newError = { ...error };
              newError.emailReset = false;
              setError(newError);
            }}
            error={error.emailReset}
            helperText={error.emailReset ? "campo obrigatório" : ""}
          />
        </DialogContent>
        <DialogActions sx={{ marginRight: "1rem", marginBottom: ".5rem" }}>
          <Button
            type="button"
            style={{
              border: ".1rem solid var(--color-primary)",
              padding: ".75rem",
              fontWeight: "500",
            }}
            onClick={() => handleOpenDialog({ open: false })}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            style={{
              border: ".1rem solid var(--color-primary)",
              padding: ".75rem",
              fontWeight: "500",
            }}
          >
            Redefinir senha
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert2
          onClose={() => setShowAlert(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          O e-mail para redefinição de senha foi enviado com sucesso! <br />{" "}
          Verifique a sua caixa de e-mails.
        </Alert2>
      </Snackbar>
    </ThemeProvider>
  );
}
