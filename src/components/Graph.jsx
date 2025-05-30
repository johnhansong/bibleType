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
import { useTheme } from "../context/themeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const Graph = ({graphData}) => {
  console.log("GRAPHDATA", graphData)
  const {theme} = useTheme()

  return (
    <>
      <Line
        data={
          {
            // x-axis
            labels: graphData.map(i=>i[0]),

            // y-axis
            datasets: [
              {
                data: graphData.map(i=>i[1]),
                label: "WPM",
                borderColor: theme.accent
              },
            ]
          }
        }
      />
    </>
  )
}

export default Graph
