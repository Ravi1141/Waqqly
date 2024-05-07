const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/users/login");
});

app.use("/users", proxy("http://users:3000"));
app.use("/walkers", proxy("http://walkers:3000"));
app.use("/bookings", proxy("http://bookings:3000"));

app.listen(3000, () => {
  console.log("Gateway is Listening to Port 3000");
});
