import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { Mail } from "lucide-react";
import Calendar from "../Calendar"
import supabase from "../../../supabaseClient";
import { useLocation } from "react-router-dom";
import Loading from "../loading";
const Clubpage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [onLoad,setonLoad] = useState(false);
   useEffect(()=>{
      setonLoad(true);
      setTimeout(() => {
        setonLoad(false);
      }, 200);
    
    },[location])
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
  //console.log(members);



  return (
    <div className="bg-gray-50">
      {onLoad?(<Loading/>):(<></>)}
      <div className="max-w-5xl mx-auto rounded-lg overflow-hidden">
      <div className="bg-white drop-shadow-lg mt-24">
        {/* Club Banner */}
        <div className="relative bg-[#FF7E69] h-64 flex items-center justify-start">

        </div>
  
        {/* Club Details */}
        <div className="flex flex-col ">
          <div className="flex flex-row p-6 h-fit  justify-between ">
            <div className="relative rounded-full flex justify-center mx-12 gap-10">
            <img className="w-48 h-48 rounded-full -translate-y-1/2" src={`${supabase.storage.from("club-avatars").getPublicUrl(club?.club_avatar).data.publicUrl}`} alt={club?.club_name } />
            <div className="flex flex-col h-fit ">
              <h1 className={`font-bold text-left overflow-visible ${club?.club_name.length > 20 ? "text-3xl" : "text-[32px]"}`}>{club?.club_name}</h1>
              <div className="text-gray-500 text-left ">
                <p>สร้างเมื่อ: { new Date(club?.approve_date)
              .toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
                <p>ที่ตั้งชมรม: {club?.location}</p>
                <div className="flexbox">
                  <div className="flex items-center mb-1"> {/* Container for email */}
                  <Mail className="w-5 h-5 text-[#7CE9BF]"/>
                  <p className="px-4">{club?.mail}</p>
                </div>
                <div className="flex items-center  mb-1"> {/* Container for Facebook */}
                  <FaFacebook className="w-5 h-5 text-[#7CE9BF]"/>
                  <p className="px-4">{club?.facebook}</p>
                </div>
                <div className="flex items-center  mb-1"> {/* Container for Instagram */}
                  <FaSquareInstagram className="w-5 h-5 text-[#7CE9BF]" />
                  <a href="https://www.instagram.com/l_uod_l_/" target="_blank" className="px-4">{club?.instagram} </a>
                </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      
      
      <div className="">
        {/* Members List */}
        <div div className="mt-8 h-fit">
          <h2 className="text-xl font-semibold">สมาชิก ({members.length} คน)</h2>
          <div className="flex flex-cols-6 gap-4 mt-4 ">
            {members.slice(0, 5).map((member, index) => (
              <div key={index} className="bg-white rounded-lg flex flex-col w-[20%] h-[25vh] items-center pt-7">
                <img src={member.image || "/assets/Maskgroup.png"} alt="Member" className="w-20 h-20 rounded-full object-cover" />
                <p className="mt-2 font-semibold text-center">{member.name}</p>
                <p className="text-gray-500 text-sm text-center">{member.position}</p>
              </div>
            ))}
            
            {/* View All Members Block */}
              <div className="bg-white p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer gap-2 text-[#FF7E69] hover:bg-[#FF7E69] duration-200 hover:text-white"
                   onClick={() => navigate(`/clubmember/${clubId}`)}>
                <div className="">
                  <img src={"/assets/Gamestation.svg"} alt="Member" className="w-full h-full rounded-full object-cover" />
                </div>
                <p className="text-center font-semibold">สมาชิกทั้งหมด</p>
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
