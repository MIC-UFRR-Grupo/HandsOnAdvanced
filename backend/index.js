const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert('./serviceAccountKey.json'),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const app = express();
app.use(cors());
app.use(express.json());

// Rotas (exemplo)
app.get('/veiculos', async (req, res) => {
  const snapshot = await admin.firestore().collection('veiculos').get();
  res.json(snapshot.docs.map(doc => doc.data()));
});

app.listen(process.env.PORT, () => {
  console.log(`Backend rodando na porta ${process.env.PORT}`);
});