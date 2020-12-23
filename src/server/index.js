require('express-async-errors');
require('../db/mongoose');
const express = require('express');
const winston = require('winston');
const bodyParser = require('body-parser');
const cors = require('cors');
const user = require('../routers/v1/user');
const track = require('../routers/v1/track');
const error = require('../controllers/error');
const rateLimit = require('express-rate-limit');

// winston.add(winston.transports.File, { filename: 'logfile.log' });

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

//  apply to all requests

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(limiter);

app.set('trust proxy', 1);

app.use(bodyParser.json());
app.use('/api/v1', user);
app.use(error);

app.listen(port, () => {
  console.log(`🚀 Started On Port ${port}`);
});
