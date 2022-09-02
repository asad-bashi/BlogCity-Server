const dotenv = require("dotenv");
const mysql = require("mysql");
const { hashPassword } = require("../utils/helpers");

dotenv.config();
const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
});

//returns blog with given id
function getBlog(id) {
  return new Promise((resolve, reject) => {
    const query = `select blogs.id,title,body,date_format(created_at,'%M %d %Y') as date ,concat(users.first_name,' ',users.last_name) as 'name' from blogs join users on blogs.user_id = users.id where blogs.id=?`;
    db.query(query, [id], (error, results) => {
      if (error) {
        return reject(error);
      }

      return resolve(results[0]);
    });
  });
}

//returns all blogs with format to make blog cards
function getBlogs() {
  return new Promise((resolve, reject) => {
    const query = `select blogs.id,title,body,date_format(created_at,'%M %d, %Y') as 'date',concat(users.first_name,' ',users.last_name) as 'name' from blogs
                   join users on blogs.user_id = users.id`;
    db.query(query, [], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

function insertBlog(title, body, id) {
  return new Promise((resolve, reject) => {
    const query = `insert into blogs(title,body,user_id) values(?,?,?)`;
    db.query(query, [title, body, id], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

//checks if given email is in database
function isValidEmail(email) {
  return new Promise((resolve, reject) => {
    const query = `select * from users where email=?`;
    db.query(query, [email], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results[0]);
    });
  });
}

//returns user with given id
function getUser(id) {
  return new Promise((resolve, reject) => {
    const query = `select id,first_name,last_name,email from users where id=?`;

    db.query(query, [id], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results[0]);
    });
  });
}

//returns all users in db
function getAllUsers() {
  return new Promise((resolve, reject) => {
    const query = `select * from users`;
    db.query(query, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

function insertUser(fname, lname, email, password) {
  const hashed = hashPassword(password);
  return new Promise((resolve, reject) => {
    const query = `insert into users (first_name,last_name,email,hashed) values(?,?,?,?);`;
    db.query(query, [fname, lname, email, hashed], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

module.exports = {
  db,
  getBlog,
  getBlogs,
  insertBlog,
  isValidEmail,
  getUser,
  getAllUsers,
  insertUser,
};
