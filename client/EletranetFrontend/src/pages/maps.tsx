// Componente Mapa corrigido
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import Divider from '@mui/material/Divider';
import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin
} from '@vis.gl/react-google-maps';

import {MarkerClusterer} from '@googlemaps/markerclusterer';
import type {Marker} from '@googlemaps/markerclusturer';
import { Grid, Typography, CircularProgress } from '@mui/material';
import {Circle} from '../components/circle'
import { Box, Container } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from "react-router-dom";
import CustomModal from "../components/CustomModal"

import {getAllStations,fazerReserva} from "../services/MainServices"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ReservaCalendario = ({ selectedStation }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('');
  const [isReserved, setIsReserved] = useState(false);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const [displayMonth, setDisplayMonth] = useState(currentMonth);
  const [displayYear, setDisplayYear] = useState(currentYear);

  const isDateValid = (date) => {
    const checkDate = new Date(displayYear, displayMonth, date);
    return checkDate >= new Date(currentYear, currentMonth, currentDay);
  };

  const getDaysInMonth = () => {
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (displayMonth === 0) {
        setDisplayMonth(11);
        setDisplayYear(displayYear - 1);
      } else {
        setDisplayMonth(displayMonth - 1);
      }
    } else {
      if (displayMonth === 11) {
        setDisplayMonth(0);
        setDisplayYear(displayYear + 1);
      } else {
        setDisplayMonth(displayMonth + 1);
      }
    }
  };

  const selectDate = (day) => {
    if (!isDateValid(day)) return;
    const selected = new Date(displayYear, displayMonth, day);
    setSelectedDate(selected);
  };

  const confirmarReserva = async () => {
    if (selectedDate && selectedHour) {
      const reservaData = {
        data: selectedDate.toLocaleDateString('pt-PT'),
        hora: selectedHour,
        timestamp: selectedDate.getTime()
      };

    const reserva = await fazerReserva(selectedStation.id,reservaData.data)


    if(reserva){

      console.log('Reserva confirmada:', reservaData);
      localStorage.setItem('reservaEstacao', JSON.stringify(reservaData));
      setIsReserved(true);
      
      setTimeout(() => {
        setIsReserved(false);
        setIsCalendarOpen(false);
        setSelectedDate(null);
        setSelectedHour('');
      }, 3000);

    }else{
      alert("Reserva nao efetuada")
      
    }
      

    }
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const horariosDisponiveis = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  return (
    <div style={{ position: 'relative' }}>


      {
        selectedStation.status!="STATUS_DESLIGADO" && selectedStation.status!="STATUS_OCUPADO"?  <button
        onClick={() => setIsCalendarOpen(true)}
        style={{
          padding: '10px 20px',
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        📅 Reservar
      </button> :<></>
      }


      {isCalendarOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '90%',
            overflow: 'hidden'
          }}>
            
            <div style={{
              backgroundColor: '#222',
              color: 'white',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                📅 Selecionar Data de Reserva
              </h3>
              <button
                onClick={() => setIsCalendarOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '4px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              {!isReserved ? (
                <>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <button
                      onClick={() => navigateMonth('prev')}
                      style={{
                        padding: '8px',
                        background: 'none',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                      disabled={displayYear === currentYear && displayMonth === currentMonth}
                    >
                      ←
                    </button>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                      {monthNames[displayMonth]} {displayYear}
                    </h4>
                    <button
                      onClick={() => navigateMonth('next')}
                      style={{
                        padding: '8px',
                        background: 'none',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      →
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                    marginBottom: '8px'
                  }}>
                    {dayNames.map(day => (
                      <div key={day} style={{
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#666',
                        padding: '8px 0'
                      }}>
                        {day}
                      </div>
                    ))}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                    marginBottom: '24px'
                  }}>
                    {getDaysInMonth().map((day, index) => (
                      <div key={index} style={{ aspectRatio: '1' }}>
                        {day && (
                          <button
                            onClick={() => selectDate(day)}
                            disabled={!isDateValid(day)}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '500',
                              border: 'none',
                              cursor: isDateValid(day) ? 'pointer' : 'not-allowed',
                              backgroundColor: !isDateValid(day)
                                ? '#f3f4f6'
                                : selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === displayMonth
                                ? 'green'
                                : 'transparent',
                              color: !isDateValid(day)
                                ? '#d1d5db'
                                : selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === displayMonth
                                ? 'white'
                                : '#374151'
                            }}
                            onMouseOver={(e) => {
                              if (isDateValid(day) && !(selectedDate && selectedDate.getDate() === day)) {
                                e.target.style.backgroundColor = '#f0f9ff';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (isDateValid(day) && !(selectedDate && selectedDate.getDate() === day)) {
                                e.target.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            {day}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {selectedDate && (
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        🕒 Selecionar Horário:
                      </label>
                      <select
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Escolha um horário</option>
                        {horariosDisponiveis.map(hora => (
                          <option key={hora} value={hora}>{hora}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedDate && (
                    <div style={{
                      backgroundColor: '#f0f9ff',
                      padding: '16px',
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
                        <strong>Data selecionada:</strong> {selectedDate.toLocaleDateString('pt-PT', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      {selectedHour && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#1e40af' }}>
                          <strong>Horário:</strong> {selectedHour}
                        </p>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => setIsCalendarOpen(false)}
                      style={{
                        flex: 1,
                        padding: '8px 16px',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        color: '#374151',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={confirmarReserva}
                      disabled={!selectedDate || !selectedHour}
                      style={{
                        flex: 1,
                        padding: '8px 16px',
                        backgroundColor: selectedDate && selectedHour ? 'green' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: selectedDate && selectedHour ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Confirmar Reserva
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>
                    Reserva Confirmada!
                  </h3>
                  <p style={{ color: '#6b7280', margin: 0 }}>
                    Sua reserva foi salva com sucesso.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

type Poi = { 
  key: string, 
  location: google.maps.LatLngLiteral, 
  name?: string,
  id?: number,
  status?: string
  connectorType?: string
  pricePerHour?:string

}

const Mapa = () => {
  const [open, setOpen] = React.useState(false);
  const [selectedStation, setSelectedStation] = useState<Poi | null>(null);

  const abrirModal = () => setOpen(true);
  const fecharModal = () => setOpen(false);

  const [stations, setStations] = useState<Poi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [StationStatusFormValue, setStationStatusFormValue] = React.useState('');
  const [selectedConnectorTypes, setSelectedConnectorTypes] = useState(() => ({
    todos: true,
    CCS: false,
    TIPO2: false,
    CHADEMO: false,
    TIPO1: false
  }));
  const navigate=useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("TokenEletraNet");
    if (!token) {
      navigate("/loguin");
    }
  }, [navigate]);

  // Função para abrir modal quando clicar no marcador
  const handleMarkerClick = useCallback((poi: Poi) => {
    setSelectedStation(poi);
    setOpen(true);
  }, []);

  const handleConnectorTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    
    setSelectedConnectorTypes(prev => {
      const newState = { ...prev, [name]: checked };
      
      // Se "Todos" foi marcado, desmarcar todos os outros
      if (name === 'todos' && checked) {
        return {
          todos: true,
          CCS: false,
          TIPO2: false,
          CHADEMO: false,
          TIPO1: false
        };
      }
      
      // Se algum tipo específico foi marcado, desmarcar "Todos"
      if (name !== 'todos' && checked) {
        newState.todos = false;
      }
      
      // Se todos os tipos específicos foram desmarcados, marcar "Todos"
      if (name !== 'todos' && !checked) {
        const hasAnySpecificSelected = Object.entries(newState)
          .filter(([key]) => key !== 'todos')
          .some(([_, value]) => value);
        
        if (!hasAnySpecificSelected) {
          newState.todos = true;
        }
      }
      
      return newState;
    });
  };

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setStationStatusFormValue(newValue);
    console.log("status -> " , newValue);
  };

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        setError(null);
        
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
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const filteredStations = stations.filter(station => {
    // Filtro por status
    const statusMatch = StationStatusFormValue ? station.status === StationStatusFormValue : true;
    
    // Filtro por tipo de conector
    let connectorMatch = true;
    if (!selectedConnectorTypes.todos) {
      const selectedTypes = Object.entries(selectedConnectorTypes)
        .filter(([key, value]) => key !== 'todos' && value)
        .map(([key, _]) => key);
      connectorMatch = selectedTypes.length === 0 || selectedTypes.includes(station.connectorType);
      console.log(station)
    }
    
    return statusMatch && connectorMatch;
  });

  // Mostrar loading enquanto busca dados
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="h6">Carregando estações EletraNet...</Typography>
        <Typography variant="body2" color="textSecondary">
          Buscando postos de carregamento disponíveis
        </Typography>
      </Box>
    );
  }

  // Mostrar erro se houver
  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Typography variant="body2">Tente recarregar a página</Typography>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Recarregar
        </button>
      </Box>
    );
  }

  // Só mostra o mapa se tiver estações carregadas
  if (stations.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h6">Nenhuma estação encontrada</Typography>
        <Typography variant="body2">Não há postos de carregamento disponíveis no momento</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '82vh' }}>
      {/* Mapa - 80% */}
      <Box sx={{ flex: 4, position: 'relative' }}>
        <APIProvider apiKey={'AIzaSyDqX72bHbKlVnFwaOiW_0Bmx09_1ep-8W4'}>
          <Map
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0
            }}
            defaultZoom={12}
            defaultCenter={{ lat: 40.6360, lng: -8.6538 }}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
            }
            mapId="da37f3254c6a6d1c"
          >
            <PoiMarkers pois={filteredStations} onMarkerClick={handleMarkerClick} />
          </Map>
        </APIProvider>
      </Box>

      {/* Painel lateral - 20% */}
      <Box sx={{ flex: 1, p: 2, bgcolor: '#fbfcfc', overflowY: 'auto' }}>
        <Box >
          <Typography variant="h4" gutterBottom>
            FILTROS
          </Typography>
          <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }} >
            STATUS
          </Typography>
          <Divider orientation="horizontal" flexItem />
          <div>
            <FormControl sx={{ m: 1, minWidth: 120 ,marginTop:2}} >
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={StationStatusFormValue}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value={"STATUS_ATIVA"}>Activa</MenuItem>
                <MenuItem value={"STATUS_OCUPADO"}>Ocupado</MenuItem>
                <MenuItem value={"STATUS_DESLIGADO"}>Desligado</MenuItem>
                <MenuItem value={"STATUS_RESERVADO"}>Reservado</MenuItem>
                <MenuItem value="">Mostrar Todos os postos</MenuItem>
              </Select>
              <FormHelperText>Estado do Posto</FormHelperText>
            </FormControl>
          </div>
        
          <FormGroup>
            <Box sx={{display:"inline-flex"}}>
              <Typography variant='body2' gutterBottom marginTop={3} sx={{ fontWeight: 'bold' }} >
                TIPO DE CONECTOR
              </Typography>
              <FormControlLabel 
                sx={{marginLeft:"5%"}}
                control={
                  <Checkbox 
                    checked={selectedConnectorTypes.todos}
                    onChange={handleConnectorTypeChange}
                    name="todos"
                  />
                } 
                label="Todos" 
              />  
            </Box>

            <Divider orientation="horizontal" flexItem />
            
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={selectedConnectorTypes.CCS}
                  onChange={handleConnectorTypeChange}
                  name="CCS"
                />
              } 
              label="CCS" 
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={selectedConnectorTypes.TIPO2}
                  onChange={handleConnectorTypeChange}
                  name="TIPO2"
                />
              } 
              label="TIPO2" 
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={selectedConnectorTypes.CHADEMO}
                  onChange={handleConnectorTypeChange}
                  name="CHADEMO"
                />
              } 
              label="CHADEMO" 
            />
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={selectedConnectorTypes.TIPO1}
                  onChange={handleConnectorTypeChange}
                  name="TIPO1"
                />
              } 
              label="TIPO1" 
            />
          </FormGroup>

          {/* Contador de estações filtradas */}
          <Box sx={{ mt: 2, p: 1, bgcolor: '#e3f2fd', borderRadius: 1 }}>
            <Typography variant="caption" color="primary">
              Mostrando {filteredStations.length} de {stations.length} estações
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Modal que abre ao clicar no marcador */}
      <CustomModal
        open={open}
        onClose={fecharModal}

      >
        {selectedStation && (
          <Box sx={{ p: 2 }}>
     
            <Box sx={{marginLeft:"-4%",marginTop:"-2%"}}>
                  <TableContainer component={Paper} sx={{marginLeft:"1%",marginTop:"2%" ,width:650,backgroundColor:"#FFFDF6"}}>
                    <Table  aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">Nome</TableCell>

                          <TableCell align="left">Status</TableCell>
                          <TableCell align="left">Preço/H</TableCell>

                          
                          <TableCell align="left">Tipo de Conector</TableCell>
                          <TableCell align="left">Localização</TableCell>
                          

                        </TableRow>
                      </TableHead>
                      <TableBody>
                       
                          <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row" align="left">
                             <strong>{selectedStation ? `${selectedStation.name || selectedStation.key}` : "Detalhes da Estação"} </strong>
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                             {selectedStation.status || 'Não informado'}
                            </TableCell>
                            <TableCell component="th" scope="row" align="left">
                             {selectedStation.pricePerHour || 'Não informado'}
                            </TableCell>
                            <TableCell align="left"> {selectedStation.connectorType || 'Não informado'}</TableCell>
                            <TableCell align="left">{selectedStation.location.lat.toFixed(6)}, {selectedStation.location.lng.toFixed(6)}</TableCell>
   
                          </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
         

            </Box>


            
            <Box sx={{ display: 'flex', gap: 3,marginTop:"10%",marginLeft:"-3%", alignItems: 'center' }}>
              <ReservaCalendario selectedStation={selectedStation}/>
              <button 
                onClick={fecharModal}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </Box>
          </Box>
        )}
      </CustomModal>
    </Box>
  );
};

const PoiMarkers = (props: { pois: Poi[], onMarkerClick: (poi: Poi) => void }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [circleCenter, setCircleCenter] = useState(null);
  
  const handleClick = useCallback((poi: Poi, ev: google.maps.MapMouseEvent) => {
    if(!map) return;
    if(!ev.latLng) return;
    
    console.log('marker clicked: ', ev.latLng.toString(), 'station:', poi);
    map.panTo(ev.latLng);
    setCircleCenter(ev.latLng);
    
    // Chama a função do componente pai para abrir o modal
    props.onMarkerClick(poi);
  }, [map, props]);

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }
  }, [map]);

  // Update markers
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return {...prev, [key]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      <Circle
        radius={800}
        center={circleCenter}
        strokeColor={'#0c4cb3'}
        strokeOpacity={1}
        strokeWeight={3}
        fillColor={'#3b82f6'}
        fillOpacity={0.3}
      />
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={marker => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={(ev) => handleClick(poi, ev)}
        >
          <Pin 
            background={'#222'} 
            glyphColor={'#FFF'} 
            borderColor={'#222'}
            scale={1.9}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default Mapa;