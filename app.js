require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 6600;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); 

app.use((req, res, next) => {
  const logEntry = `${new Date().toLocaleString()} | IP: ${req.ip} | Method: ${req.method} | Path: ${req.path}\n`;

  fs.appendFile("log.txt", logEntry, (err, data) => {
      if (err) {
          console.error('Error writing to log file:', err);
      }
      next();
  });
});

// Routes
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});