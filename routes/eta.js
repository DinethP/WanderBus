
const express = require("express");
const request = require("request");
const BusRoute = require("../models/routeModel");
const handleErr = require("../commonUtils").handleErr;
const router = express.Router();

function fetchETA(company, stop, route) {
  return new Promise((resolve, reject) => {
    request(
      "https://rt.data.gov.hk/v1/transport/citybus-nwfb/eta/" +
        company +
        "/" +
        stop +
        "/" +
        route,
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          eta_list = [];
          for (let datum of body.data) {
            let now = new Date();
            let eta_time = new Date(datum.eta);

            diff_ms = eta_time - now;
            diff_mins = Math.round(((diff_ms % 86400000) % 3600000) / 60000); //This won't work if difference is greater than 60mins
            eta_list.push(diff_mins);
          }
          eta_list.sort((a, b) => a - b); //The eta_list can have upto 3 eta's
          resolve(eta_list);
        } else {
          reject("API did not respond");
        }
      }
    );
  });
}

// GET ETA by comapny_id & stop_id & route_id
// GET upto 3 eta (in minutes)
router.get("/api/eta/:company/:stop_id/:route_id", async (req, res) => {
  let data = [];
  try {
    let eta = await fetchETA(
      req.params.company,
      req.params.stop_id,
      req.params.route_id
    );
    data.push({
      stop_id: req.params.stop_id,
      route_id: req.params.route_id,
      eta: eta,
    });
    res.json({ data: data, status: 200 });
  } catch (e) {
    res.send(e); //prints out reject promise string
  }
});

//Find eta's to stop_id from all related route_id's (in minutes)
router.get("/api/eta/:company/:stop_id", (req, res) => {
  try {
    BusRoute.find({ stops: req.params.stop_id }, async (err, routes) => {
      if (err) return handleErr(err);
      if (routes.length != 0) {
        let data = [];
        for (let route of routes) {
          let eta = await fetchETA(
            req.params.company,
            req.params.stop_id,
            route.route_id
          );
          data.push({
            stop_id: req.params.stop_id,
            route_id: route.route_id,
            eta: eta,
          });
        }
        res.json({ data: data, status: 200 });
      } else res.json({ msg: "Stop_id not found", status: 204 });
    });
  } catch (e) {
    res.send(e); //prints out reject promise string
  }
});

module.exports = router;
