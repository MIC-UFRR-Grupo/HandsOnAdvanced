const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// Listar todos os veículos
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('veiculos').get();
    const veiculos = [];
    snapshot.forEach(doc => {
      veiculos.push({ id: doc.id, ...doc.data() });
    });
    res.json(veiculos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar um novo veículo
router.post('/', async (req, res) => {
  try {
    const { placa, modelo, ano, status } = req.body;
    const docRef = await db.collection('veiculos').add({
      placa,
      modelo,
      ano,
      status,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ id: docRef.id, placa, modelo, ano, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um veículo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { placa, modelo, ano, status } = req.body;
    await db.collection('veiculos').doc(id).update({
      placa,
      modelo,
      ano,
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ id, placa, modelo, ano, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Excluir um veículo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('veiculos').doc(id).delete();
    res.json({ message: 'Veículo excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 