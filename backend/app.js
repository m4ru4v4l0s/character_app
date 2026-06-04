const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const characterRoutes = require("./routes/characterRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Rutas SIEMPRE al final
app.use("/auth", authRoutes);
app.use("/characters", characterRoutes);
app.use("/chat", chatRoutes);

app.get("/", (req, res) => res.json({ message: "API funcando 🔥" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));