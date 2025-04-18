import React from 'react';
import { Box, Typography, Grid, Paper, Stack } from '@mui/material';
import { DirectionsCar, People, Assessment } from '@mui/icons-material';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const Dashboard = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const cards = [
    {
      title: 'Total de Veículos',
      value: '25',
      icon: <DirectionsCar sx={{ fontSize: 40, color: 'white' }} />,
      color: '#1976d2',
    },
    {
      title: 'Total de Motoristas',
      value: '15',
      icon: <People sx={{ fontSize: 40, color: 'white' }} />,
      color: '#2e7d32',
    },
    {
      title: 'Relatórios Gerados',
      value: '8',
      icon: <Assessment sx={{ fontSize: 40, color: 'white' }} />,
      color: '#ed6c02',
    },
  ];

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView([2.8256994, -60.6779949], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: ['a', 'b', 'c'],
      }).addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Mapa (Ocupa toda a largura) */}
        <Grid item xs={12}>
          <div ref={mapRef} style={{ 
            height: '500px', 
            borderRadius: '8px', 
            overflow: 'hidden',
            marginBottom: '20px' 
          }} />
        </Grid>

        {/* Cards (Abaixo do mapa) */}
        <Grid item xs={12}>
          <Stack 
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ 
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            {cards.map((card, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  p: 2,
                  bgcolor: card.color,
                  color: 'white',
                  borderRadius: '12px',
                  minWidth: '280px',
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {card.icon}
                <Box>
                  <Typography variant="subtitle1">{card.title}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {card.value}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>
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