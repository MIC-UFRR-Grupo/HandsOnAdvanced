import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Typography, Grid, Paper, Stack, CircularProgress } from '@mui/material';
import { DirectionsCar, People, Assessment } from '@mui/icons-material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dashboardService from '../services/dashboardService';

// Estilo CSS para o ícone personalizado
const customIconStyle = `
  .driver-marker {
    background-color: #2563eb;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  }
  .driver-marker.moving {
    background-color: #22c55e;
  }
  .driver-marker.stopped {
    background-color: #dc2626;
  }
  .driver-marker-pulse {
    animation: pulse 1.5s infinite;
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
    }
  }
`;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const lastLocationRef = useRef(null);

  // Adicionar estilo CSS ao documento
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customIconStyle;
    document.head.appendChild(styleElement);
    return () => styleElement.remove();
  }, []);

  const cards = useMemo(() => [
    {
      title: 'Total de Veículos',
      value: dashboardData?.totalVeiculos || '0',
      icon: <DirectionsCar sx={{ fontSize: 40, color: 'white' }} />,
      color: '#1976d2',
    },
    {
      title: 'Total de Motoristas',
      value: dashboardData?.totalMotoristas || '0',
      icon: <People sx={{ fontSize: 40, color: 'white' }} />,
      color: '#2e7d32',
    },
    {
      title: 'Relatórios Gerados',
      value: dashboardData?.totalRelatorios || '0',
      icon: <Assessment sx={{ fontSize: 40, color: 'white' }} />,
      color: '#ed6c02',
    },
  ], [dashboardData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashData, locData] = await Promise.all([
          dashboardService.getDashboardData(),
          dashboardService.getDriverLocation()
        ]);

        // Atualizar dados do dashboard apenas se houver mudança
        if (JSON.stringify(dashData) !== JSON.stringify(dashboardData)) {
          setDashboardData(dashData);
        }

        // Atualizar localização apenas se houver mudança
        if (JSON.stringify(locData) !== JSON.stringify(lastLocationRef.current)) {
          setDriverLocation(locData);
          lastLocationRef.current = locData;
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [dashboardData]);

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView([2.8256994, -60.6779949], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c'],
      }).addTo(mapInstance.current);
    }

    if (mapInstance.current && driverLocation) {
      const { latitude, longitude, is_moving } = driverLocation;

      // Criar HTML personalizado para o ícone
      const markerHtml = `
        <div class="driver-marker ${is_moving ? 'moving' : 'stopped'} driver-marker-pulse" 
             style="width: 20px; height: 20px;">
        </div>
      `;

      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
        // Atualizar classe do ícone baseado no status de movimento
        const markerElement = markerRef.current.getElement();
        if (markerElement) {
          markerElement.querySelector('.driver-marker')?.classList.toggle('moving', is_moving);
          markerElement.querySelector('.driver-marker')?.classList.toggle('stopped', !is_moving);
        }
      } else {
        markerRef.current = L.marker([latitude, longitude], {
          icon: L.divIcon({
            className: 'custom-icon',
            html: markerHtml,
            iconSize: [20, 20]
          })
        }).addTo(mapInstance.current)
          .bindPopup(`
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 10px 0;">Dados do Motorista</h3>
              <p style="margin: 5px 0;"><strong>Frequência Cardíaca:</strong> ${driverLocation.heart_rate} bpm</p>
              <p style="margin: 5px 0;"><strong>Temperatura:</strong> ${driverLocation.mpu_temperature}°C</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> ${driverLocation.is_moving ? 'Em movimento' : 'Parado'}</p>
            </div>
          `, {
            maxWidth: 300,
            className: 'custom-popup'
          });
      }

      mapInstance.current.setView([latitude, longitude], 13);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerRef.current = null;
      }
    };
  }, [driverLocation]);

  if (loading && !dashboardData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Mapa */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div ref={mapRef} style={{ height: '500px' }} />
          </Paper>
        </Grid>

        {/* Cards */}
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