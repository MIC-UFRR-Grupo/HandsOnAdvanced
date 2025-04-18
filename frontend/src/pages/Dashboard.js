import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { DirectionsCar, People, Assessment } from '@mui/icons-material';

const Dashboard = () => {
  const cards = [
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
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: 140,
                backgroundColor: card.color,
                color: 'white',
              }}
            >
              {card.icon}
              <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                {card.title}
              </Typography>
              <Typography variant="h4" component="div">
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 