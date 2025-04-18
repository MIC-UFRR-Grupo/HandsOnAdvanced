import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import relatorioService from '../services/relatorioService';

const Relatorios = () => {
  const [tipoRelatorio, setTipoRelatorio] = useState('');
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [tiposRelatorio, setTiposRelatorio] = useState([]);
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    carregarTiposRelatorio();
  }, []);

  const carregarTiposRelatorio = async () => {
    try {
      const dados = await relatorioService.listarTipos();
      setTiposRelatorio(dados);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar tipos de relatório',
        severity: 'error',
      });
    }
  };

  const handleGerarRelatorio = async () => {
    try {
      setLoading(true);
      const dados = await relatorioService.gerar(
        tipoRelatorio,
        dataInicio,
        dataFim,
        filtro
      );
      setRelatorio(dados);
      setSnackbar({
        open: true,
        message: 'Relatório gerado com sucesso',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao gerar relatório',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Relatórios
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Relatório</InputLabel>
              <Select
                value={tipoRelatorio}
                label="Tipo de Relatório"
                onChange={(e) => setTipoRelatorio(e.target.value)}
              >
                {tiposRelatorio.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data Início"
                value={dataInicio}
                onChange={(newValue) => setDataInicio(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data Fim"
                value={dataFim}
                onChange={(newValue) => setDataFim(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Filtro Adicional"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Digite um filtro adicional (opcional)"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGerarRelatorio}
              disabled={!tipoRelatorio || !dataInicio || !dataFim || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Gerar Relatório'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {relatorio && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Visualização do Relatório
          </Typography>
          <pre>{JSON.stringify(relatorio, null, 2)}</pre>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Relatorios; 