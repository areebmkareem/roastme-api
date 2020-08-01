require('express-async-errors');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./db/mongoose');
const user = require('./routers/v1/user');
const errors = require('./middleware/error');
const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1', user);

app.use(errors);

app.listen(port, () => {
  console.log(`Started On Port ${port}`);
});
