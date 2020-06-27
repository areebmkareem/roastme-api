const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db/mongoose');
const user = require('./routers/v1/user');
const roast = require('./routers/v1/roast');

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1', user);
app.use('/api/v1', roast);

app.listen(port, () => {
  console.log(`Started On Port ${port}`);
});
