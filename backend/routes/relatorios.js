const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();

// Listar tipos de relatório disponíveis
router.get('/tipos', (req, res) => {
  const tipos = [
    { value: 'veiculos', label: 'Relatório de Veículos' },
    { value: 'motoristas', label: 'Relatório de Motoristas' },
    { value: 'viagens', label: 'Relatório de Viagens' }
  ];
  res.json(tipos);
});

// Gerar relatório
router.post('/', async (req, res) => {
  try {
    const { tipo, dataInicio, dataFim, filtro } = req.body;
    let resultado = [];

    switch (tipo) {
      case 'veiculos':
        const snapshotVeiculos = await db.collection('veiculos').get();
        snapshotVeiculos.forEach(doc => {
          resultado.push({ id: doc.id, ...doc.data() });
        });
        break;

      case 'motoristas':
        const snapshotMotoristas = await db.collection('motoristas').get();
        snapshotMotoristas.forEach(doc => {
          resultado.push({ id: doc.id, ...doc.data() });
        });
        break;

      case 'viagens':
        const snapshotViagens = await db.collection('viagens')
          .where('data', '>=', new Date(dataInicio))
          .where('data', '<=', new Date(dataFim))
          .get();
        snapshotViagens.forEach(doc => {
          resultado.push({ id: doc.id, ...doc.data() });
        });
        break;

      default:
        return res.status(400).json({ error: 'Tipo de relatório inválido' });
    }

    // Aplicar filtro adicional se fornecido
    if (filtro) {
      resultado = resultado.filter(item => {
        return Object.values(item).some(value => 
          String(value).toLowerCase().includes(filtro.toLowerCase())
        );
      });
    }

    res.json({
      tipo,
      dataInicio,
      dataFim,
      totalRegistros: resultado.length,
      dados: resultado
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 