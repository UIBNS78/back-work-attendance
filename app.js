const cors = require('cors');
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const session = require('express-session');
const port = 3001;

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(session({
  secret: "UIBNS78SECRETCODE",
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport-jwt.config');
require('./config/passport.config')(passport);

// routing
app.use('/users', require('./routes/users.route'));

app.listen(port, () => {
  console.log(`backend app listening on port ${port}`);
})