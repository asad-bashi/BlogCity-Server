const dotenv = require("dotenv");
const mysql = require("mysql");
dotenv.config();
const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: process.env.DATABASE_PASSWORD,
  database: "blogapp",
});

//add querys here
function findUser(email){
  
}

module.exports = db;
