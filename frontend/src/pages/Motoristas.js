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
import motoristaService from '../services/motoristaService';

const Motoristas = () => {
  const [motoristas, setMotoristas] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cnh: '',
    telefone: '',
    status: 'Ativo',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    carregarMotoristas();
  }, []);

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
    setFormData({ nome: '', cnh: '', telefone: '', status: 'Ativo' });
  };

  const handleSubmit = async () => {
    try {
      if (formData.id) {
        await motoristaService.atualizar(formData.id, formData);
        setSnackbar({
          open: true,
          message: 'Motorista atualizado com sucesso',
          severity: 'success',
        });
      } else {
        await motoristaService.criar(formData);
        setSnackbar({
          open: true,
          message: 'Motorista criado com sucesso',
          severity: 'success',
        });
      }
      handleClose();
      carregarMotoristas();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao salvar motorista',
        severity: 'error',
      });
    }
  };

  const handleEdit = (motorista) => {
    setFormData(motorista);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await motoristaService.excluir(id);
      setSnackbar({
        open: true,
        message: 'Motorista excluído com sucesso',
        severity: 'success',
      });
      carregarMotoristas();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erro ao excluir motorista',
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
        <Typography variant="h4">Motoristas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Adicionar Motorista
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CNH</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {motoristas.map((motorista) => (
              <TableRow key={motorista.id}>
                <TableCell>{motorista.nome}</TableCell>
                <TableCell>{motorista.cnh}</TableCell>
                <TableCell>{motorista.telefone}</TableCell>
                <TableCell>{motorista.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(motorista)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(motorista.id)}>
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
          {formData.id ? 'Editar Motorista' : 'Adicionar Motorista'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          />
          <TextField
            margin="dense"
            label="CNH"
            fullWidth
            value={formData.cnh}
            onChange={(e) => setFormData({ ...formData, cnh: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefone"
            fullWidth
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
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

export default Motoristas; 