const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Welcome to the server",
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(` server is up and running, listening on port ${port}`);
});
