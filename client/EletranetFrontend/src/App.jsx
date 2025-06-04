import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from "./pages/SignIn.jsx";
import Home from './pages/Home.jsx';
import { Navbar } from "./components/Navbar.jsx"
import Register from './pages/Register.jsx';
import Mapa from "./pages/maps.js"
import Footer from "./components/Footer.js"
import { Box, Container } from '@mui/material';
import MinhasReservas from "./pages/MinhasReservas.tsx";

function App() {
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <BrowserRouter>
        <Navbar />
        
        {/* Container para as rotas que vai crescer para ocupar o espaço disponível */}
        <Box component="main" sx={{ flex: 1 }}>
          <Routes>
            <Route path="/loguin" element={<SignIn />} />
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/minhas_reservas" element={<MinhasReservas />} />
          </Routes>
        </Box>
        
        <Footer />
      </BrowserRouter>
    </Box>
  );
}

export default App;