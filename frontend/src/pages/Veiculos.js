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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import veiculoService from '../services/veiculoService';
import motoristaService from '../services/motoristaService';

const Veiculos = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [motoristas, setMotoristas] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    ano: '',
    status: 'Ativo',
    motorista_id: '',
    rfid_tag: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    carregarVeiculos();
    carregarMotoristas();
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

  const carregarMotoristas = async () => {
    try {
      const dados = await motoristaService.listar();
      setMotoristas(dados);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar motoristas',
        severity: 'error',
      });
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ 
      placa: '', 
      modelo: '', 
      ano: '', 
      status: 'Ativo',
      motorista_id: '',
      rfid_tag: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.motorista_id) {
        setSnackbar({
          open: true,
          message: 'Por favor, selecione um motorista',
          severity: 'error',
        });
        return;
      }

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
              <TableCell>Motorista</TableCell>
              <TableCell>Tag RFID</TableCell>
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
                  {motoristas.find(m => m.id === veiculo.motorista_id)?.nome || '-'}
                </TableCell>
                <TableCell>{veiculo.rfid_tag}</TableCell>
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
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="Ativo">Ativo</MenuItem>
              <MenuItem value="Inativo">Inativo</MenuItem>
              <MenuItem value="Manutenção">Manutenção</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Motorista</InputLabel>
            <Select
              value={formData.motorista_id}
              label="Motorista"
              onChange={(e) => setFormData({ ...formData, motorista_id: e.target.value })}
            >
              {motoristas.map((motorista) => (
                <MenuItem key={motorista.id} value={motorista.id}>
                  {motorista.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Tag RFID"
            fullWidth
            value={formData.rfid_tag}
            onChange={(e) => setFormData({ ...formData, rfid_tag: e.target.value })}
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