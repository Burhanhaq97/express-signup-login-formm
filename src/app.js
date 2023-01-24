require("dotenv").config();
const express = require("express");
const app = express();
require("./db/connection");
const port = process.env.PORT || 80;
const router = require("./Routers/formRoute");
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");

// folders paths
const publicPath = path.join(__dirname, "../public/");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(router);
app.use(express.static(publicPath));
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

app.listen(port, () => console.log("express listening on port " + port));
