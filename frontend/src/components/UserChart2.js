
import React, { useState } from "react";
import { HorizontalBar } from "react-chartjs-2";
import {Bar} from "react-chartjs-2";

const UserChart2 = (props) => {
  var locs = props.locations;

  const numSort = (a, b) => {
    return a - b;
  };

  const sortByFavourites = () => {
    props.locations.sort((a, b) => numSort(a.favourite, b.favourite));
  };

  sortByFavourites();
  locs = locs.reverse();
  var labellist2 = [];
  var valuelist2 = [];
  if (locs[0].favourite !== 0) {
    valuelist2.push(locs[0].favourite);
    labellist2.push(locs[0].name);
    if (locs[1].favourite !== 0) {
      valuelist2.push(locs[1].favourite);
      labellist2.push(locs[1].name);
      if (locs[2].favourite !== 0) {
        valuelist2.push(locs[2].favourite);
        labellist2.push(locs[2].name);
        if (locs[3].favourite !== 0) {
          valuelist2.push(locs[3].favourite);
          labellist2.push(locs[3].name);
          if (locs[4].favourite !== 0) {
            valuelist2.push(locs[4].favourite);
            labellist2.push(locs[4].name);
          }
        }
      }
    }
  }

  const [dataset2] = useState({
    chartData: {
      labels: labellist2,
      datasets: [
        {
          label: "Total Number of Favourites",
          data: valuelist2,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
        },
      ],
    },
  });

  return (
    <div className="row">
      <div className="justify-content-center col">
      
        <HorizontalBar
          data={dataset2.chartData}
          options={{
           responsive: true,
            title: {
              display: true,
              text: "TOP 5 Most Favorited Locations By All Users",
              fontSize: 16,
              position: "top",
            },
            legend: {
              display: false,
              position: "bottom",
              align: "center",
            },
            scales: {
              xAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    stepSize: 1,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: "Total Number of Favorites",
                  },
                },
              ],
            },
            layout: {
              padding: {
                left: 0,
              },
            },
          }}
        />
      </div>
    </div>
  );
};
export default UserChart2;
