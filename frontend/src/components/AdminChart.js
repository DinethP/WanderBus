

import React, { useState, useContext, useEffect } from "react";
import { HorizontalBar } from "react-chartjs-2";
import userContext from "../state/UserContext";

const AdminChart = (props) => {
  const userCtx = useContext(userContext);

  var labellist = [];
  var valuelist = [];

  const [dataset, setData] = useState({
    chartData: {
      labels: labellist,
      datasets: [
        {
          label: "Total Number of Comments",
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
  const numSort = (a, b) => {
    return a - b;
  };

  useEffect(() => {
    userCtx.getAllUsers().then((users) => {
      if (users) {
        users.sort((a, b) => numSort(a.comments.length, b.comments.length));
        users.reverse();

        if (users[0] && users[0].comments.length !== 0) {
          valuelist.push(users[0].comments.length);
          labellist.push(users[0].username);
          if (users[1] && users[1].comments.length !== 0) {
            valuelist.push(users[1].comments.length);
            labellist.push(users[1].username);
            if (users[2] && users[2].comments.length !== 0) {
              valuelist.push(users[2].comments.length);
              labellist.push(users[2].username);
              if (users[3] && users[3].comments.length !== 0) {
                valuelist.push(users[3].comments.length);
                labellist.push(users[3].username);
                if (users[4] && users[4].comments.length !== 0) {
                  valuelist.push(users[4].comments.length);
                  labellist.push(users[4].username);
                }
              }
            }
          }
        }
        setData({
          chartData: {
            labels: labellist,
            datasets: [
              {
                label: "Total Number of Comments",
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
      } else console.log("ERROR");
    });
  }, []);

  return (
    <div className="row">
      <div className="justify-content-center col">
        <HorizontalBar
          data={dataset.chartData}
          options={{
            title: {
              display: true,
              text: "TOP 5 Users with Highest Comment Activity",
              fontSize: 14,
              position: "right",
            },
            legend: {
              display: false,
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
            }
          }}
        />
      </div>
    </div>
  );
};
export default AdminChart;
