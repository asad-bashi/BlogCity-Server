const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: process.env.DATABASE_PASSWORD,
  database: "blogapp",
});

//returns all blogs
app.get("/api/blogs", (req, res) => {
  const query = "select * from blogs";

  db.query(query, (error, results, fields) => {
    res.send(results);
  });
});

app.post("/api/blogs", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const query = "insert into blogs(title,content) values(?,?)";
  db.query(query, [title, content], (error, results) => {
    console.log(results);
  });
});

app.listen(5000, () => {
  console.log("execute on port 5000");
});
