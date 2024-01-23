const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api'); // Stellen Sie sicher, dass der Pfad korrekt ist

const app = express();
const port = 3000;

// Statische Dateien (für Frontend)
app.use(express.static(path.join(__dirname, 'public')));

// API-Routen
app.use('/api', apiRoutes);

// Startseite Route (lädt das Frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});

module.exports = app;
