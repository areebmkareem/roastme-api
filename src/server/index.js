require('express-async-errors');
require('../db/mongoose');
const express = require('express');
const winston = require('winston');
const bodyParser = require('body-parser');
const cors = require('cors');
const user = require('../routers/v1/user');
const track = require('../routers/v1/track');
const error = require('../controllers/error');

// winston.add(winston.transports.File, { filename: 'logfile.log' });

const port = process.env.PORT;

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use('/api/v1', user);
app.use(error);

app.listen(port, () => {
  console.log(`🚀 Started On Port ${port}`);
});
