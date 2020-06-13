const express = require("express");
const morgan = require("morgan");
const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ROUTERS
app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Welcome to the server",
  });
});

app.use(express.json());

module.exports = app;
