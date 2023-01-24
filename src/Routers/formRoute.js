const router = require("express").Router();
const User = require("../db/module");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

const cookieParser = require("cookie-parser");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/secret", auth, (req, res) => {
  res.render("secret");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, conform_password } = req.body;

    if (password === conform_password) {
      const signupUser = new User({
        name,
        email,
        password,
        conform_password,
      });
      const token = await signupUser.generateToken();
      console.log(token);
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 90000000),
        httpOnly: true,
      });
      console.log(cookie);
      await signupUser.save();
      res.status(201).render("index");
    } else {
      res.render("signup", { error: "password are not matching" });
    }
  } catch (error) {
    res.render("signup", { error: "inter valid details" });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const dataBaseEmail = await User.findOne({ email: email });
    if (dataBaseEmail) {
      const matchPassword = await bcrypt.compare(
        password,
        dataBaseEmail.password
      );
      if (matchPassword) {
        const token = await dataBaseEmail.generateToken();
        res.cookie("jwt", token, {
          expires: new Date(Date.now() + 90000000),
          httpOnly: true,
        });
        res.render("index", { name: dataBaseEmail.name });
      } else {
        res.status(404).render("login", { error: "wrong password" });
      }
    } else {
      res.status(404).render("login", { error: "wrong email" });
    }
  } catch (error) {
    res.status(404).render("login", { error: "wrong email or password" });
    console.log(error);
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((dataBaseToken) => {
      return dataBaseToken !== req.token;
    });
    res.clearCookie("jwt");
    await req.user.save();
    res.render("login");
  } catch (error) {
    res.render("login");
  }
});

module.exports = router;
