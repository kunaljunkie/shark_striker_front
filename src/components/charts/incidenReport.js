import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const IncidentReportsChart = ({ data }) => {
  const chartData = {
    labels: ['Resolved', 'In Progress', 'Open'],
    datasets: [
      {
        data: [data.resolved, data.inProgress, data.open],
        backgroundColor: [
          'rgba(75,192,192,1)',
          'rgba(255,206,86,1)',
          'rgba(255,99,132,1)',
        ],
        hoverBackgroundColor: [
          'rgba(75,192,192,0.7)',
          'rgba(255,206,86,0.7)',
          'rgba(255,99,132,0.7)',
        ],
      },
    ],
  };

  return <Doughnut data={chartData} />;
};

export default IncidentReportsChart;
