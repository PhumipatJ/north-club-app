import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Clock3 } from "lucide-react";
import supabaseService from "../service/supabaseService";

const EventList = ({ id, clubName }) => {
  const supabase = supabaseService.getClient();
  const [eventData, setEventData] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";
    const monthsInThai = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
  
    const [day, month, year] = dateString.split("/").map(Number); // Extract DD, MM, YYYY
  
    return `${day} ${monthsInThai[month - 1]} ${year}`;
  };

  const isEventExpired = (endDate, endTime) => {
    const [day, month, year] = endDate.split("/").map(Number);
    const [hours, minutes] = endTime.split(":").map(Number);
    
    const eventEndDateTime = new Date(year, month - 1, day, hours, minutes); // Convert to Date object
    const now = new Date(); 
    
    return now > eventEndDateTime; 
  };
  

  useEffect(() => {
      const fetchEventtData = async () => {
        const { data, error } = await supabase
          .from("event")
          .select("*")
          .eq("id", id)
          .single()
    
        if (error) {
          console.error("Error fetching club data:", error);
        } 
        else {
          //console.log(data);
          setEventData(data);
        }
      };
    
      fetchEventtData();
    }, [id]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex gap-4">
      {/* First Column - Image */}
      <div className="flex-shrink-0">
        <img src={`${supabase.storage.from("club-avatars").getPublicUrl(eventData.poster).data.publicUrl}`} 
        alt="กิจกรรม" className="w-40 aspect-w-4 aspect-h-5 rounded-lg object-cover" />
      </div>

      {/* Second Column - Description and Button */}
      <div className="flex flex-col justify-between flex-grow">
        {/* First Row - Description */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">{eventData.title}</h2>
          <p className="text-gray-500">{clubName}</p>
          <div className="flex items-center gap-2 mt-4">
            <MapPin size={24} color="black" />
            <span>สถานที่จัดกิจกรรม : หอประชุมเบญจรัตน์</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Clock3 size={24} color="black" />
            <p> เวลา : {formatDate(eventData.start_date)} {eventData.start_time} - {eventData.end_time} น.</p>
           </div>
        </div>

        {/* Second Row - Button */}
        <div className="flex justify-end mt-auto">
            {eventData && eventData.start_date && eventData.end_time ? (
            isEventExpired(eventData.start_date, eventData.end_time) ? (
                <button className="bg-gray-400 text-white px-4 py-2 rounded-lg" disabled>
                กิจกรรมหมดเวลา
                </button>
            ) : (
                <button className="bg-[#7CE9BF] text-white px-4 py-2 rounded-lg">สนใจ</button>
            )
            ) : (
                <button className="bg-[#7CE9BF] text-white px-4 py-2 rounded-lg">สนใจ</button>
            )}
            
            <button className="bg-[#FF7E69] text-white px-4 py-2 rounded-lg ml-4">รายละเอียด</button>
        </div>
      </div>
    </div>

  );
};

  export default EventList;