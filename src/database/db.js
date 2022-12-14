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
  multipleStatements: true,
});

//returns all blogs with format to make blog cards
function getBlogs() {
  return new Promise((resolve, reject) => {
    const query = `select blogs.id,blogs.title,blogs.body,date_format(blogs.created_at,'%M %d %Y') as 'date',
                   concat(users.first_name,' ',users.last_name) as 'name', tags.tag as 'tags',blogs.image from blogs
                  join users on blogs.user_id = users.id join tags on tags.blog_id = blogs.id`;
    db.query(query, [], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

function getBlogsByCategory(category) {
  return new Promise((resolve, reject) => {
    const query = `select blogs.id,blogs.title,blogs.body,date_format(blogs.created_at,'%M %d %Y') as 'date',
                   concat(users.first_name,' ',users.last_name) as 'name', tags.tag as 'tags', blogs.image from blogs
                  join users on blogs.user_id = users.id join tags on tags.blog_id = blogs.id where tags.tag like '%${category}%'`;
    db.query(query, [], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

//returns all blogs with associated user id
function getBlogsByUserId(user_id) {
  return new Promise((resolve, reject) => {
    const query = `select blogs.id,blogs.title,blogs.body,date_format(blogs.created_at,'%M %d %Y') as 'date',
                   concat(users.first_name,' ',users.last_name) as 'name', tags.tag as 'tags', blogs.image from blogs
                  join users on blogs.user_id = users.id join tags on tags.blog_id = blogs.id where blogs.user_id=?`;

    db.query(query, [user_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

//returns blog with given id
function getBlog(id) {
  return new Promise((resolve, reject) => {
    const query = `select blogs.id,users.id as 'user_id', title,body,date_format(created_at,'%M %d %Y') as 'date' ,concat(users.first_name,' ',users.last_name) as 'name',
     tags.tag as 'tags', blogs.image from blogs join users on blogs.user_id = users.id join tags on tags.blog_id = blogs.id where blogs.id=?`;
    db.query(query, [id], (error, results) => {
      if (error) {
        return reject(error);
      }

      return resolve(results[0]);
    });
  });
}

function insertBlog(title, body, id, image) {
  return new Promise((resolve, reject) => {
    const query = `insert into blogs(title,body,user_id,image) values(?,?,?,?)`;
    db.query(query, [title, body, id, image], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

function editBlog(title, body, id) {
  return new Promise((resolve, reject) => {
    const query = `update blogs set title=?,body=? where id=?`;
    db.query(query, [title, body, id], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}
function getComments() {
  return new Promise((resolve, reject) => {
    const query = `select * from comments`;
    db.query(query, [], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

//gets comment with given id
function getComment(id) {
  return new Promise((resolve, reject) => {
    const query = `select * from comments where id=?`;
    db.query(query, [id], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results[0]);
    });
  });
}

function insertComment(comment, blog_id, user_id) {
  return new Promise((resolve, reject) => {
    const query = `insert into comments(body,blog_id,user_id) values(?,?,?)`;
    db.query(query, [comment, blog_id, user_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

function editComment(comment, id) {
  return new Promise((resolve, reject) => {
    const query = `update comments set body=? where id=?`;
    db.query(query, [comment, id], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

//deletes comment from database with matching id
function deleteComment(id) {
  return new Promise((resolve, reject) => {
    const query = `delete from comments where id=?`;
    db.query(query, [id], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

//will return number of comments that are associated with given blog id
function getNumberOfComments(id) {
  return new Promise((resolve, reject) => {
    const query = `select count(*) as 'numOfComments' from comments where blog_id=?`;
    db.query(query, [id], (error, results) => {
      if (error) {
        return reject(error);
      }
      const { numOfComments } = results[0];
      return resolve(numOfComments);
    });
  });
}

function getCommentsByBlogId(id) {
  return new Promise((resolve, reject) => {
    const query = `select comments.id,comments.body ,blog_id,concat(users.first_name,' ',users.last_name) as 'name',comments.user_id from comments join users on comments.user_id = users.id where comments.blog_id=?`;
    db.query(query, [id], (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve(results);
    });
  });
}

function deleteBlog(id) {
  return new Promise((resolve, reject) => {
    const query1 = `delete from tags where blog_id=${id}`;
    const query2 = `delete from comments where blog_id=${id}`;
    const query3 = `delete from blogs where id=${id}`;
    db.query(`${query1}; ${query2}; ${query3};`, [id], (error, results) => {
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

function insertTag(selectedTags, blog_id) {
  return new Promise((resolve, reject) => {
    const query = `insert into tags(tag,blog_id) values(?,?)`;
    db.query(query, [selectedTags, blog_id], (error, results) => {
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
  getBlogsByUserId,
  insertBlog,
  isValidEmail,
  getUser,
  getAllUsers,
  insertUser,
  insertTag,
  editBlog,
  deleteBlog,
  getBlogsByCategory,
  getComments,
  insertComment,
  getCommentsByBlogId,
  getNumberOfComments,
  deleteComment,
  getComment,
  editComment,
};
