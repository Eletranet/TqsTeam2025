import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Container, Grid, Card, CardContent, CardActions,
  Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Avatar, Badge, Tabs, Tab, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert,
  Divider, Stack, useTheme, alpha, createTheme, ThemeProvider,InputAdornment
} from '@mui/material';
import {
  Dashboard as DashboardIcon, ElectricBolt as ZapIcon, Settings as SettingsIcon,
  CalendarMonth as CalendarIcon, Notifications as BellIcon, Logout as LogoutIcon,
  Edit as EditIcon, CheckCircle as CheckCircleIcon, Warning as AlertTriangleIcon,
  Person as UserIcon, Close as CloseIcon 
} from '@mui/icons-material';
import { 
  Close as XIcon,

  Search as SearchIcon
} from '@mui/icons-material';
// Custom theme for a modern, elegant look
const theme = createTheme({
  palette: {
    primary: { main: '#1E3A8A' }, // Deep blue
    secondary: { main: '#10B981' }, // Emerald green
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
    text: { primary: '#1E293B', secondary: '#64748B' },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    body2: { fontSize: '0.875rem' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

import { getAllReservas,autualizarReserva ,getAllStations,autualizarPosto} from "../services/MainServices";
import { useNavigate } from 'react-router';
import { useEffect } from "react";
const AdminPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [editingStation, setEditingStation] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [stations, setStations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [reservaData, setReservaData] = useState([]);

  const [statusReservaEscolhida, setStatusReservaEscolhida] = useState('');
  const [statusStationEscolhida, setStationStatusEscolhida] = useState('');

  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem("TokenEletraNet")
    if (!token){
      navigate("/loguin");
    }
  },[navigate])

  useEffect(() => {

    const fetchData = async () => {

      try {

        const data = await getAllReservas();

        if (data) {

          setReservaData(data);

        }
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
      }
    };

    fetchData();


  }, []);
 useEffect(() => {
    const fetchStations = async () => {
      try {

        const data = await getAllStations();
        console.log("Dados recebidos:", data);
        
        if (data && Array.isArray(data)) {
          // Mapeia os dados da API para o formato POI esperado
          const formattedStations = data.map((station, index) => {
            // Cria uma key única baseada no nome (sem espaços/caracteres especiais)
            const cleanKey = station.name 
              ? station.name.toLowerCase()
                  .replace(/\s+/g, '')
                  .replace(/[^a-z0-9]/g, '')
              : `station${station.id || index}`;
            
            return {
              key: cleanKey,
              location: { 
                lat: parseFloat(station.latitude), 
                lng: parseFloat(station.longitude) 
              },
              name: station.name,
              id: station.id,
              status: station.status,
              connectorType:station.connectorType,
              pricePerHour:station.pricePerHour

            };
          }).filter(station => 
            // Filtra estações com coordenadas válidas
            !isNaN(station.location.lat) && !isNaN(station.location.lng)
          );
          
          console.log("Estações formatadas:", formattedStations);
          setStations(formattedStations);
          
          if (formattedStations.length === 0) {
            setError("Nenhuma estação com coordenadas válidas encontrada");
          }
        } else {
          setError("Formato de dados inválido recebido da API");
        }
        
      } catch (err) {
        console.error('Erro ao buscar estações:', err);
        setError('Não foi possível carregar os postos neste momento.. Verifique sua conexão.');
      } finally {
      }
    };

    fetchStations();
  }, []);


  const showNotification = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const updateStationPrice = (stationId, newPrice) => {
    setStations(prev => prev.map(station => 
      station.id === stationId ? { ...station, precoHora: newPrice } : station
    ));
    showNotification(`Preço da estação atualizado para €${newPrice}/hora`, 'success');
  };
  function isNumero(str) {
    return !isNaN(str) && str.trim() !== '';
  }

  const updateStationStatus = async (stationId) => {
    var newValue = document.getElementById("precohoraTextField").value

    if(!isNumero(newValue)){
      alert("por favor insira um preco Valido")
      return
    }
    console.log(stationId,statusStationEscolhida , newValue)
    if(statusStationEscolhida == ""){
      alert("Por favor escolhe um estado")
      return
    }

    try {
    const sucesso = await autualizarPosto(statusStationEscolhida,newValue,stationId);
    
    if (sucesso === true) {
        setStations(prev => prev.map(station => 
          station.id === stationId ? { ...station, status: statusStationEscolhida  , pricePerHour:newValue} : station
        ));
        showNotification("Posto atualizado", 'success');


        setEditingStation(null);
    } else {
        showNotification("Nao foi possivel autualizar o Posto", 'error');
    }
  } catch (erro) {
    showNotification(`Erro ao atualizar o Posto #${stationId}: ${erro.message}`, 'error');
  }
  };

  const updateReservationStatus = async (reservationId) => {
  let operation = null;

  if (statusReservaEscolhida === "CANCELADA") {
    operation = "CANCELAR";
  } else if (statusReservaEscolhida === "CONFIRMADA") {
    operation = "CONFIRMAR";
  } else if (statusReservaEscolhida === "CONCLUIDA") {
    operation = "CONCLUIR";
  }

  try {
    const sucesso = await autualizarReserva(reservationId, operation);
    
    if (sucesso === true) {
      setReservaData(prev => 
        prev.map(reservation =>
          reservation.idReserva === reservationId
            ? { ...reservation, statusReserva: statusReservaEscolhida }
            : reservation
        )
      );
      showNotification(`Estado da reserva #${reservationId} alterado para ${statusReservaEscolhida}`, 'success');
      setEditingReservation(null);
    } else {
      showNotification(`Não foi possível alterar o estado da reserva #${reservationId} para ${statusReservaEscolhida}`, 'error');
    }
  } catch (erro) {
    showNotification(`Erro ao atualizar a reserva #${reservationId}: ${erro.message}`, 'error');
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'STATUS_ATIVA': return 'success';
      case 'STATUS_DESLIGADO': return 'error';
      case 'STATUS_RESERVADO': return 'warning';
      case 'CONFIRMADA': return 'info';
      case 'CONCLUIDA': return 'success';
      case 'CANCELADA': return 'error';
      case 'PENDENTE': return 'warning';

      default: return 'default';
    }
  };

  const StationCard = ({ station }) => (
    <Card sx={{ 
      height: '100%', 
      transition: 'all 0.3s ease-in-out',
      '&:hover': { 
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[10],
      }
    }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2, width: 48, height: 48 }}>
            <ZapIcon fontSize="large" />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {station.name}

            </Typography>
            <Typography variant="body2" color="text.secondary">
              {station.localizacao}
            </Typography>
          </Box>
          <Chip 
            label={station.status} 
            color={getStatusColor(station.status)}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: '8px' }}>
              <Typography  color="primary">
                {station.pricePerHour}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                por hora
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: alpha(theme.palette.secondary.main, 0.1), borderRadius: '8px' }}>
              <Typography variant="h6" fontWeight="bold" color="secondary">
                Localizacao
              </Typography>
              <Typography variant="caption" color="text.secondary">
                lat  {station.location.lat}
              </Typography>
                <Typography variant="caption" color="text.secondary" sx={{marginLeft:1}}>
                lg {station.location.lng}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Typography variant="body2" color="text.secondary">
          <strong>connectorType:</strong> {station.connectorType}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => setEditingStation(station.id)}
          sx={{ flexGrow: 1, mr: 1, py: 1 }}
        >
          Editar
        </Button>
      
      </CardActions>
    </Card>
  );

  const MetricCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%', overflow: 'hidden' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const EditStationDialog = () => {
    const station = stations.find(s => s.id === editingStation);
    if (!station) return null;

    return (
      <Dialog 
        open={Boolean(editingStation)} 
        onClose={() => setEditingStation(null)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ p: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Editar  {station.name}
            <IconButton onClick={() => setEditingStation(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Preço por Hora (€)"
              defaultValue={station.pricePerHour}
              fullWidth
              variant="outlined"
              id='precohoraTextField'
              //onChange={(e) => updateStationPrice(station.id, parseFloat(e.target.value))}
            />
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                defaultValue={station.status}

                value={statusStationEscolhida}
                label="Estado"
                onChange={(e) => setStationStatusEscolhida(e.target.value)}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="STATUS_ATIVA">Ativo</MenuItem>
                <MenuItem value="STATUS_DESLIGADO">Inativo</MenuItem>
                <MenuItem value="STATUS_RESERVADO">Reservado</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setEditingStation(null)} 
            variant="outlined" 
            sx={{ borderRadius: '8px', px: 3 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={() =>updateStationStatus(editingStation)} 
            variant="contained" 
            sx={{ borderRadius: '8px', px: 3 }}
          >
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const EditReservationDialog = () => {
    const reservation = reservaData.find(r => r.idReserva === editingReservation);
    if (!reservation) return null;

    return (
      <Dialog 
        open={Boolean(editingReservation)} 
        onClose={() => setEditingReservation(null)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ p: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Editar Reserva #{editingReservation}
            <IconButton onClick={() => setEditingReservation(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Estado da Reserva</InputLabel>
              <Select
                id='newReservaStatusSelect'
                value={statusReservaEscolhida}
                label="Estado da Reserva"
                onChange={(e) => 
                  
                 {
                    setStatusReservaEscolhida(e.target.value);
                 }}
                 
                
                  sx={{ borderRadius: '8px' }}
              >

                
                <MenuItem value="CONFIRMADA">Confirmada</MenuItem>
                <MenuItem value="CANCELADA">Cancelada</MenuItem>
                <MenuItem value="PENDENTE">Pendente</MenuItem>
                <MenuItem value="CONCLUIDA">Concluída</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setEditingReservation(null)} 
            variant="outlined" 
            sx={{ borderRadius: '8px', px: 3 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={() =>{ 
              
              updateReservationStatus(editingReservation)

            
            
            }} 
            variant="contained" 
            sx={{ borderRadius: '8px', px: 3 }}
          >
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

const TabPanel = ({ children, value, index }) => (
  <Box sx={{ py: 4, display: value !== index ? 'none' : 'block' }}>
    {children}
  </Box>
);


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Header */}
        <AppBar 
          position="static" 
          
          elevation={0} 
          sx={{ 
            bgcolor: "white", 
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Toolbar sx={{ py: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
              <ZapIcon fontSize="large" />
            </Avatar>
            <Box sx={{ flexGrow: 1, marginTop:2 }}>
              <Typography variant="h5" fontWeight="bold" sx={{color:"black"}}>
                Painel do Operador
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Eletranet Services
              </Typography>
            </Box>
  
          </Toolbar>
        </AppBar>

        {/* Navigation Tabs */}
        <Paper sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Container maxWidth="xl">
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ minHeight: '64px' }}
            >
              <Tab 
                icon={<DashboardIcon />} 
                label="Dashboard" 
                iconPosition="start"
                sx={{ minHeight: '64px', px: 3 }}
              />
              <Tab 
                icon={<ZapIcon />} 
                label="Estações" 
                iconPosition="start"
                sx={{ minHeight: '64px', px: 3 }}
              />
              <Tab 
                icon={<CalendarIcon />} 
                label="Reservas" 
                iconPosition="start"
                sx={{ minHeight: '64px', px: 3 }}
              />
            </Tabs>
          </Container>
        </Paper>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
          {/* Dashboard Tab */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Total Estações"
                  value={stations.length}
                  icon={<ZapIcon />}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Estações Ativas"
                  value={stations.filter(s => s.status === 'STATUS_ATIVA').length}
                  icon={<CheckCircleIcon />}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Fora de Operacao"
                  value={stations.filter(s => s.status === 'STATUS_DESLIGADO').length}
                  icon={<AlertTriangleIcon />}
                  color="warning"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  title="Total Reservas"
                  value={reservaData.length}
                  icon={<CalendarIcon />}
                  color="info"
                />
              </Grid>
        

              </Grid>
          </TabPanel>

          {/* Stations Tab */}
          <TabPanel value={activeTab} index={1}>

        <Grid container spacing={2}>
              
           

          {stations.length === 0 ? (
              <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.9)',width:"100%" }}>
               
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                  Nenhuma estacao encontrada
                </Typography>
            
              </Paper>
            ) : (
                <>
                   {stations.map(station => (

                      <Grid item xs={12} md={6} lg={4} key={station.id} sx={{width:"30%"}}>
                          <StationCard station={station} />
                      </Grid>



                   ))}
            </>

            )}


            </Grid>
          </TabPanel>

          {/* Reservations Tab */}
          <TabPanel value={activeTab} index={2}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Gestão de Reservas
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2, borderRadius: '12px', boxShadow: theme.shadows[2] }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.grey[100], 0.5) }}>
                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Utilizador</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Data/Hora</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Preço</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservaData.map((reservation) => (
                    <TableRow key={reservation.idReserva} hover sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } }}>
                      <TableCell>#{reservation.idReserva}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'grey.300', width: 40, height: 40 }}>
                            <UserIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {reservation.nomeUsuario}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                             {reservation.nameCliente}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {reservation.dataReserva}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reservation.horaReserva}
                         
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={reservation.statusReserva} 
                          color={getStatusColor(reservation.statusReserva)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          €{reservation.valorReserva.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary"
                          onClick={() => setEditingReservation(reservation.idReserva)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Container>

        {/* Modals */}
        <EditStationDialog />
        <EditReservationDialog />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity={snackbarSeverity}
            variant="filled"
            sx={{ borderRadius: '8px' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AdminPage;