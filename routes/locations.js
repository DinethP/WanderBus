
const express = require("express");
const xmlparser = require("express-xml-bodyparser");
const xmljs = require("xml-js");
const router = express.Router();
const handleErr = require("../commonUtils").handleErr;
const Stop = require("../models/stopModel");
// const PORT = 2053;
const PORT = 5000;
// const URL = "http://csci2720.cse.cuhk.edu.hk/";
const URL = "http://localhost";

const OPTION = { compact: true };

router.use(xmlparser());

// add a new location
router.post("/api/locations", (req, res) => {
  res.type("application/xml");
  if (req.headers.authorization != "Bearer csci2720")
    return res
      .status(401)
      .send(xmljs.json2xml({ msg: "no location updated" }, OPTION));
  let json = {
    stop_id: req.body.location.id[0],
    name: req.body.location.name[0],
    lat: req.body.location.latitude[0],
    long: req.body.location.longitude[0],
  };
  const loc = new Stop(json);
  loc.save((err, product) => {
    if (err) return handleErr(err, res);
    res.setHeader(
      "Location",
      URL + ":" + PORT + "/api/locations/" + req.body.location.id[0]
    );
    console.log(product);
    res.send(xmljs.json2xml({ location: json }, OPTION));
  });
});

// list all locations
router.get("/api/locations", (req, res) => {
  res.type("application/xml");
  if (req.headers.authorization != "Bearer csci2720")
    return res
      .status(401)
      .send(xmljs.json2xml({ msg: "no location updated" }, OPTION));
  Stop.find({}, (err, stops) => {
    if (err) return handleErr(err, res);
    res.send(xmljs.json2xml(toJSON(stops), OPTION));
  });
});

// retrieve a location
router.get("/api/locations/:loc_id", (req, res) => {
  res.type("application/xml");
  if (req.headers.authorization != "Bearer csci2720")
    return res
      .status(401)
      .send(xmljs.json2xml({ msg: "authorization failed" }, OPTION));
  Stop.find({ stop_id: req.params.loc_id }, (err, stops) => {
    if (err) return handleErr(err, res);
    res.send(xmljs.json2xml(toJSON(stops), OPTION));
  });
});

// update a location
router.put("/api/locations/:loc_id", (req, res) => {
  res.type("application/xml");
  if (req.headers.authorization != "Bearer csci2720")
    return res
      .status(401)
      .send(xmljs.json2xml({ msg: "no location updated" }, OPTION));
  let update = {
    stop_id: req.body.location.id[0],
    name: req.body.location.name[0],
    lat: req.body.location.latitude[0],
    long: req.body.location.longitude[0],
  };
  Stop.updateOne({ stop_id: req.params.loc_id }, update, (err, raw) => {
    if (err) return handleErr(err, res);
    if (raw.n == 0)
      res
        .status(204)
        .send(xmljs.json2xml({ msg: "no location updated" }, OPTION));
    else {
      res.setHeader(
        "Location",
        URL + ":" + PORT + "/api/locations/" + req.body.location.id[0]
      );
      res.send(xmljs.json2xml({ location: update }, OPTION));
    }
  });
});

// delete a location
router.delete("/api/locations/:loc_id", (req, res) => {
  res.type("application/xml");
  if (req.headers.authorization != "Bearer csci2720")
    return res
      .status(401)
      .send(xmljs.json2xml({ msg: "no location updated" }, OPTION));
  Stop.deleteOne({ stop_id: req.params.loc_id }, (err) => {
    if (err) return handleErr(err, res);
    else res.send(xmljs.json2xml({ msg: "deleted" }, OPTION));
  });
});

function toJSON(stops) {
  let json = { locations: { location: [] } };
  for (let stop of stops) {
    json.locations.location.push({
      id: stop.stop_id,
      name: stop.name,
      latitude: stop.lat,
      longitude: stop.long,
    });
  }
  return json;
}

module.exports = router;
