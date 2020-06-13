const app = require("./app");

const port = 3000;

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Welcome to the server",
  });
});

app.listen(port, () => {
  console.log("app is running and listening");
});
