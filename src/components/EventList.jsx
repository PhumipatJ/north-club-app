import React, { useState, useEffect } from "react";
import { MapPin, Clock3, X, Calendar } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import supabaseService from "../service/supabaseService";

const EventList = ({ id, clubName }) => {
  const supabase = supabaseService.getClient();
  const [eventData, setEventData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";
    const monthsInThai = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
  
    const [day, month, year] = dateString.split("/").map(Number); // Extract DD, MM, YYYY
  
    return `${day} ${monthsInThai[month - 1]} ${year}`;
  };

  const getPlatformName = (url) => {
    const platforms = {
      youtube: "YouTube",
      facebook: "Facebook",
      twitter: "Twitter",
      instagram: "Instagram",
      linkedin: "LinkedIn",
      tiktok: "TikTok",
    };
  
    const regex = /(youtube\.com|youtu\.be|facebook\.com|twitter\.com|instagram\.com|linkedin\.com|tiktok\.com)/i;
    let match = null;
    try {
      match = url.match(regex);
    } catch (error) {
      //console.error("Error matching the URL:", error);
      return "Error processing URL"; // Return fallback value if error occurs
    }
  
    if (match) {
      // Loop through the platforms and check for a match
      for (let [key, value] of Object.entries(platforms)) {
        if (match[0].includes(key)) {
          return value;
        }
      }
    }
    return "ตรวจสอบลิงค์จากผู้จัดงาน"; 
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
            <span>สถานที่จัดกิจกรรม : {getPlatformName(eventData.location)}</span>
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
            
            <button 
              className="bg-[#FF7E69] hover:shadow-[0px_0px_5px_2px_#FF7E697D] duration-300 text-white px-4 py-2 rounded-lg ml-4"
              onClick={() => setIsModalOpen(true)}>
              รายละเอียด
            </button>
        </div>
      {/* Modal */}
            {isModalOpen && (
              <>
              <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"> 
                <div className="max-w-4xl mx-auto h-[85%] p-12 shadow-lg rounded-xl border border-gray-200 bg-white mt-24 mb-8 ">
                  <button
                    className="absolute top-26 right-83 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X size={24} />
                  </button> 
                    <div className="flex flex-col w-full">
                        <div className="flex flex-wrap md:flex-nowrap gap-4">
                            <div className="flex items-center justify-center relative overflow-hidden rounded-lg w-full md:w-2/5 aspect-[4/5]">
                                <img
                                    src={`${supabase.storage.from("club-avatars").getPublicUrl(eventData.poster).data.publicUrl}`}
                                    alt={eventData.title}
                                    className="w-fit h-full object-cover rounded-lg" />
                            </div>
                            <div className="flex-1 px-4 overflow-auto">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="bg-[#FF7E69] text-white px-3 py-1 rounded-md text-sm font-semibold">
                                        {eventData.start_date}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-[#FF7E69]">{eventData.title}</h2>
                                <p className="text-gray-600 text-sm">Organized by KMUTNB Photo Club</p>
                                <div className="mt-2 space-y-2 text-gray-700 text-sm ">
                                  <h2 className="text-xl font-semibold text-[#FF7E69] mt-4">สถานที่จัดกิจกรรม</h2>
                                    <div className="flex">     
                                        <MapPin size={16} />
                                        <span className="ml-2" >{eventData.location}</span>
                                    </div>
                                  <h2 className="text-xl font-semibold text-[#FF7E69]  mt-4">เวลากิจกรรม</h2>
                                    <div className="flex">
                                      <Calendar size={16} />
                                      <span className="ml-2" >{eventData.start_time} - {eventData.end_time} น.</span>
                                      
                                    </div>            
                                    <p className="text-sm text-gray-700">ดูเอกสารเพิ่มเติม:</p>
                                    <a
                                        href={eventData.document}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 text-sm flex">
                                        {eventData.document}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                            
                            <div className="mt-2">
                              <h2 className="text-2xl font-semibold text-[#1A1A1A]">รายละเอียดกิจกรรม</h2>
                              <p className="pl-4">{eventData.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </>
            )}
        </div>
    </div>

  );
};

  export default EventList;