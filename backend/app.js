const veiculosRouter = require('./routes/veiculos');
const motoristasRouter = require('./routes/motoristas');
const dashboardRouter = require('./routes/dashboard');

app.use('/api/veiculos', veiculosRouter);
app.use('/api/motoristas', motoristasRouter);
app.use('/api/dashboard', dashboardRouter); 