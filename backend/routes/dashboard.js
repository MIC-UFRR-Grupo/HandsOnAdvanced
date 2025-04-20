const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

// Rota para obter dados do dashboard
router.get('/', async (req, res) => {
  try {
    // Buscar dados dos veículos
    const veiculosSnapshot = await db.ref('vehicles').once('value');
    const veiculos = [];
    if (veiculosSnapshot.exists()) {
      veiculosSnapshot.forEach(childSnapshot => {
        veiculos.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    }

    // Buscar dados dos motoristas
    const motoristasSnapshot = await db.ref('drivers').once('value');
    const motoristas = {};
    if (motoristasSnapshot.exists()) {
      motoristasSnapshot.forEach(childSnapshot => {
        motoristas[childSnapshot.key] = {
          id: childSnapshot.key,
          ...childSnapshot.val()
        };
      });
    }

    // Buscar dados do RFID
    const rfidSnapshot = await db.ref('rfid_tag_info').once('value');
    const rfidInfo = {};
    if (rfidSnapshot.exists()) {
      rfidSnapshot.forEach(childSnapshot => {
        rfidInfo[childSnapshot.key] = childSnapshot.val();
      });
    }

    // Processar dados para o dashboard
    const veiculosProcessados = veiculos.map(veiculo => {
      const motorista = motoristas[veiculo.motorista_id];
      const rfidData = veiculo.rfid_tag ? rfidInfo[veiculo.rfid_tag] : null;

      return {
        ...veiculo,
        motoristaNome: motorista ? motorista.nome : 'Não atribuído',
        rfidData: rfidData || null
      };
    });

    // Retornar dados processados
    res.json({
      totalVeiculos: veiculos.length,
      totalMotoristas: Object.keys(motoristas).length,
      totalEmMovimento: veiculosProcessados.filter(v => v.rfidData?.is_moving).length,
      veiculosAtivos: veiculosProcessados
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