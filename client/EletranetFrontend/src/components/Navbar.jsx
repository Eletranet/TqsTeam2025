import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom'

export const Navbar = () => {

const navigator=useNavigate();
    
return (
  <Box sx={{ flexGrow: 1 }}>
  <AppBar position="static" sx={{bgcolor:"#222" , color:"white"}} >
    <Toolbar variant='dense'>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
      >
      </IconButton>
      <Typography  onClick={()=>{navigator("/mapa")}} variant="h6" component="div" sx={{ flexGrow: 1 }}>
        EletraNet
      </Typography>     

      { window.location.pathname !== "/loguin"  && window.location.pathname !=="/register" ? (
          <>
          
              <Button color="inherit" onClick={()=>{navigator("/minhas_reservas")}}>Minhas Reservas</Button>
              <Button color="inherit" onClick={()=>{navigator("/mapa")}}>Ver Postos</Button>
              <Button color="inherit" onClick={()=>{navigator("/rotas")}}>Rotas Personalizadas</Button>

              <Button color="inherit" onClick={()=>{
                  localStorage.clear();
                  navigator("/loguin")

              }}>sair</Button>
          
          </>
      
      ):(
        <></>
      )

      }

    </Toolbar>
  </AppBar>
</Box>

)
}
