import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getMyReservas } from "../services/MainServices";
import { useNavigate } from 'react-router';

const MinhasReservas = () => {
  const [reservaData, setReservaData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("TokenEletraNet");
    if (!token) {
      navigate("/loguin");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyReservas();
        if (data) {
          setReservaData(data);
        }
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Historico das suas Reservas
      </Typography>

      <Container>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de reservas">
            <TableHead>
              <TableRow>
                <TableCell><strong>ID Reserva</strong></TableCell>
               {/* <TableCell><strong>Nome Cliente</strong></TableCell>*/ }
                <TableCell><strong>Data</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Posto</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservaData.map((reserva) => (
                <TableRow key={reserva.idReserva}>
                  <TableCell>{reserva.idReserva}</TableCell>
                  {/*<TableCell>{reserva.nameCliente}</TableCell>*/}
                  <TableCell>{reserva.dataReserva}</TableCell>
                  <TableCell>{reserva.statusReserva}</TableCell>
                  <TableCell>{reserva.stationName}</TableCell>
                </TableRow>
              ))}
              {reservaData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">Nenhuma reserva encontrada.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default MinhasReservas;
