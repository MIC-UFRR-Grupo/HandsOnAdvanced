const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.database();

// Listar todos os drivers
router.get('/', (req, res) => {
  db.ref('/drivers').once('value', snapshot => {
    const drivers = [];
    snapshot.forEach(child => {
      drivers.push(child.val());
    });
    res.json(drivers);
  });
});

module.exports = router;