const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

// Listar todos os veículos
router.get('/', (req, res) => {
  db.ref('veiculos').once('value', snapshot => {
    const veiculos = [];
    snapshot.forEach(child => {
      veiculos.push(child.val());
    });
    res.json(veiculos);
  });
});

// Criar um novo veículo
router.post('/', (req, res) => {
  db.ref('veiculos').push({
    placa: req.body.placa,
    modelo: req.body.modelo,
    ano: req.body.ano,
    status: req.body.status,
    createdAt: admin.database.ServerValue.TIMESTAMP
  }, error => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ message: 'Veículo criado com sucesso' });
    }
  });
});

// Atualizar um veículo
router.put('/:id', (req, res) => {
  db.ref(`veiculos/${req.params.id}`).update({
    placa: req.body.placa,
    modelo: req.body.modelo,
    ano: req.body.ano,
    status: req.body.status,
    updatedAt: admin.database.ServerValue.TIMESTAMP
  }, error => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ message: 'Veículo atualizado com sucesso' });
    }
  });
});

// Excluir um veículo
router.delete('/:id', (req, res) => {
  db.ref(`veiculos/${req.params.id}`).remove(error => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.json({ message: 'Veículo excluído com sucesso' });
    }
  });
});

module.exports = router;