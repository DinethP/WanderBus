
const express = require("express");
const BusRoute = require("../models/routeModel");
const Stop = require("../models/stopModel");
const User = require("../models/userModel");
const handleErr = require("../commonUtils").handleErr;
const router = express.Router();

// Add favourite route by username & route_id
router.post("/api/favourite/route", (req, res) => {
  User.updateOne(
    { username: req.body.username },
    { $push: { fav_routes: req.body.route_id } },
    (err, raw) => {
      if (err) return handleErr(err, res);
      if (raw.n == 0) res.json({ msg: "Username not found", status: 204 });
      else {
        res.json({ msg: "User favourite udpated", status: 200 });
      }
    }
  );
});

// Add favourite stop by username & stop_id
router.post("/api/favourite/stop", (req, res) => {
  User.updateOne(
    { username: req.body.username },
    { $push: { fav_stops: req.body.stop_id } },
    (err, raw) => {
      if (err) return handleErr(err, res);
      if (raw.n == 0)
        return res.json({ msg: "Username not found.", status: 204 });
      else {
        Stop.updateOne(
          { stop_id: req.body.stop_id },
          { $inc: { favourite: 1 } },
          (err, raw) => {
            if (err) return handleErr(err, res);
            if (raw.n == 0)
              return res.json({ msg: "Stop_id not found.", status: 204 });
            else res.json({ msg: "User favorite updated.", status: 200 });
          }
        );
      }
    }
  );
});

//Get favourite routes by username
router.get("/api/favourite/route/:username", (req, res) => {
  User.findOne({ username: req.params.username }, (req, user) => {
    if (user) {
      BusRoute.find({ route_id: { $in: user.fav_routes } }, (err, routes) => {
        if (err) return handleErr(err, res);
        let data = [];
        for (let route of routes) {
          data.push(route);
        }
        res.json({ data: data, status: 200 });
      });
    } else res.json({ msg: "Route not found", status: 204 });
  });
});

//Get favourite stops by username
router.get("/api/favourite/stop/:username", (req, res) => {
  User.findOne({ username: req.params.username }, (req, user) => {
    if (user) {
      Stop.find({ stop_id: { $in: user.fav_stops } }, (err, stops) => {
        if (err) return handleErr(err, res);
        let data = [];
        for (let stop of stops) {
          data.push(stop);
        }
        res.json({ data: data, status: 200 });
      });
    } else res.json({ msg: "Stop not found", status: 204 });
  });
});

// Delete favourite route by username & route_id
router.delete("/api/favourite/route/:username/:route_id", (req, res) => {
  User.updateOne(
    { username: req.params.username },
    { $pull: { fav_routes: req.params.route_id } },
    (err, raw) => {
      if (err) return handleErr(err, res);
      if (raw.n == 0)
        res.json({ msg: "Username or route_id not found", status: 204 });
      else res.json({ msg: "User favourite udpated", status: 200 });
    }
  );
});

// Delete favourite stop by username & route_id
router.delete("/api/favourite/stop/:username/:stop_id", (req, res) => {
  User.updateOne(
    { username: req.params.username },
    { $pull: { fav_stops: req.params.stop_id } },
    (err, raw) => {
      if (err) return handleErr(err, res);
      if (raw.n == 0)
        res.json({ msg: "Username or stop_id not found", status: 204 });
      else {
        Stop.updateOne(
          { stop_id: req.params.stop_id },
          { $inc: { favourite: -1 } },
          (err, raw) => {
            if (err) return handleErr(err, res);
            if (raw.n == 0)
              res.json({ msg: "Username or stop_id not found", status: 204 });
            else res.json({ msg: "User favourite udpated", status: 200 });
          }
        );
      }
    }
  );
});

module.exports = router;
