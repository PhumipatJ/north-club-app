import React, { useEffect, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";

import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, ArcElement, BarElement } from "chart.js";
import supabaseService from "../../service/supabaseService";
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, ArcElement, BarElement, Tooltip);
import Loading from "../loading";
const Stat = () => {
  const supabase = supabaseService.getClient();
  const [event,setEvent] = useState([]);
  const [userlist,setUser] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  useEffect(()=>{
    const fetchEvent =async()=>{
      const {data,error} = await supabase
      .from("event")
      .select("club_id ,start_date,clubs (club_type)")
      .eq("approval_status",true)

      if(error){
        console.log(error);
      }
      else{
        setEvent(data);
        setTimeout(() => {
          setLoading1(false);
        }, 500);
      }
    }
    fetchEvent();
  },[])
  useEffect(()=>{
    const fetchStudent = async()=>{
      const{data,error} = await supabase
      .from("user")
      .select("admission_year")
      .in("role",["student","club"])
      if(error){
        console.log(error);
      }
      else{
        setUser(data);
        
        setTimeout(() => {
          setLoading2(false);
        }, 500);
      }
    }
    fetchStudent();
  },[])
  const datecheck =(text)=>{
    const [,m] = text.split("/");
    return m;
  }
  const yearcheck = (text) =>{
    const current = new Date().getFullYear()+543;
    return current-parseInt(text);
  }
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "จำนวนกิจกรรม",
        data: [
          event.filter(item=>(datecheck(item.start_date) === "01")).length,
          event.filter(item=>(datecheck(item.start_date) === "02")).length,
          event.filter(item=>(datecheck(item.start_date) === "03")).length,
          event.filter(item=>(datecheck(item.start_date) === "04")).length,
          event.filter(item=>(datecheck(item.start_date) === "05")).length,
          event.filter(item=>(datecheck(item.start_date) === "06")).length,
          event.filter(item=>(datecheck(item.start_date) === "07")).length,
          event.filter(item=>(datecheck(item.start_date) === "08")).length,
          event.filter(item=>(datecheck(item.start_date) === "09")).length,
          event.filter(item=>(datecheck(item.start_date) === "10")).length,
          event.filter(item=>(datecheck(item.start_date) === "11")).length,
          event.filter(item=>(datecheck(item.start_date) === "12")).length,
          ],
        borderColor: "#7CE9BF",
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const labelColors = [
    { label: "นักศึกษาปี 1", color: "#FF6B6B", value: `${((userlist.filter(item =>(yearcheck(item.admission_year) === 1)).length/userlist.length)*100).toFixed(2)} %` },
    { label: "นักศึกษาปี 2", color: "#FF8E8E", value: `${((userlist.filter(item =>(yearcheck(item.admission_year) === 2)).length/userlist.length)*100).toFixed(2)} %` },
    { label: "นักศึกษาปี 3", color: "#FFCFCF", value: `${((userlist.filter(item =>(yearcheck(item.admission_year) === 3)).length/userlist.length)*100).toFixed(2)} %` },
    { label: "นักศึกษาปี 4", color: "#FFECEC", value: `${((userlist.filter(item =>(yearcheck(item.admission_year) === 4)).length/userlist.length)*100).toFixed(2)} %` },
    { label: "อื่นๆ", color: "#FFFFFF", value: `${((userlist.filter(item =>(yearcheck(item.admission_year) > 4 ||yearcheck(item.admission_year) < 1 )).length/userlist.length)*100).toFixed(2)} %` },
];

  const pieData = {
    labels: ["นักศึกษาปี 1", "นักศึกษาปี 2", "นักศึกษาปี 3", "นักศึกษาปี 4","อื่นๆ"],
    datasets: [
      {
        data: [
          userlist.filter(item =>(yearcheck(item.admission_year) === 1)).length,
          userlist.filter(item =>(yearcheck(item.admission_year) === 2)).length,
          userlist.filter(item =>(yearcheck(item.admission_year) === 3)).length,
          userlist.filter(item =>(yearcheck(item.admission_year) === 4)).length,
          userlist.filter(item =>(yearcheck(item.admission_year) > 4 ||yearcheck(item.admission_year) < 1)).length
        ],
        backgroundColor: ["#FF6B6B", "#FF8E8E", "#FFCFCF", "#FFECEC","#FFFFFF"],
        hoverBackgroundColor: ["#FF4A4A", "#FF7373", "#FFBDBD", "#FFDADA","#FFFFFA"],
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
        data: [
          event.filter(item=>(item.clubs.club_type === "กีฬา")).length,
          event.filter(item=>(item.clubs.club_type === "อาสาและบำเพ็ญประโยชน์")).length, 
          event.filter(item=>(item.clubs.club_type === "วิชาการ")).length,
          event.filter(item=>(item.clubs.club_type === "ศิลปะและวัฒนธรรม")).length],
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
  if(loading1||loading2){
    return(
      <div>
        <Loading/>
        <div className="h-[100vh]"></div>
      </div>
    )
  }
  return (
    <div className="bg-gray-50 flex justify-center">
        <div className="max-w-5xl w-full">
            <h1 className="text-2xl font-bold text-left mt-24">
            ข้อมูลวิเคราะห์กิจกรรม
            </h1>
            <div className="flex flex-col md:flex-row w-full justify-center px-6 m-8">
                <div className="flex-1 flex flex-col max-w-2xl w-full">
                    <div className="flex flex-row items-center justify-between mb-6">
                      
                      <div className="w-full p-4 bg-white rounded-xl shadow">
                        <p className="text-gray-500">จำนวนกิจกรรม</p>
                        <h2 className="text-3xl font-bold text-[#FF7E69] text-center">{event.length}</h2>
                      </div>
                    </div>
                  <div className="bg-white rounded-xl shadow p-4 flex flex-col">
                    <h2 className="text-gray-600 font-bold text-lg">นักศึกษาที่สังกัดชมรม</h2>
                    <div className="items-center text-gray-500 text-right">
                        <p className="text-gray-500 mt-2">ทั้งหมด <span className="text-[#FF7E69] font-bold text-3xl">
                          {userlist.length}
                          </span>
                        </p>
                    </div>
                    <div className="flex flex-row justify-between items-center max-w-2xl">
                      <div className="w-1/2">
                      <Doughnut data={pieData} />
                      </div>
                        <div className="flex flex-col gap-4">
                          {labelColors.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-right">
                              <span className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: item.color }}
                              ></span>
                                <p className="text-sm text-gray-600">{item.label}</p>
                                <p className="text-sm font-bold text-gray-700 ml-auto">{item.value}</p>
                            </div>
                             ))}
                        </div>
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