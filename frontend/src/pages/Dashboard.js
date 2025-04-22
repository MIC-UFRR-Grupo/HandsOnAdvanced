import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Typography, Grid, Paper, Stack, CircularProgress } from '@mui/material';
import { DirectionsCar, People, Assessment } from '@mui/icons-material';
import L from 'leaflet';
import '../leaflet/dist/leaflet.css';
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
  const markerRef = useRef([]); // Inicializa como array
  const pollingInterval = useRef(null); // Para controlar o intervalo de polling

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
      title: 'Veículos em Serviço',
      value: dashboardData?.totalEmMovimento || '0',
      icon: <Assessment sx={{ fontSize: 40, color: 'white' }} />,
      color: '#ed6c02',
    },
  ], [dashboardData]);

  // Atualização em tempo real dos dados do dashboard (polling)
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const dashData = await dashboardService.getDashboardData();
        if (!isMounted) return;
        setDashboardData(dashData);
        if (dashData.veiculosAtivos.length > 0) {
          setDriverLocation(dashData.veiculosAtivos[0].rfidData);
        }
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError('Erro ao carregar dados do dashboard');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };
    fetchData();
    pollingInterval.current = setInterval(fetchData, 3000); // Atualiza a cada 3 segundos
    return () => {
      isMounted = false;
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  // Atualiza marcadores do mapa sempre que dashboardData mudar
  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView([2.8256994, -60.6779949], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c'],
      }).addTo(mapInstance.current);
    }

    if (mapInstance.current && dashboardData?.veiculosAtivos) {
      // Limpar marcadores existentes
      if (markerRef.current && markerRef.current.length > 0) {
        markerRef.current.forEach(marker => marker.remove());
        markerRef.current = [];
      }
      // Adicionar marcadores para cada veículo
      dashboardData.veiculosAtivos.forEach(veiculo => {
        if (veiculo.rfidData && veiculo.rfidData.latitude && veiculo.rfidData.longitude) {
          const markerHtml = `
            <div class="driver-marker ${veiculo.rfidData.is_moving ? 'moving' : 'stopped'} driver-marker-pulse" 
                 style="width: 20px; height: 20px;"></div>
          `;
          const marker = L.marker([veiculo.rfidData.latitude, veiculo.rfidData.longitude], {
            icon: L.divIcon({
              className: 'custom-icon',
              html: markerHtml,
              iconSize: [20, 20]
            })
          }).addTo(mapInstance.current)
            .bindPopup(`
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 10px 0;">Dados do Veículo</h3>
                <p style="margin: 5px 0;"><strong>Placa:</strong> ${veiculo.placa}</p>
                <p style="margin: 5px 0;"><strong>Motorista:</strong> ${veiculo.motoristaNome}</p>
                <p style="margin: 5px 0;"><strong>Frequência Cardíaca:</strong> ${veiculo.rfidData.heart_rate} bpm</p>
                <p style="margin: 5px 0;"><strong>Temperatura:</strong> ${veiculo.rfidData.mpu_temperature}°C</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> ${veiculo.rfidData.is_moving ? 'Em movimento' : 'Parado'}</p>
              </div>
            `, {
              maxWidth: 300,
              className: 'custom-popup'
            });
          markerRef.current.push(marker);
        }
      });
      // Centralizar o mapa no primeiro veículo
      const primeiroVeiculo = dashboardData.veiculosAtivos.find(v => v.rfidData?.latitude && v.rfidData?.longitude);
      if (primeiroVeiculo) {
        mapInstance.current.setView([primeiroVeiculo.rfidData.latitude, primeiroVeiculo.rfidData.longitude], 13);
      }
    }
    // Limpeza dos marcadores ao desmontar
    return () => {
      if (markerRef.current && markerRef.current.length > 0) {
        markerRef.current.forEach(marker => marker.remove());
        markerRef.current = [];
      }
    };
  }, [dashboardData]);

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
          <Paper elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
            <div ref={mapRef} style={{ width: '1100px', height: '400px', maxWidth: '100%', margin: '0 auto' }} />
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