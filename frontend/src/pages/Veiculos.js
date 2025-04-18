import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import veiculoService from '../services/veiculoService';

const Veiculos = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    ano: '',
    status: 'Ativo',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    carregarVeiculos();
  }, []);

  const carregarVeiculos = async () => {
    try {
      const dados = await veiculoService.listar();
      setVeiculos(dados);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar veículos',
        severity: 'error',
      });
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ placa: '', modelo: '', ano: '', status: 'Ativo' });
  };

  const handleSubmit = async () => {
    try {
      if (formData.id) {
        await veiculoService.atualizar(formData.id, formData);
        setSnackbar({
          open: true,
          message: 'Veículo atualizado com sucesso',
          severity: 'success',
        });
      } else {
        await veiculoService.criar(formData);
        setSnackbar({
          open: true,
          message: 'Veículo criado com sucesso',
          severity: 'success',
        });
      }
      handleClose();
      carregarVeiculos();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao salvar veículo',
        severity: 'error',
      });
    }
  };

  const handleEdit = (veiculo) => {
    setFormData(veiculo);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await veiculoService.excluir(id);
      setSnackbar({
        open: true,
        message: 'Veículo excluído com sucesso',
        severity: 'success',
      });
      carregarVeiculos();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao excluir veículo',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Veículos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Adicionar Veículo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Placa</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Ano</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {veiculos.map((veiculo) => (
              <TableRow key={veiculo.id}>
                <TableCell>{veiculo.placa}</TableCell>
                <TableCell>{veiculo.modelo}</TableCell>
                <TableCell>{veiculo.ano}</TableCell>
                <TableCell>{veiculo.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(veiculo)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(veiculo.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {formData.id ? 'Editar Veículo' : 'Adicionar Veículo'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Placa"
            fullWidth
            value={formData.placa}
            onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Modelo"
            fullWidth
            value={formData.modelo}
            onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Ano"
            type="number"
            fullWidth
            value={formData.ano}
            onChange={(e) => setFormData({ ...formData, ano: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Status"
            fullWidth
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

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

export default Veiculos; 