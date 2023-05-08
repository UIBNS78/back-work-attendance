const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3001;

const app = express();

// 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// routing
app.use('/users', require('./routes/users.route'));

app.listen(port, () => {
  console.log(`backend app listening on port ${port}`);
})