const mongoose = require("mongoose");

mongoose.connect(
  `${process.env.DB_MONGO_URI_LOCAL}/${process.env.DB_MONGO_NAME}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
mongoose.connection
  .on("error", console.error.bind(console, "Connection error :"))
  .once("open", () => {
    console.log("MongoDB is ready !!");
  });

// MONGO ONLINE
/*const connectMongoDB = async () => {
  try {
    console.log("MongoDB connecting...");
    await mongoose.connect(process.env.DB_MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      proxyHost: "webproxy.oma",
      proxyPort: 8080,
      proxyUsername: "fhj",
      proxyPassword: "Orange@uibns078",
    });
    console.log("MongoDB connected.");
  } catch (error) {
    console.log("Connection DB error : ", error);
  }
};

module.exports = connectMongoDB;*/

// MYSQL
/*const mysql = require('mysql');
const dbConfig = {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crm'
};

module.exports = mysql.createPool(dbConfig);*/
