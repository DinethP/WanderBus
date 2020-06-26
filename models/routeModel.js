
const mongoose = require("mongoose");

let busRoute = new mongoose.Schema({
  route_id: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  stops: [{ type: String }],
  dir: { type: String },
});

let BusRoute = mongoose.model("Route", busRoute);

module.exports = BusRoute;
