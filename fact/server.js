require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
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
app.use(express({ extended: true }));

//db should connect here
require("./config/db");

//routes should go here
app.use("/api", require("./routes/api"));

//handle error middleware here
app.use(require("./middlewares/errorHandler"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port $(PORT)`);
});
