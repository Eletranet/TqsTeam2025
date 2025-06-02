import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Add as PlusIcon, 
  FilterList as FilterIcon,
  Event as CalendarIcon,
  LocationOn as MapPinIcon,
  Schedule as ClockIcon,
  Bolt as ZapIcon,
  Navigation as NavigationIcon,
  Close as XIcon,
  MoreHoriz as MoreHorizontalIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { getMyReservas } from "../services/MainServices";
import { useNavigate } from 'react-router';
import { useEffect, useState } from "react";

export default function MinhasReservas() {
  const [filter, setFilter] = useState('todas');
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



  const getStatusConfig = (status: string) => {
    const configs = {
      'CONFIRMADA': { color: '#4CAF50', icon: '✓' },
      'PENDENTE': { color: '#FF9800', icon: '⏳' },
      'CONCLUIDA': { color: '#2196F3', icon: '✅' },
      'CANCELADA': { color: '#F44336', icon: '❌' }
    };
    return configs[status] || configs['PENDENTE'];
  };

  const getTypeConfig = (type: string) => {
    const configs = {
      'Rápido': { color: '#2196F3', icon: '⚡' },
      'Super Rápido': { color: '#9C27B0', icon: '⚡⚡' },
      'Normal': { color: '#607D8B', icon: '🔋' }
    };
    return configs[type] || configs['Normal'];
  };

  const filteredReservations = reservaData
    .filter(r => filter === 'todas' || r.statusReserva.toLowerCase() === filter)
    .filter(r => 
      r.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tipoCaregamento.toLowerCase().includes(searchTerm.toLowerCase()) 
   

    );

  return (
    <Container>
<Box sx={{ 
      minHeight: '100vh',
      p: 5
    }}>
      <Container maxWidth="xl">


        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',                    width:"97%"
 }}>
          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
              Minhas Reservas
            </Typography>
            <TextField
              fullWidth
              placeholder="Pesquisar por nome do posto ou velocidade de carrgamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Filters */}
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" gap={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterIcon sx={{ color: '#64748b' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#374151' }}>
                Filtrar por status:
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {['todas', 'confirmada', 'pendente', 'concluida', 'cancelada'].map((status) => (
                <Chip
                  key={status}
                  label={status.charAt(0).toUpperCase() + status.slice(1)}
                  onClick={() => setFilter(status)}
                  variant={filter === status ? "filled" : "outlined"}
                  color={filter === status ? "primary" : "default"}
                  sx={{
                    '&:hover': { transform: 'scale(1.05)' },
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </Stack>
            <Box sx={{ ml: 'auto' }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {filteredReservations.length} reserva{filteredReservations.length !== 1 ? 's' : ''}
                {searchTerm && (
                  <Box component="span" sx={{ ml: 1, color: '#2196F3', fontWeight: 600 }}>
                    (pesquisando: "{searchTerm}")
                  </Box>
                )}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Reservations */}
        <Stack spacing={2}>
          {filteredReservations.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.9)' }}>
              <Typography variant="h1" sx={{ fontSize: '5rem', mb: 3 }}>
                {searchTerm ? '🔍' : '📅'}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: '#64748b', mb: 2 }}>
                Nenhuma reserva encontrada
              </Typography>
              <Typography variant="h6" sx={{ color: '#94a3b8', mb: 3 }}>
                {searchTerm 
                  ? `Não há reservas que correspondam à pesquisa "${searchTerm}".`
                  : 'Não há reservas para o filtro selecionado.'
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
            filteredReservations.map((reservation) => {
              const statusConfig = getStatusConfig(reservation.statusReserva);
              const typeConfig = getTypeConfig(reservation.tipoCaregamento);
              
              return (
                <Card 
                  key={reservation.idReserva} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': { 
                      transform: 'scale(1.01)', 
                      boxShadow: '0 8px 25px #222' ,
                    },
                    transition: 'all 0.3s ease',
                    width:"102%"
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Grid container alignItems="center">
                      {/* Station Info */}
                      <Grid item xs={12} md={4}>
                        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{
                            p: 1.5,
                            bgcolor:statusConfig.color,
                            borderRadius: 2,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <ZapIcon />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 0.5 }}>
                              {reservation.stationName}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <MapPinIcon sx={{ fontSize: 16, color: '#64748b' }} />
                              <Typography variant="body2" sx={{ color: '#64748b' }}>
                                {reservation.stationName}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={1.5}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                            <CalendarIcon sx={{ fontSize: 16, color: '#2196F3' }} />
                            <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase' }}>
                              Data & Hora
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                            {reservation.dataReserva}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {reservation.horaReserva}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={1.5}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                            <ClockIcon sx={{ fontSize: 16, color: '#FF9800' }} />
                            <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase' }}>
                              Duração
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                            {reservation.duracaoReserva}H
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={1.5}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                            Tipo
                          </Typography>
                          <Chip
                            label={`${typeConfig.icon} ${reservation.tipoCaregamento}`}
                            sx={{ 
                              bgcolor: typeConfig.color, 
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={1.5}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                            Status
                          </Typography>
                          <Chip
                            label={`${statusConfig.icon} ${reservation.statusReserva}`}
                            sx={{ 
                              bgcolor: statusConfig.color, 
                              color: 'white',
                              fontSize: '0.75rem'
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={1}>
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                            Preço
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                            €{reservation.valorReserva}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <Box sx={{ display: 'flex', gap: 1, p: 2, justifyContent: 'center' }}>
                          {reservation.statusReserva.toLowerCase()  !== 'concluida' && reservation.statusReserva.toLowerCase()  !== 'cancelada' && (
                            <IconButton 
                              size="small"
                              sx={{ 
                                border: '1px solid #fecaca',
                                color: '#dc2626',
                                '&:hover': { bgcolor: '#fef2f2' }

                              }}
                              onClick={()=>alert("cancelar Reserva")}

                            >
                              <XIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton 
                            size="small"
                            sx={{
                              bgcolor: '#2196F3',
                              color: 'white',
                              '&:hover': { bgcolor: '#1976D2' }
                            }}
                            onClick={()=>alert("ver rotas")}
                          >
                            <NavigationIcon  fontSize="small" />
                          </IconButton>
            
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Stack>
      </Container>
    </Box>
   
    </Container>
 
  );
}