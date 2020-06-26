
const mongoose = require("mongoose");

let stop = new mongoose.Schema({
  stop_id: { type: String, required: true },
  route_list: [
    {
      route_id: { type: String, required: true },
      company: { type: String, required: true },
    },
  ],
  name: { type: String, required: true },
  lat: { type: String, required: true },
  long: { type: String, required: true },
  comments: [
    {
      username: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  favourite: { type: Number, required: true, default: 0 },
});

let Stop = mongoose.model("Stop", stop);

module.exports = Stop;
