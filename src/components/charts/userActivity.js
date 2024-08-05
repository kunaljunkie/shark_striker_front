import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend);

const UserActivityChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Successful Logins',
        data: data.map(item => item.success),
        backgroundColor: 'rgba(75,192,192,1)',
      },
      {
        label: 'Failed Logins',
        data: data.map(item => item.failed),
        backgroundColor: 'rgba(255,99,132,1)',
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default UserActivityChart;
