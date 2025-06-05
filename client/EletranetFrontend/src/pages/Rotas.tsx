import React, { useEffect, useState, useCallback } from "react";
import {
  Avatar,
  Button,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { 
  APIProvider, 
  Map,
  AdvancedMarker,
  Pin,
  MapCameraChangedEvent,

  useMap
} from '@vis.gl/react-google-maps';
import CustomModal from "../components/CustomModal";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RouteIcon from '@mui/icons-material/Route';
import SpeedIcon from '@mui/icons-material/Speed';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getAllStations } from "../services/MainServices";

// Componente para renderizar direções usando Google Maps API diretamente
function DirectionsRenderer({ origin, destination, options }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !origin || !destination) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer(options);

    directionsRenderer.setMap(map);

    directionsService
      .route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false
      })
      .then((result) => {
        directionsRenderer.setDirections(result);
      })
      .catch((error) => {
        console.error('Erro ao calcular rota no mapa:', error);
      });

    return () => {
      directionsRenderer.setMap(null);
    };
  }, [map, origin, destination, options]);

  return null;
}

// Serviço para interagir com a Google Routes API
const RoutesService = {
  async calculateRoute(origin, destination, apiKey) {
    const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
    
    const requestBody = {
      origin: {
        location: {
          latLng: {
            latitude: origin.lat,
            longitude: origin.lng
          }
        }
      },
      destination: {
        location: {
          latLng: {
            latitude: destination.lat,
            longitude: destination.lng
          }
        }
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      computeAlternativeRoutes: false,
      routeModifiers: {
        avoidTolls: false,
        avoidHighways: false,
        avoidFerries: false
      },
      languageCode: "pt-PT",
      units: "METRIC"
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs.steps.navigationInstruction'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    return data;
  },

  // Função para obter localização atual do usuário
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não é suportada pelo browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Erro ao obter localização: ' + error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000 // 10 minutos
        }
      );
    });
  },

  // Função para encontrar estação mais próxima
  findNearestStation(userLocation, stations) {
    if (!stations || stations.length === 0) return null;

    let nearestStation = null;
    let minDistance = Infinity;

    stations.forEach(station => {
      const distance = this.calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        station.location.lat, 
        station.location.lng
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = { ...station, distance };
      }
    });

    return nearestStation;
  },

  // Calcular distância em linha reta (Haversine)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  toRad(value) {
    return value * Math.PI / 180;
  },

  // Formatar duração
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  },

  // Formatar distância
  formatDistance(meters) {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }
};

type Station = {
  key: string;
  location: { lat: number; lng: number };
  name?: string;
  id?: number;
  status?: string;
  connectorType?: string;
  pricePerHour?: string;
  distance?: number;
};

function Rotas() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [nearestStation, setNearestStation] = useState<Station | null>(null);
  const [route, setRoute] = useState<any>(null);
  const [routeInfo, setRouteInfo] = useState<{
    duration: string;
    distance: string;
    steps?: any[];
  } | null>(null);
  const [shouldShowDirections, setShouldShowDirections] = useState(false);

  const navigate = useNavigate();
  const apiKey = 'AIzaSyDqX72bHbKlVnFwaOiW_0Bmx09_1ep-8W4';

  const abrirModal = () => setOpen(true);
  const fecharModal = () => setOpen(false);

  // Carregar estações
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getAllStations();
        if (data && Array.isArray(data)) {
          const formattedStations = data.map((station, index) => ({
            key: station.name?.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') || `station${index}`,
            location: { 
              lat: parseFloat(station.latitude), 
              lng: parseFloat(station.longitude) 
            },
            name: station.name,
            id: station.id,
            status: station.status,
            connectorType: station.connectorType,
            pricePerHour: station.pricePerHour
          })).filter(station => {
            return (
              !isNaN(station.location.lat) &&
              !isNaN(station.location.lng) &&
              station.status === "STATUS_ATIVA"
            );
          });
          
          setStations(formattedStations);
        }
      } catch (err) {
        console.error('Erro ao carregar estações:', err);
        setError('Erro ao carregar estações de carregamento');
      }
    };

    fetchStations();
  }, []);

  // Função para obter localização e calcular rota
  const calculateRouteToNearestStation = async () => {
    setLoading(true);
    setError(null);
    setShouldShowDirections(false);

    try {
      // 1. Obter localização atual
      const location = await RoutesService.getCurrentLocation();
      setUserLocation(location);

      // 2. Encontrar estação mais próxima
      const nearest = RoutesService.findNearestStation(location, stations);
      if (!nearest) {
        throw new Error('Nenhuma estação encontrada');
      }
      setNearestStation(nearest);

      // 3. Calcular rota usando Google Routes API
      const routeData = await RoutesService.calculateRoute(location, nearest.location, apiKey);
      
      if (routeData.routes && routeData.routes.length > 0) {
        const routeResult = routeData.routes[0];
        setRoute(routeResult);

        // Extrair informações da rota
        const duration = routeResult.duration ? routeResult.duration.replace('s', '') : '0';
        const distance = routeResult.distanceMeters || 0;
        
        setRouteInfo({
          duration: RoutesService.formatDuration(parseInt(duration)),
          distance: RoutesService.formatDistance(distance),
          steps: routeResult.legs?.[0]?.steps || []
        });

        // Ativar a exibição das direções no mapa
        setShouldShowDirections(true);
      }

    } catch (err) {
      console.error('Erro ao calcular rota:', err);
      setError(err instanceof Error ? err.message : 'Erro ao calcular rota');
    } finally {
      setLoading(false);
    }
  };

  // Verificar autenticação (comentado conforme solicitado)
  
  useEffect(() => {
    const token = localStorage.getItem("TokenEletraNet");
    if (!token) {
      navigate("/loguin");
    }
  }, [navigate]);
  

  return (

    <>

<Box sx={{ minHeight: '100vh', p: 2 }}>
        
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            🗺️ Navegação para Estações
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Encontre a rota para a estação de carregamento mais próxima
          </Typography>
        </Box>

        {/* Botão para calcular rota */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={calculateRouteToNearestStation}
            disabled={loading || stations.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : <MyLocationIcon />}
            sx={{ mr: 2 }}
          >
            {loading ? 'Calculando Rota...' : 'Calcular Rota para Estação Mais Próxima'}
          </Button>
          
          {route && (
            <Button
              variant="outlined"
              onClick={calculateRouteToNearestStation}
              startIcon={<RefreshIcon />}
            >
              Recalcular
            </Button>
          )}
        </Box>

        {/* Mensagens de erro */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        

        <Box sx={{display:"flex"}}>
  
          {/* Informações da Rota - Coluna Esquerda */}
          <Box sx={{ p: 2,  overflowY: 'auto' }} >
            
            {/* Informações da Estação Mais Próxima */}
            {nearestStation && (
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🔌 Estação de Destino
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {nearestStation.name}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={nearestStation.status} 
                        color={nearestStation.status === 'STATUS_ATIVA' ? 'success' : 'warning'}
                        size="small"
                      />
                      <Chip 
                        label={nearestStation.connectorType} 
                        variant="outlined"
                        size="small"
                      />
                      {nearestStation.pricePerHour && (
                        <Chip 
                          label={`€${nearestStation.pricePerHour}/h`}
                          color="primary"
                          size="small"
                        />
                      )}
                    </Box>
                  </Box>
                  {nearestStation.distance && (
                    <Typography variant="body2" color="textSecondary">
                      📍 Distância em linha reta: {nearestStation.distance.toFixed(1)}km
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Informações da Rota */}
            {routeInfo && (
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🚗 Informações da Rota
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <RouteIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Distância"
                        secondary={routeInfo.distance}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTimeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Tempo estimado"
                        secondary={routeInfo.duration}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DirectionsCarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Meio de transporte"
                        secondary="Automóvel"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            )}

            {/* Instruções de Navegação */}
            {routeInfo?.steps && routeInfo.steps.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📋 Instruções de Navegação
                  </Typography>
                  <List dense>
                    {routeInfo.steps.map((step, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemIcon>
                            <Typography variant="caption" color="primary" fontWeight="bold">
                              {index + 1}
                            </Typography>
                          </ListItemIcon>
                          <ListItemText 
                            primary={step.navigationInstruction?.instructions || `Passo ${index + 1}`}
                            secondary={step.distanceMeters ? `${RoutesService.formatDistance(step.distanceMeters)}` : ''}
                          />
                        </ListItem>
                      </React.Fragment>
                    ))}
                   
                  </List>
                </CardContent>
              </Card>
            )}
          </Box>
          {/* Mapa - Coluna Direita */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto'}}>
            <Paper sx={{ height: '100%', position: 'relative', width: '100%', backgroundColor: '#f0f0f0', overflowY: 'auto' }}>
              <APIProvider apiKey={apiKey}>
                <Map
                 style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                      }}                
                  defaultZoom={12}
                  onCameraChanged={(ev: MapCameraChangedEvent) =>
                                console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                              }
                  mapId="da37f3254c6a6d1c"
                >
                  {/* Marcador da localização atual */}
                  {userLocation && (
                    <AdvancedMarker
                      position={userLocation}
                    >
                      <Pin background="black" borderColor="#ffffff" glyphColor="#ffffff">
                        <MyLocationIcon />
                      </Pin>
                    </AdvancedMarker>
                  )}
                  
                  {/* Marcador da estação de destino */}
                  {nearestStation && (
                    <AdvancedMarker
                      position={nearestStation.location}
                    >
                      <Pin background="#34a853" borderColor="#ffffff" glyphColor="#ffffff">
                        <LocationOnIcon />
                      </Pin>
                    </AdvancedMarker>
                  )}
                  
                  {/* Renderizar a rota */}
                  {shouldShowDirections && userLocation && nearestStation && (
                    <DirectionsRenderer
                      origin={userLocation}
                      destination={nearestStation.location}
                      options={{
                        suppressMarkers: true, // Não mostrar marcadores padrão
                        polylineOptions: {
                          strokeColor: '#4285f4',
                          strokeWeight: 5,
                          strokeOpacity: 0.8,
                        }
                      }}
                    />
                  )}
                </Map>
              </APIProvider>
              
              {/* Overlay quando está carregando */}
              {loading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 2,
                    zIndex: 1000
                  }}
                >
                  <CircularProgress size={60} />
                  <Typography variant="h6">Calculando melhor rota...</Typography>
                </Box>
              )}
            </Paper>
          </Box>


        </Box>
        
        {/* Estado inicial - sem rota calculada */}
        {!route && !loading && stations.length > 0 && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              📍 Clique em "Calcular Rota" para encontrar o caminho para a estação mais próxima
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Vamos usar sua localização atual para encontrar a melhor rota
            </Typography>
          </Box>
        )}

        {/* Loading de estações */}
        {stations.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Carregando estações de carregamento...
            </Typography>
          </Box>
        )}

      </Box>

      {/* Modal personalizado */}
      <CustomModal 
        open={open} 
        onClose={fecharModal}
        title="Informações da Rota"
      >
        {nearestStation && routeInfo && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Rota para: {nearestStation.name}
            </Typography>
            <Typography>Distância: {routeInfo.distance}</Typography>
            <Typography>Tempo: {routeInfo.duration}</Typography>
          </Box>
        )}
      </CustomModal>
      
  </>


  );
}

export default Rotas;