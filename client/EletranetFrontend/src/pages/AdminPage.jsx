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

import { getMyReservas,autualizarReserva ,getAllStations} from "../services/MainServices";
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

  const updateStationStatus = (stationId, newStatus) => {
    setStations(prev => prev.map(station => 
      station.id === stationId ? { ...station, estado: newStatus } : station
    ));
    showNotification(`Estado da estação alterado para ${newStatus}`, 'success');
  };

  const updateReservationStatus = (reservationId, newStatus) => {
    setReservations(prev => prev.map(reservation => 
      reservation.idReserva === reservationId ? { ...reservation, statusReserva: newStatus } : reservation
    ));
    showNotification(`Estado da reserva #${reservationId} alterado para ${newStatus}`, 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'STATUS_ATIVA': return 'success';
      case 'STATUS_DESLIGADO': return 'error';
      case 'STATUS_RESERVADO': return 'warning';
      case 'CONFIRMADA': return 'info';
      case 'CANCELADA': return 'default';
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
        <IconButton color="primary">
          <SettingsIcon />
        </IconButton>
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
            Editar Estação
            <IconButton onClick={() => setEditingStation(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Preço por Hora (€)"
              type="number"
              inputProps={{ step: '0.01', min: '0' }}
              defaultValue={station.precoHora}
              fullWidth
              variant="outlined"
              onChange={(e) => updateStationPrice(station.id, parseFloat(e.target.value))}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={station.estado}
                label="Estado"
                onChange={(e) => updateStationStatus(station.id, e.target.value)}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="ATIVO">Ativo</MenuItem>
                <MenuItem value="INATIVO">Inativo</MenuItem>
                <MenuItem value="MANUTENCAO">Manutenção</MenuItem>
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
            onClick={() => setEditingStation(null)} 
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
                value={reservation.statusReserva}
                label="Estado da Reserva"
                onChange={(e) => updateReservationStatus(editingReservation, e.target.value)}
                sx={{ borderRadius: '8px' }}
              >
                <MenuItem value="CONFIRMADA">Confirmada</MenuItem>
                <MenuItem value="CANCELADA">Cancelada</MenuItem>
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
            onClick={() => setEditingReservation(null)} 
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
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
    </div>
  );
const filteredStations = stations
    .filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.connectorType.toLowerCase().includes(searchTerm.toLowerCase()) 
   

    );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Header */}
        <AppBar 
          position="static" 
          elevation={0} 
          sx={{ 
            bgcolor: 'background.paper', 
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Toolbar sx={{ py: 1.5 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
              <ZapIcon fontSize="large" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight="bold">
                EV Charge Manager
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Painel do Operador
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton color="inherit">
                <Badge badgeContent={notifications.length} color="error">
                  <BellIcon />
                </Badge>
              </IconButton>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight="medium">
                    Pedro Gonçalves
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Operador
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                  PG
                </Avatar>
                <IconButton color="inherit">
                  <LogoutIcon />
                </IconButton>
              </Box>
            </Stack>
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
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Gestão de Estações
            </Typography>
                   {/* Search Bar */}
                      <Box sx={{ mb: 3 }}>
                      
                        <TextField
                          fullWidth
                          placeholder="Pesquisar por nome do posto ou velocidade de carrgamento..."
                          value={searchTerm}
                          onChange={
                                (e)=>{

                                
                                setSearchTerm(e.target.value)

                            }
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#64748b' }} />
                              </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setSearchTerm('')}
                                  sx={{ color: '#64748b' }}
                                >
                                  <XIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                            sx: {
                              bgcolor: 'rgba(255,255,255,0.9)',
                              backdropFilter: 'blur(10px)',
                              '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': {
                                  borderColor: '#2196F3',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#2196F3',
                                },
                              }
                            }
                          }}
                        />
                      </Box>
            <Grid container spacing={2}>
              
           

    {filteredStations.length === 0 ? (
              <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.9)',width:"100%" }}>
                <Typography variant="h1" sx={{ fontSize: '5rem', mb: 3 }}>
                  {searchTerm ? '🔍' : '📅'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                  Nenhuma estacao encontrada
                </Typography>
                <Typography variant="h6" sx={{ color: '#94a3b8', mb: 3 }}>
                {searchTerm 
                  ? `Não há postos que correspondam à pesquisa "${searchTerm}".`
                  : 'Não há postos para tipo de caregamento que  pesquisas.'
                }
                </Typography>
                {searchTerm && (
                  <Button
                    variant="contained"
                    onClick={() => setSearchTerm('')}
                    sx={{ mt: 2 }}
                  >
                    Limpar pesquisa
                  </Button>
                )}
              </Paper>
            ) : (
                <>
                   {filteredStations.map(station => (



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
                              ID: {reservation.idUsuario}
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