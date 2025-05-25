import React, { useEffect,useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Container,
  Typography
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { RegisterService } from "../services/AuthService";

function Register(){

 const [formValues, setFormValues] = useState({
    FirstName: '',
    LastName: '',
    email: '',
    phone: '',
    password: '',
    password2: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = {};

    if (!formValues.FirstName.trim()) {
      errors.FirstName = 'O primeiro nome é obrigatório.';
    }

    if (!formValues.LastName.trim()) {
      errors.LastName = 'O apelido é obrigatório.';
    }

    if (!formValues.email) {
      errors.email = 'O email é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.email = 'Email inválido.';
    }

    if (!formValues.phone) {
      errors.phone = 'O telefone é obrigatório.';
    } else if (!/^\d{9,15}$/.test(formValues.phone)) {
      errors.phone = 'Número de telefone inválido.';
    }

    if (!formValues.password) {
      errors.password = 'A palavra-passe é obrigatória.';
    } else if (formValues.password.length < 6) {
      errors.password = 'A palavra-passe deve ter pelo menos 6 caracteres.';
    }

    if (formValues.password2 !== formValues.password) {
      errors.password2 = 'As palavras-passe não coincidem.';
    }

    return errors;
  };

 const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const payload={
        "firstName":formValues.FirstName,
        "lastName":formValues.LastName,
        "email":formValues.email,
        "phone":formValues.phone,
        "password":formValues.password

      }
      console.log("submeter dados: " ,payload)
      RegisterService(payload,navigate)
      // Aqui podes enviar os dados para a API.
    }
  };




  useEffect(() => {
    const token = localStorage.getItem("TokenEletraNet");
    if (token) {
      // Possível redirecionamento se já estiver autenticado
      navigate("/");
    }
  }, [navigate]);



    return (
        <>
        <Container style={ { marginTop:"2%"}}> 

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
               <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                      <Typography sx={{fontSize:30 , display:"flex",justifyContent:"center",fontFamily:"monospace"}}  >  Criar uma conta na EletraNet</Typography>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="UserName"
                        name="FirstName"
                        autoFocus
                        value={formValues.FirstName}
                        onChange={handleChange}
                        error={!!formErrors.FirstName}
                        helperText={formErrors.FirstName}
                      />

                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="lastname"
                        label="Name"
                        name="LastName"
                        value={formValues.LastName}
                        onChange={handleChange}
                        error={!!formErrors.LastName}
                        helperText={formErrors.LastName}
                      />

                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="Email"
                        id="email"
                        value={formValues.email}
                        onChange={handleChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                      />

                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="phone"
                        label="Telefone"
                        id="phone"
                        value={formValues.phone}
                        onChange={handleChange}
                        error={!!formErrors.phone}
                        helperText={formErrors.phone}
                      />

                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Palavra-passe"
                        type="password"
                        id="password"
                        value={formValues.password}
                        onChange={handleChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                      />

                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password2"
                        label="Repetir palavra-passe"
                        type="password"
                        id="password2"
                        value={formValues.password2}
                        onChange={handleChange}
                        error={!!formErrors.password2}
                        helperText={formErrors.password2}
                      />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      
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
                      style={{
                        backgroundColor:"#222"
                      }}
                    >
                      Criar conta
                    </Button>

                    <Grid container>
                      <Grid item xs>
                        <Link href="/loguin" variant="body2" underline="hover">
                          Já tenho Conta
                        </Link>
                      </Grid>
                    </Grid>
                  </Box>



            </Box>
           
            </Container>
        </>
    );
}

export default Register;