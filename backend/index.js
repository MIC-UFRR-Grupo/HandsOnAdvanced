const express = require('express');
const cors = require('cors');
const path = require('path');
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});
const db = admin.database();

const app = express();

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:3000', // porta padrão do React
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Importar e usar rotas
const dashboardRouter = require('./routes/dashboard');
const veiculosRouter = require('./routes/veiculos');
const motoristasRouter = require('./routes/motoristas');
const relatoriosRouter = require('./routes/relatorios');

// Rotas
app.use('/dashboard', dashboardRouter);
app.use('/veiculos', veiculosRouter);
app.use('/motoristas', motoristasRouter);
app.use('/relatorios', relatoriosRouter);

// Rota inexistente


// Rota de teste
app.get('/test-realtime', (req, res) => {
  const ref = db.ref('/drivers');
  let responded = false;

  ref.on('value', snapshot => {
    if (!responded && snapshot.exists) {
      responded = true;
      res.json(snapshot.val());
    }
  }, error => {
    if (!responded) {
      responded = true;
      res.status(500).json({ error: error.message });
    }
  });

  setTimeout(() => {
    if (!responded) {
      responded = true;
      res.status(408).json({ error: "Tempo esgotado" });
    }
  }, 10000);
});

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});