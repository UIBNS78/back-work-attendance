require("dotenv").config();
const cors = require("cors");
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const session = require("express-session");
const port = process.env.SERVER_PORT || 3333;

// connect mongodb
require("./config/local.env");

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport/passport-jwt.config");
require("./config/passport/passport.config")(passport);

// routing
app.use("/users", require("./routes/users.route"));

app.listen(port, () => {
  console.log(`Backend app listening on port ${port}`);
});
