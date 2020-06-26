
const express = require("express");
const bcrypt = require("bcryptjs");
const handleErr = require("../commonUtils").handleErr;
const User = require("../models/userModel");
const router = express.Router();

// User create
// suppose username is unique
router.post("/api/signup", (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hash;
  User.findOne({ username: req.body.username }, (err, user) => {
    if (user) res.json({ msg: "Username exists", status: 409 });
    else {
      let newUser = new User(req.body);
      newUser.save((err) => {
        if (err) return handleErr(err, res);
        res.json({ msg: "User created", status: 200 });
      });
    }
  });
});

// User login
router.post("/api/login", (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return handleErr(err, res);
    if (!user) {
      return res.json({ msg: "Username does not exist", status: 401 });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.json({ msg: "Password is invalid", status: 401 });
    }
    res.json({ msg: "login success.", status: 200 });
  });
});

// List all users
router.get("/api/user", (req, res) => {
  User.find((err, users) => {
    if (err) return handleErr(err, res);
    res.json({ data: users, status: 200 });
  });
});

// Get user by username
router.get("/api/user/:username", (req, res) => {
  User.findOne({ username: req.params.username }, (err, user) => {
    if (err) return handleErr(err, res);
    if (user) return res.json({ data: user, status: 200 });
    else return res.json({ msg: "User not found", status: 204 });
  });
});

// Update stop by stop_id
router.put("/api/user", (req, res) => {
  let update = {};
  for (let [key, value] of Object.entries(req.body.data)) {
    update[key] = key === "password" ? bcrypt.hashSync(value, 10) : value;
  }
  console.log(update);
  User.updateOne(
    { username: req.body.username },
    { $set: update },
    (err, raw) => {
      if (err) return handleErr(err, res);
      if (raw.n == 0) res.json({ msg: "username not found.", status: 204 });
      else res.json({ msg: "User updated.", status: 200, data: update });
    }
  );
});

// Delete all users
router.delete("/api/user", (req, res) => {
  User.deleteMany({}, (err) => {
    if (err) return handleErr(err, res);
    res.json({ msg: "All users deleted.", status: 200 });
  });
});

// Delete user by username
router.delete("/api/user/:username", (req, res) => {
  User.deleteOne({ username: req.params.username }, (err) => {
    if (err) return handleErr(err, res);
    return res.json({ msg: "User deleted.", status: 200 });
  });
});

module.exports = router;
