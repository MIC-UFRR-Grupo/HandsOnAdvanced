import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, Commute, People, Assessment, Route } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import imageLogo from 'frontend\\src\\assets\\maloca.png';
const drawerWidth = 240;

const DashboardLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Veículos', icon: <Commute />, path: '/veiculos' },
    { text: 'Motoristas', icon: <People />, path: '/motoristas' },
    { text: 'Viagens', icon: <Route />, path: '/viagens' },
    { text: 'Relatórios', icon: <Assessment />, path: '/relatorios' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      // quero texto a esquerda e logo a direita
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} color="success">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Frota Leste - Sistema de Gestão de Transporte Hospitalar
          </Typography>
          <img src={imageLogo} alt="Logo" style={{ width: '108px', height: '50px' }} />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 