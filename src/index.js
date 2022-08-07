const express = require("express");
const cors = require("cors");
const app = express();

//Routes
const blogsRoute = require("./routes/blogs");
const usersRoute = require("./routes/users");

//MiddleWare
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(blogsRoute);
app.use(usersRoute);

app.listen(5000, () => {
  console.log("execute on port 5000");
});
