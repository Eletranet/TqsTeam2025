/**
 * Copyright 2024 Google LLC
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    https://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

import React, {useEffect, useState, useRef, useCallback} from 'react';
import {createRoot} from 'react-dom/client';

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
import { Grid, Typography } from '@mui/material';
import {Circle} from '../components/circle'
import { Box, Container } from '@mui/material';


import {getAllStations }from "../services/MainServices"


type Poi ={ key: string, location: google.maps.LatLngLiteral }
const locations: Poi[] = [
  { key: 'estacaoFerroviaria', location: { lat: 40.6443, lng: -8.6455 } },
  { key: 'campusUniversitario', location: { lat: 40.6301, lng: -8.6600 } },
  { key: 'praiaGafanhaNazare', location: { lat: 40.6180, lng: -8.7150 } },
  { key: 'centroIlhavo', location: { lat: 40.5998, lng: -8.6702 } },
  { key: 'praiaDaBarra', location: { lat: 40.6422, lng: -8.7473 } },
  { key: 'parqueOvar', location: { lat: 40.8650, lng: -8.6251 } },
  { key: 'centroAgueda', location: { lat: 40.5757, lng: -8.4439 } },
  { key: 'reservaSaoJacinto', location: { lat: 40.6797, lng: -8.7368 } },
  { key: 'zonaIndustrialEstarreja', location: { lat: 40.7572, lng: -8.5697 } },
  { key: 'oliveiraDoBairro', location: { lat: 40.5142, lng: -8.4951 } }
];

const Mapa = () => (
    

    <>

 <Box sx={{ display: 'flex', height: '100vh' ,marginTop:"10px"}}>
      
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
            defaultZoom={15}
            defaultCenter={{ lat:   40.6360, lng:  -8.6538}}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
            }
            mapId="da37f3254c6a6d1c"
          >
            <PoiMarkers pois={locations} />
          </Map>
        </APIProvider>
      </Box>

      {/* Painel lateral - 20% */}
      <Box sx={{ flex: 1, p: 2, bgcolor: '#f5f5f5', overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom>
          Painel de Controlo
        </Typography>
        <Typography>
          Bem-vindo! Aqui podes colocar filtros, botões ou outros conteúdos.
        </Typography>
      </Box>

    </Box>
    
    </>
   

);

const PoiMarkers = (props: { pois: Poi[] }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const [circleCenter, setCircleCenter] = useState(null)
  const handleClick = useCallback((key: string, ev: google.maps.MapMouseEvent) => {
    if(!map) return;
    if(!ev.latLng) return;
    console.log('marker clicked: ', ev.latLng.toString() , 'key',key);
    alert("Local:" + key)
    map.panTo(ev.latLng);
    setCircleCenter(ev.latLng);
  });
  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }
  }, [map]);

  // Update markers, if the markers array has changed
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
      {props.pois.map( (poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          ref={marker => setMarkerRef(marker, poi.key)}
          clickable={true}
          onClick={(ev) => handleClick(poi.key, ev)}
          >
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default Mapa;