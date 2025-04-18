const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

// Listar todos os motoristas
router.get('/', (req, res) => {
  db.ref('motoristas').once('value', snapshot => {
    const motoristas = [];
    snapshot.forEach(child => {
      motoristas.push(child.val());
    });
    res.json(motoristas);
  });
});

// Criar um novo motorista
router.post('/', (req, res) => {
  db.ref('motoristas').push({
    nome: req.body.nome,
    cnh: req.body.cnh,
    telefone: req.body.telefone,
    status: req.body.status
  }, error => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ message: 'Motorista criado com sucesso' });
    }
  });
});

// Atualizar um motorista
router.put('/:id', (req, res) => {
  db.ref(`motoristas/${req.params.id}`).update({
    nome: req.body.nome,
    cnh: req.body.cnh,
    telefone: req.body.telefone,
    status: req.body.status
  }, error => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ message: 'Motorista atualizado com sucesso' });
    }
  });
});

// Excluir um motorista
router.delete('/:id', (req, res) => {
  db.ref(`motoristas/${req.params.id}`).remove(error => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ message: 'Motorista excluído com sucesso' });
    }
  });
});

module.exports = router;