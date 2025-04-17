const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json'),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = admin.firestore();
const app = express();
app.use(cors());

// Remova a simulação de atualizações automáticas (ela causa conflito)
// Mantenha apenas o listener passivo

// Rota corrigida para tempo real
app.get('/test-realtime', (req, res) => {
  const docRef = db.collection('test').doc('realtime');
  let responded = false; // Flag para controlar resposta única

  const unsubscribe = docRef.onSnapshot(
    (snapshot) => {
      if (!responded && snapshot.exists) {
        responded = true;
        res.json(snapshot.data());
        unsubscribe(); // Encerra o listener
      }
    },
    (error) => {
      if (!responded) {
        responded = true;
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Timeout para evitar requisições pendentes
  setTimeout(() => {
    if (!responded) {
      responded = true;
      res.status(408).json({ error: "Tempo esgotado" });
      unsubscribe();
    }
  }, 10000);
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3001}`);
});