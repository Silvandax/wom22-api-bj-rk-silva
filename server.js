const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3030;

require('dotenv').config();

console.log(process.env.DOTENV_WORKS);
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.on('open', () => console.log('Connected to DB'));


const cabinsRouter = require('./routes/cabins');
const ordersRouter = require('./routes/orders');
const servicesRouter = require('./routes/services');

// för att ta emot json
app.use(express.json());

// Testa att detta funkar, ersätt sedan med egen kod
app.get('/', (req, res) => res.json("Det funkar!"));

app.use('/cabins', cabinsRouter);
app.use('/orders', ordersRouter);
app.use('/services', servicesRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));