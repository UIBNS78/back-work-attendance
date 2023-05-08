const mysql = require('mysql');
const dbConfig = {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crm'
};

module.exports = mysql.createPool(dbConfig);