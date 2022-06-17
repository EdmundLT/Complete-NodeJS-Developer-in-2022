//Import
const https = require("https");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const express = require("express");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const { verify } = require("crypto");
const cookieSession = require("cookie-session");
const port = 3000;
//.env init
require("dotenv").config();

const app = express();
const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

//Helmet init
app.use(helmet());

//initialize cookie session
app.use(
  cookieSession({
    name: "session",
    maxAge: 3600000 * 24,
    keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
  })
);
app.use(passport.initialize());
app.use(passport.session());

//Google auth config
const AUTH_OPTIONS = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

// Serialize & deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  //  User.findById(id).then(user =>{
  //     done(null.user);
  //  });
  done(null, id);
});

//Callback
function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("Google profile", profile);
  done(null, profile);
}

//Login Checking funciton
function chkLogin(req, res, next) {
  console.log("Current User is: ", req.user);
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({ error: "You must login" });
  }
  next();
}

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
  }),
  (req, res) => {
    console.log("Google called us back!");
  }
);

app.get("/auth/logout", (req, res) => {
    req.logout();
    return res.redirect('/');
});

//index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//secret
app.get("/secret", chkLogin, (req, res) => {
  return res.send("Your personal secret is here!");
});

//res login error
app.get("/failure", (req, res) => {
  return res.send("Failed to login!");
});

// server config
https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
