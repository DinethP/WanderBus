
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const init = require("./init").initData;
const app = express();
const handleErr = require("./commonUtils").handleErr;
const PORT = process.env.PORT || 5000;


// const dbUri = process.env.MONGODB_URI;
const dbUri = 'mongodb+srv://Enigma29:Youtube321%23@cluster0-nck9p.mongodb.net/<dbname>?retryWrites=true&w=majority';

mongoose.connect(dbUri, { useNewUrlParser: true }).then(() => {
  init(() => {
    console.log("Listening on port: " + PORT);
  });
});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function () {
  console.log("Connection is open...");
});

// flush data
app.post("/api/flush", (req, res) => {
  console.log("Flushing data");
  init(() => {
    console.log("Data flushed");
    res.json({ msg: "Reloaded from online data set.", status: 200 });
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const userRouter = require("./routes/user.js");
const stopRouter = require("./routes/stop.js");
const busRouteRouter = require("./routes/busRoute.js");
const favRouter = require("./routes/favourite.js");
const cmtRouter = require("./routes/comment.js");
const etaRouter = require("./routes/eta.js");

const locationRouter = require("./routes/locations.js");
app.use(locationRouter);

app.use(userRouter);
app.use(stopRouter);
app.use(busRouteRouter);
app.use(favRouter);
app.use(cmtRouter);
app.use(etaRouter);


if(process.env.NODE_ENV === 'Production'){
  app.use(express.static('../frontend/build'))
}

//Serving the react frontend on Heroku
app.use(express.static(path.join(__dirname, "frontend", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

app.listen(PORT);



