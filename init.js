
const handleErr = require("./commonUtils").handleErr;
const fetchRoute = require("./commonUtils").fetchRoute;
const fetchStop = require("./commonUtils").fetchStop;
const request = require("request");

const COMPANY = "CTB"; // get routes of this company
const LIMIT = 5; // get 10 routes in direction of inbound/outbound

//Fetch Route using Route API
function fetchRouteId(company, limit) {
  return new Promise((resolve) => {
    request(
      "https://rt.data.gov.hk/v1/transport/citybus-nwfb/route/" + company,
      (error, response, body) => {
        if (error && response.statusCode !== 200) return handleErr(error);
        body = JSON.parse(body);
        let routes = [];
        for (let i = 0; i < limit; i++) {
          routes.push(body.data[i].route);
        }
        resolve(routes);
      }
    );
  });
}

async function initData(callback) {
  console.log(
    "\x1b[33m%s\x1b[0m",
    "getting first " + LIMIT + " " + COMPANY + " route_id..."
  );
  let routes = await fetchRouteId(COMPANY, LIMIT);
  let stops = [];
  console.log("\x1b[33m%s\x1b[0m", "getting route data...");
  for (let route of routes) {
    stops = [...stops, ...(await fetchRoute("CTB", route))];
  }
  console.log("\x1b[33m%s\x1b[0m", "getting stop data...");
  Promise.all(
    stops.map((stop) => {
      return new Promise((resolve) => {
        fetchStop(stop, COMPANY, () => {
          resolve();
        });
      });
    })
  ).then(() => {
    console.log("\x1b[33m%s\x1b[0m", "Initiation success");
    callback();
  });
}

module.exports = { initData };
