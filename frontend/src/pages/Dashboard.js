import React from 'react';
import { Box, Typography } from '@mui/material';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const Dashboard = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      // Inicializar o mapa apenas se não existir uma instância
      mapInstance.current = L.map(mapRef.current).setView([2.8256994,-60.6779949], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
      }).addTo(mapInstance.current);
    }

    // Função de limpeza para destruir o mapa quando o componente desmontar
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <div ref={mapRef} style={{ height: '600px', width: '100%' }} />
    </Box>
  );
};

export default Dashboard;

  /*const cards = [
    {
      title: 'Total de Veículos',
      value: '25',
      icon: <DirectionsCar sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Total de Motoristas',
      value: '15',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Relatórios Gerados',
      value: '8',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
  ];*/