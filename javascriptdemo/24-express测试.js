// app.js
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json({ message: 'Get all users'});
});

module.exports = app;
