const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

// Buscar dados do dashboard
router.get('/', async (req, res) => {
  try {
    const veiculosRef = db.ref('vehicles');
    const motoristasRef = db.ref('drivers');
    const relatoriosRef = db.ref('reports');

    const [veiculosSnapshot, motoristasSnapshot, relatoriosSnapshot] = await Promise.all([
      veiculosRef.once('value'),
      motoristasRef.once('value'),
      relatoriosRef.once('value')
    ]);

    const totalVeiculos = veiculosSnapshot.exists() ? Object.keys(veiculosSnapshot.val()).length : 0;
    const totalMotoristas = motoristasSnapshot.exists() ? Object.keys(motoristasSnapshot.val()).length : 0;
    const totalRelatorios = relatoriosSnapshot.exists() ? Object.keys(relatoriosSnapshot.val()).length : 0;

    res.json({
      totalVeiculos,
      totalMotoristas,
      totalRelatorios
    });
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({ error: error.message });
  }
});

// Buscar localização do motorista
router.get('/driver-location', async (req, res) => {
  try {
    const driverRef = db.ref('drivers/test_tag');
    const snapshot = await driverRef.once('value');
    
    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Dados de localização não encontrados' });
    }

    const driverData = snapshot.val();
    res.json({
      latitude: driverData.latitude,
      longitude: driverData.longitude,
      heart_rate: driverData.heart_rate,
      is_moving: driverData.is_moving,
      mpu_temperature: driverData.mpu_temperature
    });
  } catch (error) {
    console.error('Erro ao buscar localização do motorista:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;