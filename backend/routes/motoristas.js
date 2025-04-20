const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

// Listar todos os motoristas
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.ref('drivers').once('value');
    const motoristas = [];
    
    if (snapshot.exists()) {
      snapshot.forEach(childSnapshot => {
        motoristas.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    }
    
    res.json(motoristas);
  } catch (error) {
    console.error('Erro ao listar motoristas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Criar um novo motorista
router.post('/', async (req, res) => {
  try {
    const { nome, cnh, telefone, status } = req.body;
    const newDriverRef = db.ref('drivers').push();
    
    await newDriverRef.set({
      nome,
      cnh,
      telefone,
      status,
      is_moving: false,
      createdAt: admin.database.ServerValue.TIMESTAMP
    });

    const snapshot = await newDriverRef.once('value');
    res.json({
      id: snapshot.key,
      ...snapshot.val()
    });
  } catch (error) {
    console.error('Erro ao criar motorista:', error);
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um motorista
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, cnh, telefone, status } = req.body;
    const driverRef = db.ref(`drivers/${id}`);
    
    // Verificar se o motorista existe
    const snapshot = await driverRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    // Atualizar apenas os campos fornecidos
    const updates = {
      ...(nome !== undefined && { nome }),
      ...(cnh !== undefined && { cnh }),
      ...(telefone !== undefined && { telefone }),
      ...(status !== undefined && { status }),
      updatedAt: admin.database.ServerValue.TIMESTAMP
    };

    await driverRef.update(updates);
    
    // Buscar dados atualizados
    const updatedSnapshot = await driverRef.once('value');
    res.json({
      id: updatedSnapshot.key,
      ...updatedSnapshot.val()
    });
  } catch (error) {
    console.error('Erro ao atualizar motorista:', error);
    res.status(500).json({ error: error.message });
  }
});

// Excluir um motorista
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const driverRef = db.ref(`drivers/${id}`);
    
    // Verificar se o motorista existe
    const snapshot = await driverRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    await driverRef.remove();
    res.json({ message: 'Motorista excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir motorista:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;