
const BusRoute = require("./models/routeModel");
const Stop = require("./models/stopModel");
const Routes = require("./models/routeModel");
const request = require("request");

//Fetch Route using Route API
function fetchRoute(company, route_id) {
  return new Promise((resolve) => {
    request(
      "https://rt.data.gov.hk/v1/transport/citybus-nwfb/route/" +
        company +
        "/" +
        route_id,
      async (error, response, body) => {
        if (error && response.statusCode !== 200) return handleErr(error);
        body = JSON.parse(body);
        let routeStops = [
          { stops: [], dir: "outbound" },
          { stops: [], dir: "inbound" },
        ];
        Promise.all(
          routeStops.map((routeStop) => {
            return new Promise(async (resolve) => {
              routeStop.stops = await fetchRouteStop(
                company,
                route_id,
                routeStop.dir
              );
              BusRoute.updateOne(
                { $and: [{ route_id: route_id }, { dir: routeStop.dir }] },
                {
                  route_id: route_id,
                  origin: body.data.orig_en,
                  destination: body.data.dest_en,
                  stops: routeStop.stops,
                  dir: routeStop.dir,
                },
                { upsert: true },
                (err, raw) => {
                  if (err) return handleErr(err);
                  resolve(routeStop.stops);
                }
              );
            });
          })
        ).then((stops) => {
          resolve(stops[0].merge(stops[1]).flat());
        });
      }
    );
  });
}

//GET Stop Information using Stop API
//Takes company id, route direction, route number and returns the stop information of the respective route
///v1/transport/citybus-nwfb/route-stop/CTB/1/inbound
function fetchRouteStop(company, route_id, direction) {
  return new Promise((resolve) => {
    request(
      "https://rt.data.gov.hk/v1/transport/citybus-nwfb/route-stop/" +
        company +
        "/" +
        route_id +
        "/" +
        direction,
      (error, response, body) => {
        if (error && response.statusCode !== 200) return handleErr(error);
        body = JSON.parse(body);
        let stops = [];
        body.data.map((datum) => {
          stops.push(datum.stop);
        });
        resolve(stops);
      }
    );
  });
}

function fetchStop(stop, company, callback) {
  request(
    "https://rt.data.gov.hk/v1/transport/citybus-nwfb/stop/" + stop,
    function (error, response, body) {
      if (error && response.statusCode !== 200) return handleErr(error);
      body = JSON.parse(body);
      let related_routes = [];
      Routes.find({ stops: body.data.stop }, (err, routes) => {
        if (err) return handleErr(err);
        if (!routes) {
          console.log(
            "StopID: " + body.data.stop + "did not match with any loaded routes"
          );
        } else {
          for (let route of routes) {
            related_routes.push(route.route_id);
          }
        }
        let update = {
          stop_id: body.data.stop,
          route_list: [],
          name: body.data.name_en,
          lat: body.data.lat,
          long: body.data.long,
        };
        for (let route of related_routes) {
          update.route_list.push({
            route_id: route,
            company: company,
          });
        }
        Stop.updateOne(
          { stop_id: body.data.stop },
          update,
          { upsert: true },
          (err, raw) => {
            if (err) return handleErr(err);
            callback();
          }
        );
      });
    }
  );
}

function handleErr(err, res) {
  if (arguments.length == 2) {
    res.status(500).json({ msg: err, status: 500 });
    console.log("\x1b[31m%s\x1b[47m", err);
  }
  if (arguments.length == 1) {
    console.log("\x1b[31m%s\x1b[47m", err);
  }
}

// merge 2 arrays without duplicates
Array.prototype.merge = function (x) {
  return this.concat(x.filter((item) => this.indexOf(item) < 0));
};

module.exports = {
  handleErr: handleErr,
  fetchRoute: fetchRoute,
  fetchRouteStop: fetchRouteStop,
  fetchStop: fetchStop,
};
