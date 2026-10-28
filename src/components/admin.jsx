import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import LinearProgress from "@mui/material/LinearProgress";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ImageIcon from "@mui/icons-material/Image";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import StarIcon from "@mui/icons-material/Star";
import BusinessIcon from "@mui/icons-material/Business";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { useRouter } from "next/router";
import Link from "next/link";

const drawerWidth = 260;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    overflowX: "hidden",
    ...(!open && {
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme({
  palette: {
    primary: {
      main: "#d90820",
      contrastText: "#fff",
    },
    secondary: {
      main: "#d90820",
      contrastText: "#fff",
    },
    background: {
      default: "#f5f6f8",
    },
  },
});

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: DashboardIcon,
  },
  {
    label: "Banners",
    href: "/admin/banners",
    icon: ImageIcon,
  },
  {
    label: "Produtos",
    href: "/admin/produtos",
    icon: Inventory2Icon,
  },
  {
    label: "Produtos em destaque",
    href: "/admin/destaques",
    icon: StarIcon,
  },
  {
    label: "Linhas",
    href: "/admin/linhas",
    icon: StarIcon,
  },
  {
    label: "Linhas Home",
    href: "/admin/home-linhas",
    icon: StarIcon,
  },
  {
    label: "Representantes",
    href: "/admin/representantes",
    icon: StarIcon,
  },
  {
    label: "Pop Up",
    href: "/admin/popup",
    icon: StarIcon,
  },
  {
    label: "Quem Somos",
    href: "/admin/quem-somos",
    icon: BusinessIcon,
  },
  {
    label: "Vídeos",
    href: "/admin/videos",
    icon: VideoLibraryIcon,
  },
];

export default function Admin({ children, showLoader = false }) {
  const [open, setOpen] = React.useState(true);
  const [usuario, setUsuario] = React.useState(null);
  const [loader, setLoader] = React.useState(showLoader);
  const [autorizado, setAutorizado] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    if (!router.isReady) return;

    try {
      const isAuth = localStorage.getItem("isAuth");
      const usuarioSalvo = JSON.parse(localStorage.getItem("user") || "null");

      if (!isAuth || !usuarioSalvo) {
        router.replace("/admin");
        return;
      }

      if (usuarioSalvo.tipoDeUsuario !== "A") {
        router.replace("/admin");
        return;
      }

      setUsuario(usuarioSalvo);
      setAutorizado(true);
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      router.replace("/admin");
    }
  }, [router.isReady, router]);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setOpen(false);
    }
  }, []);

  React.useEffect(() => {
    setLoader(showLoader);
  }, [showLoader]);

  const sair = () => {
    localStorage.removeItem("isAuth");
    localStorage.removeItem("user");
    window.location.href = "/admin";
  };

  const paginaAtual = (href) => router.pathname === href;

  if (!autorizado || !usuario) {
    return (
      <ThemeProvider theme={mdTheme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
          }}
        >
          <Box sx={{ width: 220 }}>
            <LinearProgress />
            <Typography
              sx={{ mt: 2, textAlign: "center" }}
              color="text.secondary"
            >
              Verificando acesso...
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <CssBaseline />

      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <AppBar position="fixed" open={open}>
          <Toolbar sx={{ pr: 3 }}>
            <IconButton
              edge="start"
              aria-label="Abrir menu"
              onClick={() => setOpen(true)}
              sx={{
                color: "white",
                mr: 2,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, fontSize: { xs: 14, sm: 18 } }}
            >
              NEXT Implementos | CMS
            </Typography>

            <Typography sx={{ mr: 1, display: { xs: "none", sm: "block" } }}>
              {usuario.nome || usuario.email || "Administrador"}
            </Typography>

            <Tooltip title="Sair">
              <IconButton color="inherit" onClick={sair}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "space-between" : "center",
              px: 1,
              minHeight: "64px",
            }}
          >
            {open && (
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: 0,
                }}
              >
                <Box
                  component="img"
                  src="/static/images/next-logo.png"
                  alt="NEXT Implementos"
                  sx={{
                    display: "block",
                    maxWidth: "90%",
                    maxHeight: 48,
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}

            <IconButton
              aria-label={open ? "Recolher menu" : "Expandir menu"}
              onClick={() => setOpen(!open)}
              size="small"
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Toolbar>

          <Divider />

          <List sx={{ px: 1, py: 1 }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const ativo = paginaAtual(item.href);

              return (
                <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    selected={ativo}
                    sx={{
                      minHeight: 46,
                      borderRadius: 1,
                      px: open ? 1.5 : 1,
                      justifyContent: open ? "initial" : "center",
                      "&.Mui-selected": {
                        bgcolor: "rgba(217, 8, 32, 0.14)",
                        color: "#d90820",
                      },
                      "&.Mui-selected:hover": {
                        bgcolor: "rgba(217, 8, 32, 0.22)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1.5 : "auto",
                        justifyContent: "center",
                        color: ativo ? "primary.main" : "text.secondary",
                      }}
                    >
                      <Icon />
                    </ListItemIcon>

                    {open && (
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: 14,
                          fontWeight: ativo ? 600 : 400,
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <Divider />

          {open && (
            <Box sx={{ p: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center" }}
              >
                NEXT Implementos
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", textAlign: "center" }}
              >
                Gerenciador do site
              </Typography>
            </Box>
          )}
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            height: "100vh",
            overflow: "auto",
            bgcolor: "background.default",
          }}
        >
          <Toolbar />

          {loader && <LinearProgress />}

          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
