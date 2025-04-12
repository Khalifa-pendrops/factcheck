require("dotenv").config();
process.on("unhandledRejection", (err) => {
  console.error("unhandled Rejection! Shutting down...", err);
  process.exit(1);
});
const express = require("express");
// const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const winston = require("./utils/logger");

const app = express();

//middlewares should go here
app.use(cors());
app.use(helmet());
app.use(morgan("combined", { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./routes/api"));

app.use(require("./middlewares/errorHandler"));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await require("./config/db")();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server: 😞, err");
    process.exit(1);
  }
};

startServer();
