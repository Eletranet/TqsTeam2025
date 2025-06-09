// src/pages/LoginPage.jsx
import React, { useEffect } from "react";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoguinService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/react.svg"; // Usa o import para assets locais

export default function SignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("TokenEletraNet");
    if (token) {
      // Possível redirecionamento se já estiver autenticado
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    LoguinService(data.get("FirstName"), data.get("password"), navigate);
  };

  return (
    
      
        <Container>

      <Box
              sx={{
                my: 8,
                mx: 4,
                p: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
                Iniciar Sessão
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Nome de Utilizador"
                  name="FirstName"
                  autoComplete="username"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Palavra-passe"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  id="loginbtn"
                  style={{
                    backgroundColor:"#222"
                  }}
                  sx={{
                    mt: 3,
                    mb: 2,
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: "12px",
                    boxShadow: "0px 3px 5px rgba(0,0,0,0.2)",
                    "&:hover": {
                      boxShadow: "0px 5px 15px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  Entrar
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2" underline="hover" style={{color:"#222"}}>
                      Esqueceste-te da palavra-passe?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/register" variant="body2" underline="hover" sx={{marginLeft:"20px"}} style={{color:"#222"}}>
                      {" Não tens conta? Regista-te"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>


     </Container>
      
  
  );
}
