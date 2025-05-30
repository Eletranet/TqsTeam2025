

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
import type {Marker} from '@googlemaps/markerclusterer';
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

import {getAllStations} from "../services/MainServices"

type Poi = {
  key: string,
  location: google.maps.LatLngLiteral,
  name?: string,
  id?: number,
  status?: string
  connectorType?: string
}

const Mapa = () => {
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
    console.log("status -> " , newValue); // Este sim já tem o valor novo
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
              connectorType:station.connectorType
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




//  const filteredStations = StationStatusFormValue
 //   ? stations.filter(station => station.status === StationStatusFormValue)
  //  : stations;
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
            <PoiMarkers pois={filteredStations} />
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
                        id="station-state-selector"
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

    </Box>
  );
};

const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [circleCenter, setCircleCenter] = useState(null);

  const handleClick = useCallback((poi: Poi, ev: google.maps.MapMouseEvent) => {
    if(!map) return;
    if(!ev.latLng) return;

    console.log('marker clicked: ', ev.latLng.toString(), 'station:', poi);
    alert(`Estação: ${poi.name || poi.key}\nLocalização: ${ev.latLng.toString()}`);
    map.panTo(ev.latLng);
    setCircleCenter(ev.latLng);
  }, [map]);

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
