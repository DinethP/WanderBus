
const express = require("express");
const multer = require("multer");
const csv = require("fast-csv");
const upload = multer({ dest: "csv/" });
const handleErr = require("../commonUtils").handleErr;
const Stop = require("../models/stopModel");
const BusRoute = require("../models/routeModel");
const router = express.Router();

// Create stop by uploading csv
router.post("/api/stop/csv", upload.single("csv"), (req, res) => {
  let dataRows = [];
  csv
    .parseFile(req.file.path)
    .on("data", (data) => {
      dataRows.push(data);
    })
    .on("end", async () => {
      dataRows.splice(0, 1);
      let array = new Array(dataRows.length).fill(false);
      for (let i = 0; i < dataRows.length && !array[i]; i++) {
        const row = dataRows[i];
        row[4] = row[4].replace("[", "");
        row[4] = row[4].replace("]", "");
        array[i] = await new Promise((resolve2) => {
          Promise.all(
            row[4].split(";").map((route) => {
              const route_id = route.split("+")[0];
              const dir = route.split("+")[1];
              return new Promise((resolve) => {
                BusRoute.findOne(
                  { route_id: route_id, dir: dir },
                  (err, routeDoc) => {
                    if (err) return handleErr(err, res);
                    if (routeDoc) {
                      BusRoute.update(
                        { route_id: route_id, dir: dir },
                        { $push: { stops: row[0] } },
                        (err, raw) => {
                          if (err) return handleErr(err, res);
                          if (raw.n == 0)
                            res.json({ msg: "route not found", status: 204 });
                          else resolve();
                        }
                      );
                    } else {
                      BusRoute.update(
                        { route_id: route_id, dir: dir },
                        {
                          route_id: route_id,
                          dir: dir,
                          stops: [row[0]],
                          company: "CTB",
                        },
                        { upsert: true },
                        (err, raw) => {
                          if (err) return handleErr(err, res);
                          if (raw.n == 0)
                            res.json({ msg: "route not found", status: 204 });
                          else resolve();
                        }
                      );
                    }
                  }
                );
              });
            })
          ).then(() => {
            Stop.update(
              { stop_id: row[0] },
              {
                stop_id: row[0],
                name: row[1],
                lat: row[2],
                long: row[3],
              },
              { upsert: true },
              (err, raw) => {
                if (err) return handleErr(err, res);
                if (raw.n == 0)
                  res.json({ msg: "stop not found", status: 204 });
                else resolve2(true);
              }
            );
          });
        });
      }
      if (array.every((x) => x == true))
        res.json({ msg: "Stops created.", status: 200 });
      else res.json({ msg: "Stops not created.", status: 204 });
    });
});

// Create stop
router.post("/api/stop", (req, res) => {
  Promise.all(
    req.body.routes.map((route) => {
      return new Promise((resolve) => {
        BusRoute.findOne(
          { route_id: route.route_id, dir: route.dir },
          (err, routeDoc) => {
            if (err) return handleErr(err, res);
            if (routeDoc) {
              BusRoute.update(
                { route_id: route.route_id, dir: route.dir },
                { $push: { stops: route.stop_id } },
                (err, raw) => {
                  if (err) return handleErr(err, res);
                  if (raw.n == 0)
                    res.json({ msg: "route not found", status: 204 });
                  else resolve();
                }
              );
            } else {
              BusRoute.update(
                { route_id: route.route_id, dir: route.dir },
                {
                  route_id: route.route_id,
                  dir: route.dir,
                  stops: [req.body.stop_id],
                  company: "CTB",
                },
                { upsert: true },
                (err, raw) => {
                  if (err) return handleErr(err, res);
                  if (raw.n == 0)
                    res.json({ msg: "route not found", status: 204 });
                  else resolve();
                }
              );
            }
          }
        );
      });
    })
  ).then(() => {
    Stop.update(
      { stop_id: req.body.stop_id },
      {
        stop_id: req.body.stop_id,
        name: req.body.name,
        lat: req.body.lat,
        long: req.body.long,
      },
      { upsert: true },
      (err, raw) => {
        if (err) return handleErr(err, res);
        if (raw.n == 0) res.json({ msg: "stop not found", status: 204 });
        else res.json({ msg: "Stop created", status: 200 });
      }
    );
  });
});

// List all stops
router.get("/api/stop", (req, res) => {
  Stop.find((err, stops) => {
    if (err) return handleErr(err, res);
    res.json({ data: stops, status: 200 });
  });
});

// Get stop by stop_id
router.get("/api/stop/:stop_id", (req, res) => {
  Stop.findOne({ stop_id: req.params.stop_id }, (err, stop) => {
    if (err) return handleErr(err, res);
    if (stop) return res.json({ data: stop, status: 200 });
    else return res.json({ msg: "Stop not found", status: 204 });
  });
});

// Get stop by route_id
router.get("/api/route/stop/:route_id", (req, res) => {
  BusRoute.findOne({ route_id: req.params.route_id }, (req, route) => {
    if (route) {
      Stop.find({ stop_id: { $in: route.stops } }, (err, stops) => {
        if (err) return handleErr(err, res);
        let data = [];
        for (let stop of stops) {
          data.push(stop);
        }
        res.json({ data: data, status: 200 });
      });
    } else res.json({ msg: "Route not found", status: 204 });
  });
});

// Update stop by stop_id
router.put("/api/stop", (req, res) => {
  let update = {
    stop_id: req.body.data.stop_id,
    name: req.body.data.name,
    lat: req.body.data.lat,
    long: req.body.data.long,
  };
  Stop.updateOne(
    { stop_id: req.body.stop_id },
    { $set: update },
    (err, raw) => {
      if (err) return handleErr(err, res);
      if (raw.n == 0) res.json({ msg: "stop_id not found.", status: 204 });
      else res.json({ msg: "Stop updated.", status: 200 });
    }
  );
});

// Delete all stops
router.delete("/api/stop", (req, res) => {
  Stop.deleteMany({}, (err) => {
    if (err) return handleErr(err, res);
    res.json({ msg: "All stops deleted.", status: 200 });
  });
});

// Delete stop by stop_id
router.delete("/api/stop/:stop_id", (req, res) => {
  Stop.deleteOne({ stop_id: req.params.stop_id }, (err) => {
    if (err) return handleErr(err, res);
    res.json({ msg: "Stop deleted.", status: 200 });
  });
});

module.exports = router;
