require('express-async-errors');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('../db/mongoose');
const user = require('../routers/v1/user');
const track = require('../routers/v1/track');
const error = require('../controllers/error');
const port = process.env.PORT;

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use('/api/v1', user);
app.use('/api/v1', track);
app.use(error);

app.listen(port, () => {
  console.log(`Started On Port ${port}`);
});
