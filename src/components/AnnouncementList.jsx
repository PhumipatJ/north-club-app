import React, { useState, useEffect } from "react";
import { MapPin, Clock3, X, Calendar } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import supabaseService from "../service/supabaseService";

const AnnouncementList = ({ id, clubName }) => {
  const supabase = supabaseService.getClient();
  const [announcementData, setAnnouncementData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const formatDateDMY = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so add 1
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
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
          //console.log(data);
          setAnnouncementData(data);
        }
      };
    
      fetchAnnouncementData();
    }, [id]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex gap-4">
      {/* First Column - Image */}
      <div className="flex-shrink-0">
        <img 
          src={`${supabase.storage.from("club-avatars").getPublicUrl(announcementData.poster).data.publicUrl}`} 
          alt="กิจกรรม" 
          className="w-40 aspect-w-4 aspect-h-5 rounded-lg object-cover" />
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
          <button
            className="bg-[#FF7E69] hover:shadow-[0px_0px_5px_2px_#FF7E697D] duration-300 text-white px-4 py-2 rounded-lg ml-4"
            onClick={() => setIsModalOpen(true)}>
            รายละเอียด
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"> 
          <div className="max-w-4xl mx-auto h-[85%] shadow-lg rounded-xl border border-gray-200 bg-white mt-24 mb-8">
            <div className="py-3 flex justify-end px-5">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={24} />
            </button> 
            </div>
              <div className="flex flex-col w-full px-10">
                  <div className="flex flex-wrap md:flex-nowrap gap-4">
                      <div className="flex items-center justify-center relative overflow-hidden rounded-lg w-full md:w-2/5 aspect-[4/5]">
                          <img
                              src={`${supabase.storage.from("club-avatars").getPublicUrl(announcementData.poster).data.publicUrl}`}
                              alt={announcementData.title}
                              className="w-fit h-full object-cover rounded-lg" />
                      </div>
                      <div className="flex-1 px-4">
                          <div className="flex items-center justify-between mb-2">
                              <span className="bg-[#FF7E69] text-white px-3 py-1 rounded-md text-sm font-semibold">
                                  {formatDateDMY(announcementData.created_at)}
                              </span>
                          </div>
                          <h2 className="text-2xl font-bold text-[#FF7E69]">{announcementData.title}</h2>
                          <p className="text-gray-600 text-sm">Organized by KMUTNB Photo Club</p>
                          <div className="mt-2 space-y-2 text-gray-700 text-sm">            
                              <div className="mt-4">
                                  <h2 className="text-xl font-semibold text-[#FF7E69]">รายละเอียดกิจกรรม</h2>
                                  <p className="pl-4">{announcementData.description}</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                      <p className="text-sm text-gray-700">ดูเอกสารเพิ่มเติม:</p>
                      <a
                          href={`${supabase.storage.from("club-documents").getPublicUrl(announcementData.document).data.publicUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm">
                          {announcementData.document}
                      </a>
                  </div>
              </div>
          </div>
        </div>
      </>
      )}
    </div>
  );
};


  export default AnnouncementList;