
const express = require("express");
const BusRoute = require("../models/routeModel");
const Stop = require("../models/stopModel");
const User = require("../models/userModel");
const fetchRoute = require("../commonUtils").fetchRoute;
const fetchStop = require("../commonUtils").fetchStop;
const handleErr = require("../commonUtils").handleErr;
const router = express.Router();

//Create route
router.post("/api/route", async (req, res) => {
  let stops = await fetchRoute("CTB", req.body.route_id);
  Promise.all(
    stops.map((stop) => {
      return new Promise((resolve) => {
        fetchStop(stop, "CTB", () => {
          resolve();
        });
      });
    })
  ).then(() => {
    res.json({ msg: "Route created.", status: 200 });
  });
});

// List all routes
router.get("/api/route", (req, res) => {
  BusRoute.find((err, routes) => {
    if (err) return handleErr(err, res);
    res.json({ data: routes, status: 200 });
  });
});

// Get route by route_id & direction
router.get("/api/route/:route_id/:direction", (req, res) => {
  BusRoute.findOne(
    {
      $and: [{ route_id: req.params.route_id }, { dir: req.params.direction }],
    },
    (err, route) => {
      if (err) return handleErr(err, res);
      if (route) return res.json({ data: route, status: 200 });
      else return res.json({ msg: "Route not found", status: 204 });
    }
  );
});

// Get route by stop_id
router.get("/api/stop/route/:stop_id", (req, res) => {
  Stop.findOne({ stop_id: req.params.stop_id }, (req, stop) => {
    if (stop) {
      BusRoute.find({ stops: { $in: stop.stop_id } }, (err, routes) => {
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

// Update route by route_id
// won't handle stops field update
router.put("/api/route", (req, res) => {
  let field = req.body.field;
  let value = req.body.value;
  if (field != "stops") {
    let update = {};
    update[field] = value;
    BusRoute.updateOne(
      { route_id: req.body.route_id },
      { $set: update },
      (err, raw) => {
        if (err) return handleErr(err, res);
        if (raw.n == 0) res.json({ msg: "route_id not found.", status: 204 });
        else res.json({ msg: "Route updated.", status: 200 });
      }
    );
  }
});

// Delete all routes
router.delete("/api/route", (req, res) => {
  BusRoute.deleteMany({}, (err) => {
    if (err) return handleErr(err, res);
    res.json({ msg: "All routes deleted.", status: 200 });
  });
});

// Delete route by route_id
router.delete("/api/route/:route_id", (req, res) => {
  BusRoute.deleteOne({ route_id: req.params.route_id }, (err) => {
    if (err) return handleErr(err, res);
    res.json({ msg: "Route deleted.", status: 200 });
  });
});

module.exports = router;
