const express = require("express");
const cors = require("cors");
const app = express();
const passport = require("passport");
require("./strategies/local");

//Routes
const blogsRoute = require("./routes/blogs");
const usersRoute = require("./routes/users");
const session = require("express-session");

//MiddleWare
app.use(
  session({
    secret: "LASDNFOLIUASNDFKSABDFBASDFASDF",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(blogsRoute);
app.use(usersRoute);

app.use(passport.initialize());
app.use(passport.session());

app.listen(5000, () => {
  console.log("execute on port 5000");
});
