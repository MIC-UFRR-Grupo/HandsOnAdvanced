const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// Listar todos os motoristas
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('motoristas').get();
    const motoristas = [];
    snapshot.forEach(doc => {
      motoristas.push({ id: doc.id, ...doc.data() });
    });
    res.json(motoristas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar um novo motorista
router.post('/', async (req, res) => {
  try {
    const { nome, cnh, telefone, status } = req.body;
    const docRef = await db.collection('motoristas').add({
      nome,
      cnh,
      telefone,
      status,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ id: docRef.id, nome, cnh, telefone, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um motorista
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cnh, telefone, status } = req.body;
    await db.collection('motoristas').doc(id).update({
      nome,
      cnh,
      telefone,
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ id, nome, cnh, telefone, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Excluir um motorista
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('motoristas').doc(id).delete();
    res.json({ message: 'Motorista excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 