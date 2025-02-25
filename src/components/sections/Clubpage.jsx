import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { Mail, ChevronDown } from "lucide-react";
import { Avatar } from "@mui/material";
import Calendar from "../Calendar"
import supabase from "../../../supabaseClient";

const clubInfo = [
  {
    name: "KMUTNB Esport",
    avatar: "/assets/esport.png",
    banner: "/assets/esport.png",
    createdDate: "1 Jan 2020",
    locate: "ชั้น 6 อาคาร 40 ปี มจพ. กรุงเทพ",
    socialLinks: {
      facebook: "#",
      instagram: "#",
      email: "kmutnbphotoclub.bkk@gmail.com",
    },
    members: [
      { name: "น.ส.วิลสม กาสิ", role: "ประธานชมรม" },
      { name: "นายภัทร เครื่องาม", role: "รองประธานชมรม" },
      { name: "น.ส.วิลสม กาสิ", role: "กรรมการ" },
      { name: "น.ส.วิลสม กาสิ", role: "กรรมการ" },
    ],
  },
  {
    name: "KMUTNB Boxing Club",
    avatar: "/assets/boxing.png",
    banner: "/assets/boxing.png",
    createdDate: "2 Jan 2022",
    locate: "ชั้น 6 อาคาร 40 ปี มจพ. กรุงเทพ",
    socialLinks: {
      facebook: "#",
      instagram: "l_uod_l",
      email: "kmutnbphotoclub.bkk@gmail.com",
    },
    members: [
      { name: "น.ส.วิลสม กาสิ", role: "ประธานชมรม" },
      { name: "นายภัทร เครื่องาม", role: "รองประธานชมรม" },
      { name: "น.ส.วิลสม กาสิ", role: "กรรมการ" },
      { name: "น.ส.วิลสม กาสิ", role: "กรรมการ" },
      { name: "น.ส.วิลสม กาสิ", role: "กรรมการ" },
      { name: "น.ส.วิลสม กาสิ", role: "กรรมการ" },
      { name: "น.ส.วิลสม กาสิ", role: "กรรมการ" },
    ],
  },
];

const Clubpage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();

  // Find the club that matches the URL parameter
  const club = clubInfo[0];

  const [clubTest, setClub] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchClubData = async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("approve_date, club_name, club_avatar, location, mail, instagram, facebook")
        .eq("club_id", clubId)
        .single();
  
      if (error) {
        console.error("Error fetching club data:", error);
      } else {
        setClub(data);
      }
    };
  
    fetchClubData();
  }, [clubId]);
  
  useEffect(() => {
    const fetchMembers = async () => {
      // Fetch clubMembers data (position & email)
      const { data: membersData, error: membersError } = await supabase
        .from("clubMembers")
        .select("position, email")
        .eq("club_id", clubId);
  
      if (membersError) {
        console.error("Error fetching club members:", membersError);
        return;
      }
  
      if (membersData.length === 0) {
        setMembers([]);
        return;
      }
  
      // Extract emails from membersData
      const emails = membersData.map((member) => member.email);
  
      // Fetch names from users using the extracted emails
      const { data: usersData, error: usersError } = await supabase
        .from("user")
        .select("name, email")
        .in("email", emails);
  
      if (usersError) {
        console.error("Error fetching user data:", usersError);
        return;
      }
  
      // Merge membersData with usersData by email
      const mergedData = membersData.map((member) => ({
        ...member,
        name: usersData.find((user) => user.email === member.email)?.name || "Unknown",
      }));
  
      setMembers(mergedData);
    };
  
    fetchMembers();
  }, [clubId]);
  
  
  //console.log(clubTest);
  console.log(members);



  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto rounded-lg overflow-hidden">
      <div className="bg-white drop-shadow-lg mt-24">
        {/* Club Banner */}
        <div className="relative bg-[#FF7E69] h-64 flex items-center justify-start">

        </div>
  
        {/* Club Details */}
        <div className="flex flex-col">
          <div className="flex flex-row p-6 h-fit">
            <div className="relative rounded-full flex items-center justify-center mx-12">
            <img className="w-48 h-48 rounded-full -translate-y-1/2" src={`${supabase.storage.from("club-avatars").getPublicUrl(clubTest?.club_avatar).data.publicUrl}`} alt={clubTest?.club_name } />
            </div>
            <div className="flex flex-col h-fit">
              <h1 className="text-5xl font-bold text-left">{clubTest?.club_name}</h1>
              <div className="text-gray-500 text-left">
                <p>สร้างเมื่อ: { new Date(clubTest?.approve_date)
              .toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
                <p>ที่ตั้งชมรม: {clubTest?.location}</p>
                <div className="flex items-center"> {/* Container for email */}
                  <Mail className="w-5 h-5 text-[#7CE9BF]"/>
                  <p className="px-4">{clubTest?.mail}</p>
                </div>
                <div className="flex items-center"> {/* Container for Facebook */}
                  <FaFacebook className="w-5 h-5 text-[#7CE9BF]"/>
                  <p className="px-4">{clubTest?.facebook}</p>
                </div>
                <div className="flex items-center"> {/* Container for Instagram */}
                  <FaSquareInstagram className="w-5 h-5 text-[#7CE9BF]" />
                  <a href="https://www.instagram.com/l_uod_l_/" target="_blank" className="px-4">{clubTest?.instagram}</a>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end flex-grow">
              <button className="mt-4 bg-[#7CE9BF] shadow-lg px-4 py-2 rounded-lg">สมัครเข้าชมรม</button>
            </div>
          </div>
        </div>
      </div>
      
      
      <div className="">
        {/* Members List */}
        <div div className="p-6 mt-8">
          <h2 className="text-xl font-semibold">สมาชิก ({members.length} คน)</h2>
          <div className="grid grid-cols-5 gap-4 mt-4">
            {members.slice(0, 4).map((member, index) => (
              <div key={index} className="bg-white p-4 rounded-lg flex flex-col items-center">
                <img src={member.image || "/assets/Maskgroup.png"} alt="Member" className="w-20 h-20 rounded-full object-cover" />
                <p className="mt-2 font-semibold text-center">{member.name}</p>
                <p className="text-gray-500 text-sm text-center">{member.position}</p>
              </div>
            ))}
            
            {/* View All Members Block */}
              <div className="bg-white p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100"
                   onClick={() => navigate(`/clubmember/${clubId}`)}>
                <div className="bg-amber-100 rounded-full">
                  <img src={"/assets/Maskgroup.png"} alt="Member" className="w-20 h-20 rounded-full object-cover" />
                </div>
                <p className="text-[#FF7E69]">สมาชิกทั้งหมด</p>
              </div>
            </div>
          </div>
        </div>
        

        <div className="flex flex-row p-6 mt-8 items-center justify-between">
          <div className="">
            <h1 className="text-xl font-semibold mb-2"> Calendar</h1>
            <Calendar/>
          </div>
          <div className="">
            <h1 className="text-xl font-semibold mb-2"> Calendar</h1>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Clubpage;
