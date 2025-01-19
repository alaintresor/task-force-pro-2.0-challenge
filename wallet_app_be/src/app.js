import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import mongoConnect from "./config/db.config.js";
import corsOptions from "./utils/crosOptions.js";
import router from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// welcome message
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Wallet App API" });
});

mongoConnect();

app.use("/api/v1", router);

export default app;
