import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Clock3 } from "lucide-react";
import supabaseService from "../service/supabaseService";

const AnnouncementList = ({ id, clubName }) => {
  const supabase = supabaseService.getClient();
  const [announcementData, setAnnouncementData] = useState([]);

  const formatDate = (dateString) => {
    const monthsInThai = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
  
    const date = new Date(dateString);
    const day = date.getDate();
    const month = monthsInThai[date.getMonth()];
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
  };

  useEffect(() => {
      const fetchAnnouncementData = async () => {
        const { data, error } = await supabase
          .from("announcement")
          .select("*")
          .eq("id", id)
          .single()
    
        if (error) {
          console.error("Error fetching club data:", error);
        } 
        else {
          console.log(data);
          setAnnouncementData(data);
        }
      };
    
      fetchAnnouncementData();
    }, [id]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex gap-4">
      {/* First Column - Image */}
      <div className="flex-shrink-0">
        <img src={`${supabase.storage.from("club-avatars").getPublicUrl(announcementData.poster).data.publicUrl}`} 
        alt="กิจกรรม" className="w-40 aspect-w-4 aspect-h-5 rounded-lg object-cover" />
      </div>

      {/* Second Column - Description and Button */}
      <div className="flex flex-col justify-between flex-grow">
        {/* First Row - Description */}
        <div className="mb-4">
          <h2 className="text-xl font-bold">{announcementData.title}</h2>
          <p className="text-gray-500">{clubName}</p>
          <div className="flex items-center gap-2 mt-4">
            <p> ประกาศเมื่อวันที่ : {formatDate(announcementData.created_at)}</p>
            </div>
        </div>

        {/* Second Row - Button */}
        <div className="flex justify-end mt-auto">
          <button className="bg-[#FF7E69] text-white px-4 py-2 rounded-lg ml-4">รายละเอียด</button>
        </div>
      </div>
    </div>

  );
};

  export default AnnouncementList;