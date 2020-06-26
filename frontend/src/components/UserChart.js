
import React, { useState } from "react";
import { HorizontalBar } from "react-chartjs-2";

const UserChart = (props) => {
  var locs = props.locations;

  const numSort = (a, b) => {
    return a - b;
  };

  const sortByComments = () => {
    props.locations.sort((a, b) =>
      numSort(a.comments.length, b.comments.length)
    );
  };

  sortByComments();
  locs = locs.reverse();
  var labellist = [];
  var valuelist = [];
  if (locs[0].comments.length !== 0) {
    valuelist.push(locs[0].comments.length);
    labellist.push(locs[0].name);
    if (locs[1].comments.length !== 0) {
      valuelist.push(locs[1].comments.length);
      labellist.push(locs[1].name);
      if (locs[2].comments.length !== 0) {
        valuelist.push(locs[2].comments.length);
        labellist.push(locs[2].name);
        if (locs[3].comments.length !== 0) {
          valuelist.push(locs[3].comments.length);
          labellist.push(locs[3].name);
          if (locs[4].comments.length !== 0) {
            valuelist.push(locs[4].comments.length);
            labellist.push(locs[4].name);
          }
        }
      }
    }
  }
  const [dataset] = useState({
    chartData: {
      labels: labellist,
      datasets: [
        {
          label: "Comment Count",
          data: valuelist,
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
          data={dataset.chartData}
          options={{
            responsive: true,
            title: {
              display: true,
              text: "TOP 5 Most Commented Locations By All Users",
              fontSize: 16,
              position: "top",
            },
            legend: {
              display: false,
              position: "bottom",
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
                    labelString: "Total Number of Comments",
                  },
                },
              ],
            },
            layout:{
              padding:{
                left: 0
              }
            }
          }}
        />
      </div>
    </div>
  );
};
export default UserChart;
