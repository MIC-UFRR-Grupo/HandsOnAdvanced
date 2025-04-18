const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

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
        db.ref('veiculos').once('value', snapshot => {
          snapshot.forEach(child => {
            resultado.push(child.val());
          });
          res.json(resultado);
        });
        break;

      case 'motoristas':
        db.ref('motoristas').once('value', snapshot => {
          snapshot.forEach(child => {
            resultado.push(child.val());
          });
          res.json(resultado);
        });
        break;

      case 'viagens':
        // Implementar lógica para gerar relatório de viagens
        res.json(resultado);
        break;

      default:
        res.status(400).json({ error: 'Tipo de relatório inválido' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;