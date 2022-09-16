const express = require("express");
const cors = require("cors");
const app = express();
const passport = require("passport");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
require("./utils/local");
dotenv.config();
const TWO_HOURS = 1000 * 60 * 60 * 2;
const options = {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

const sessionStore = new mysqlStore(options);

//Routes
const blogsRoute = require("./routes/blogs");
const usersRoute = require("./routes/users");

//MiddleWare
app.use(
  session({
    secret: "LASDNFOLIUASNDFKSABDFBASDFASDF",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: { maxAge: TWO_HOURS, httpOnly: true, sameSite: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(blogsRoute);
app.use(usersRoute);

app.get("/api/isAuth", (req, res) => {
  
  const isValid = req.isAuthenticated();

  if (isValid) {
    return res.send({ isAuthenticated: isValid, id: req.user.id });
  }
  return res.send({ isAuthenticated: isValid, id: false });
});

app.listen(5000, () => {
  console.log("execute on port 5000");
});
