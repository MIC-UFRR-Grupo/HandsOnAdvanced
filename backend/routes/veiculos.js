const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

// Listar todos os veículos
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.ref('vehicles').once('value');
    const veiculos = [];
    
    if (snapshot.exists()) {
      snapshot.forEach(childSnapshot => {
        veiculos.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    }
    
    res.json(veiculos);
  } catch (error) {
    console.error('Erro ao listar veículos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Criar um novo veículo
router.post('/', async (req, res) => {
  try {
    const { placa, modelo, ano, status, motorista_id, rfid_tag } = req.body;
    
    // Verificar se o motorista existe
    const motoristaRef = db.ref(`drivers/${motorista_id}`);
    const motoristaSnapshot = await motoristaRef.once('value');
    if (!motoristaSnapshot.exists()) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    // Verificar se a tag RFID já está em uso
    const veiculosSnapshot = await db.ref('vehicles').orderByChild('rfid_tag').equalTo(rfid_tag).once('value');
    if (veiculosSnapshot.exists()) {
      return res.status(400).json({ error: 'Tag RFID já está em uso' });
    }

    const newVehicleRef = db.ref('vehicles').push();
    
    await newVehicleRef.set({
      placa,
      modelo,
      ano,
      status,
      motorista_id,
      rfid_tag,
      is_moving: false,
      createdAt: admin.database.ServerValue.TIMESTAMP
    });

    const snapshot = await newVehicleRef.once('value');
    res.json({
      id: snapshot.key,
      ...snapshot.val()
    });
  } catch (error) {
    console.error('Erro ao criar veículo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Atualizar um veículo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { placa, modelo, ano, status, motorista_id, rfid_tag } = req.body;
    const vehicleRef = db.ref(`vehicles/${id}`);
    
    // Verificar se o veículo existe
    const snapshot = await vehicleRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    // Se houver mudança de motorista, verificar se o novo motorista existe
    if (motorista_id) {
      const motoristaRef = db.ref(`drivers/${motorista_id}`);
      const motoristaSnapshot = await motoristaRef.once('value');
      if (!motoristaSnapshot.exists()) {
        return res.status(404).json({ error: 'Motorista não encontrado' });
      }
    }

    // Se houver mudança de tag RFID, verificar se já está em uso
    if (rfid_tag && rfid_tag !== snapshot.val().rfid_tag) {
      const veiculosSnapshot = await db.ref('vehicles').orderByChild('rfid_tag').equalTo(rfid_tag).once('value');
      if (veiculosSnapshot.exists()) {
        return res.status(400).json({ error: 'Tag RFID já está em uso' });
      }
    }

    // Atualizar apenas os campos fornecidos
    const updates = {
      ...(placa !== undefined && { placa }),
      ...(modelo !== undefined && { modelo }),
      ...(ano !== undefined && { ano }),
      ...(status !== undefined && { status }),
      ...(motorista_id !== undefined && { motorista_id }),
      ...(rfid_tag !== undefined && { rfid_tag }),
      updatedAt: admin.database.ServerValue.TIMESTAMP
    };

    await vehicleRef.update(updates);
    
    // Buscar dados atualizados
    const updatedSnapshot = await vehicleRef.once('value');
    res.json({
      id: updatedSnapshot.key,
      ...updatedSnapshot.val()
    });
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    res.status(500).json({ error: error.message });
  }
});

// Excluir um veículo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicleRef = db.ref(`vehicles/${id}`);
    
    // Verificar se o veículo existe
    const snapshot = await vehicleRef.once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    await vehicleRef.remove();
    res.json({ message: 'Veículo excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir veículo:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;