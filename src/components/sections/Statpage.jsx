import React from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";

import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, ArcElement, BarElement } from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale,  ArcElement, BarElement);

const Stat = () => {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "จำนวนกิจกรรม",
        data: [5000, 12000, 8000, 20000, 25000, 18000, 22000],
        borderColor: "#7CE9BF",
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "จำนวนผู้เข้าร่วมกิจกรรม",
        data: [8000, 15000, 11000, 23000, 27000, 24000, 30000],
        borderColor: "#f87171",
        borderDash: [5, 5],
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const pieData = {
    labels: ["นักศึกษาปี 1", "นักศึกษาปี 2", "นักศึกษาปี 3", "อื่นๆ"],
    datasets: [
      {
        data: [52.1, 22.8, 13.9, 11.2],
        backgroundColor: ["#FF6B6B", "#FF8E8E", "#FFCFCF", "#FFECEC"],
        hoverBackgroundColor: ["#FF4A4A", "#FF7373", "#FFBDBD", "#FFDADA"],
        borderWidth: 0, // Remove default borders
        cutout: "60%", // Make it look like a ring
      },
    ],
  };
  
  const barData = {
    labels: ["กีฬา", "อาสาฯ", "วิชาการ", "ศิลปะ"],
    datasets: [
      {
        label: "จำนวนกิจกรรม",
        data: [15, 8, 10, 12],
        backgroundColor: "#7CE9BF",
      },
    ],
    scales: { // Add this scales object
        x: { // Target the x-axis
          grid: {
            display: false // Hide the x-axis grid
          }
        },
        y: { // Target the y-axis
          grid: {
            display: false // Hide the y-axis grid
          }
        }
    }
  };

  const options = {
    plugins: {
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide grid lines for the x-axis
        },
      },
      y: {
        grid: {
          display: false, // Hide grid lines for the y-axis
        },
      },
    },
    hover: {
      mode: "nearest",
      intersect: false,
    },
  };

  return (
    <div className="bg-gray-50 flex justify-center">
        <div className="max-w-5xl w-full">
            <h1 className="text-2xl font-bold text-left mt-24">
            ข้อมูลวิเคราะห์กิจกรรม
            </h1>
            <div className="flex flex-col md:flex-row w-full justify-center px-6 m-8">
                <div className="flex-1 flex flex-col max-w-2xl w-full">
                    <div className="flex flex-row items-center justify-between mb-6">
                    <div className="w-48 p-4 bg-white rounded-xl shadow">
                        <p className="text-gray-500">จำนวนครั้งผู้เข้าเยี่ยมชม</p>
                        <h2 className="text-3xl font-bold text-[#FF7E69]">452</h2>
                    </div>
                    <div className="w-48 p-4 bg-white rounded-xl shadow">
                        <p className="text-gray-500">จำนวนกิจกรรม</p>
                        <h2 className="text-3xl font-bold text-[#FF7E69]">452</h2>
                    </div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4">
                        <div className="w-1/2">
                            <h2 className="text-gray-600 font-bold text-lg">นักศึกษาที่สังกัดชมรม</h2>
                            <p className="text-gray-500 text-sm text-right mt-2">ทั้งหมด <span className="text-[#FF6B6B] font-bold text-2xl">512</span></p>
                        </div>
                        <div className="w-1/2">
                            <Doughnut data={pieData} />
                        </div>  
                    </div>
                    <div className="mt-6 w-full bg-white p-6 rounded-xl shadow">
                        <h2 className="text-lg font-bold mb-4">หมวดหมู่กิจกรรม</h2>
                        <Bar data={barData} options={options} />
                    </div>
                </div>
                <div className="flex-1 md:max-w-3xl w-full h-fit bg-white p-6 rounded-xl shadow md:ml-6">
                    <h2 className="text-lg font-bold mb-4">กราฟกิจกรรม</h2>
                    <Line data={lineData} options={options} />
                </div>
            </div>
        </div>
    </div>

  );
};

export default Stat;