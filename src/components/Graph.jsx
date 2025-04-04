import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Graph = () => {


  return (
    <>
      <Line
        data={
          {
            // x-axis
            labels: [1,2,3,4],

            // y-axis
            datasets: [
              {
                data: [3,4,5,6],
                label: "graph1",
                borderColor: 'red'
              },
              {
                data: [6,7,8,9],
                label: "graph2",
                borderColor: "green"
              }
            ]
          }
        }
      />
    </>
  )
}

export default Graph
