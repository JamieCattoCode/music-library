const express = require('express');
const artistRouter = require('../src/routes/artist');

const app = express();
app.use(express.json());

app.use('/artists', artistRouter);

module.exports = app;