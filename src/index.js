const express = require("express");
const cors = require("cors");
const app = express();
const passport = require("passport");
const session = require("express-session");
const mysqlStore = require("express-mysql-session")(session);
const dotenv = require("dotenv");
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
const commentRoute = require("./routes/comments");

//MiddleWare
app.use(
  session({
    secret: "LASDNFOLIUASNDFKSABDFBASDFASDF",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: TWO_HOURS,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const corsConfig = {
  origin: ["http://localhost:3000", "https://blogcity.netlify.app"],
  credentials: true,
  allowedHeaders: "X-Requested-With, Content-Type, Accept",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(express.static(__dirname));
app.use("/Images", express.static("Images"));
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(blogsRoute);
app.use(usersRoute);
app.use(commentRoute);

app.get("/", (req, res) => {
  res.send(JSON.stringify("Go to a specific route to use this api"));
});

app.get("/api/isAuth", (req, res) => {
  const isValid = req.isAuthenticated();
  console.log(req);

  if (isValid) {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ isAuthenticated: isValid, id: req.user.id })
    );
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  return res.end(JSON.stringify({ isAuthenticated: isValid, id: false }));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`execute on port ${PORT}`);
});
