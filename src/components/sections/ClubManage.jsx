import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { Mail, Upload, Settings, BellRing} from "lucide-react";
import EventModal from "../EventModal"; 
import Calendar from "../Calendar"
import { Button,ThemeProvider } from "@mui/material";
import theme from "../Theme";
import ClubFormManage from "./ClubFormManage";
import { useLocation } from "react-router-dom";
import Loading from "../loading";
import supabaseService from "../../service/supabaseService";
import AnnouncementList from "../AnnouncementList";
import EventList from "../EventList";
import ConfirmCard from "../confirmCard";

const ClubManage = ({userinfo}) => {
  const supabase = supabaseService.getClient();
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [onLoading,setonLoad] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [prevForm,setPrevform] = useState(null); 
  const [isOpenForm,setOpenform] = useState(false);
  const [isformpopupOpen,setPopupopen] = useState(false);

  const [clubEvent, setClubEvent] = useState([]);
  const [clubEventExpired, setClubEventExpired] = useState([]);
  const [clubAnnouncement, setClubAnnouncement] = useState([]);

  const [clubName, setClubName] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [opentype, setOpentype] = useState(null);

  const handleConfirm = () => {
    setOpentype("registrationClose")
    setIsConfirmOpen(true);
  };

  const handelonclose = () => {
    setIsConfirmOpen(false);
    handleCloseRegistration();
  };

  const isEventExpired = (endDate, endTime) => {
    const [day, month, year] = endDate.split("/").map(Number);
    const [hours, minutes] = endTime.split(":").map(Number);
    
    const eventEndDateTime = new Date(year, month - 1, day, hours, minutes); // Convert to Date object
    const now = new Date(); 
    
    return now > eventEndDateTime; 
  };

  useEffect(()=>{
    setonLoad(true);
    //console.log(userinfo)
    setTimeout(() => {
      setonLoad(false);
    }, 200);
  
  },[location]);

  useEffect(() => {
    const fetchClubEvent = async () => {
      const { data, error } = await supabase
        .from("event")
        .select("id, title, poster, start_date, start_time, end_time, location")
        .eq("club_id", clubId)
        .eq("approval_status", true);
  
      if (error) {
        console.error("Error fetching club data:", error);
      } else {
        // Separate events into expired and non-expired
        const expiredEvents = [];
        const upcomingEvents = [];
  
        data.forEach(event => {
          const isExpired = isEventExpired(event.start_date, event.end_time);
          if (isExpired) {
            expiredEvents.push(event);
          } else {
            upcomingEvents.push(event);
          }
        });
        
        try {
        // Sort non-expired events by start_date and then start_time
        upcomingEvents.sort((a, b) => {
          const [aDay, aMonth, aYear] = a.start_date.split("/").map(Number);
          const [bDay, bMonth, bYear] = b.start_date.split("/").map(Number);
          const aStart = new Date(aYear, aMonth - 1, aDay, ...a.start_time.split(":").map(Number));
          const bStart = new Date(bYear, bMonth - 1, bDay, ...b.start_time.split(":").map(Number));
  
          if (aStart !== bStart) {
            return aStart - bStart; // Sort by start_date and start_time
          }
          return 0;
        });
        
        
        // Sort expired events by end_date and then end_time
        expiredEvents.sort((a, b) => {
          const [aDay, aMonth, aYear] = a.end_date.split("/").map(Number);
          const [bDay, bMonth, bYear] = b.end_date.split("/").map(Number);
          const aEnd = new Date(aYear, aMonth - 1, aDay, ...a.end_time.split(":").map(Number));
          const bEnd = new Date(bYear, bMonth - 1, bDay, ...b.end_time.split(":").map(Number));
  
          return aEnd - bEnd; // Sort by end_date and end_time
        });
        } catch (error) {
          //console.error("Error sorting expiredEvents:", error);
        }
  
        //console.log(upcomingEvents);
        //console.log(expiredEvents);
        setClubEvent(upcomingEvents);
        setClubEventExpired(expiredEvents);
      }
    };
  
    fetchClubEvent();
  }, [clubId]);

  useEffect(() => {
    const fetchClubAnnouncement = async () => {
      const { data, error } = await supabase
        .from("announcement")
        .select("id, title, poster, created_at")
        .eq("club_id", clubId)
  
      if (error) {
        console.error("Error fetching club data:", error);
      } 
      else {
        //console.log(data);
        const sortedAnnouncements = data.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          
          // Sorting by created_at in descending order (latest first)
          return dateB - dateA;
        });
  
        setClubAnnouncement(sortedAnnouncements);
      }
    };
  
    fetchClubAnnouncement();
  }, [clubId]);

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
        //console.log("Club Name:", data.club_name);
      }
    };
  
    fetchClubData();
  }, [clubId]);

  useEffect(() => {
    if (club) {
      setClubName(club.club_name)
    }
  }, [club]); 
  
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
  useEffect(()=>{
    const fetchClubForm = async() =>{
      const {data:Formdata,error:formError} = await supabase
      .from("ClubRegisterForm")
      .select("*")
      .eq("club_id",clubId)
      .single()

      if(formError){
        //console.log(formError);
        setPrevform(Formdata);
        return;
      }
      if(Formdata.length !== 0){
        setPrevform(Formdata);
        console.log(Formdata);
      }
      else{
        //console.log("test");
      }
    };
    fetchClubForm();
  },[clubId,isformpopupOpen]);

  const handleCloseRegistration = async () => {
    const { error } = await supabase
      .from("ClubRegisterForm")
      .update({ form_status: false }) // Set form_status to false
      .eq("club_id", clubId); // Match by club_id
  
    if (error) {
      console.error("Error updating form_status:", error);
    } else {
      window.location.reload(); 
    }
  };

  const handleCheckRoleSetting = async () => {
    console.log(userinfo.role);
    if(userinfo.role !== "club"){
      window.location.reload();
    }
    navigate(`/Clubprofile/${clubId}`)
  };
  
  return (
    <div className="bg-gray-50">
      {onLoading?(
        <Loading/>
      ):(<></>)}
      <EventModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        clubId={clubId} 
        userId={userinfo?.id}/>
      <ClubFormManage 
        isOpen={isformpopupOpen} 
        onClose={()=>{setPopupopen(false)}} 
        clubId={clubId} 
        prevform={prevForm}/>
      <ConfirmCard
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        type={opentype}
        onConfirm={handleConfirm}
        onSecondConfirm={handelonclose}
      />
      <div className="max-w-5xl mx-auto rounded-lg overflow-hidden">
      <div className="bg-white drop-shadow-lg mt-24">
        {/* Club Banner */}
        <div className="relative bg-[#FF7E69] h-64 flex items-center justify-start">

        </div>
  
        {/* Club Details */}
        <div className="flex flex-col ">
          <div className="flex flex-row p-6 h-fit  justify-between ">
            <div className="relative rounded-full flex justify-center mx-12 gap-8">
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
                  <a href={club?.facebook} target="_blank" className="px-4">
                    {club?.facebook ? decodeURIComponent(new URL(club.facebook).pathname.replace(/\//g, '')) : ''}
                  </a>
                </div>
                <div className="flex items-center  mb-1"> {/* Container for Instagram */}
                  <FaSquareInstagram className="w-5 h-5 text-[#7CE9BF]" />
                  <a href={club?.instagram} target="_blank" className="px-4">
                    {club?.instagram ? decodeURIComponent(new URL(club.instagram).pathname.replace(/\//g, '')) : ''}
                  </a>
                </div>
                </div>
              </div>
            </div>
            </div>
            
            {/* Setting */}
            <div className=" flex-col justify-between flex mb-6 ">
              <div className=" justify-end flex ">
              <Settings className="w-6 h-6 text-gray-500 cursor-pointer" onClick={() => handleCheckRoleSetting()}/>
              </div>
            <div className="justify-center mt-16 flex">
            
            {prevForm?.form_status?(<p className="text-[#7CE9BF] flex gap-2"><BellRing style={{}}/>กำลังเปิดรับสมัคร</p>):(<></>)}
            </div>
              <ThemeProvider theme={theme}>
                <div className="">
                {prevForm?.form_status?(<Button
                variant="contained"
                color="primary"
                sx={{
                  boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                  width:'100%',
                  mr: 0,
                  paddingX: "4vw",
                  bgcolor: "white",
                  color: "#1A1A1A",
                  "&:hover": { bgcolor: "#FF7E69",boxShadow:"0px 0px 2px #FF7E6960"},
                }}
                onClick={handleConfirm}
              >
                ปิดรับสมัคร
              </Button>):(<Button
                variant="contained"
                color="primary"
                sx={{
                  boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                  mr: 0,
                  paddingX: "2vw",
                  bgcolor: "white",
                  color: "#1A1A1A",
                  "&:hover": { bgcolor: "#7CE9BF",boxShadow:"0px 0px 2px #7CE9BF60"},
                }}
                onClick={()=>{setPopupopen(true);console.log(prevForm)}}
              >
                เปิดรับสมัครสมาชิก
              </Button>)}
                </div>
              </ThemeProvider>
              <div className="mt-2 text-left">
                <ThemeProvider theme={theme}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                      mr: 0,
                      paddingX: "2vw",
                      bgcolor: "white",
                      color: "#1A1A1A",
                      width:'100%',
                      "&:hover": { bgcolor: "#7CE9BF",boxShadow:"0px 0px 2px #7CE9BF60"},
                    }}
                    onClick={() => navigate(`/clubmanage/${clubId}/ClubApplicantsList`, { state: { clubId } })}
                  >
                    จัดการรายชื่อผู้สมัคร
                  </Button>
                </ThemeProvider>
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
        

        <div className="flex flex-row p-6 mt-8 justify-between">
          <div className="w-fit ">
            <h1 className="text-2xl text-center self-stretch">ปฎิทินกิจกรรม</h1>
            <Calendar className="mt-2"/>
          </div>
          
          {/* Modal */}
          <div className="w-2/3 justify-start ">
            <div className="bg-white shadow-lg rounded-lg pt-4 flex flex-col min-h-[25vh] items-center justify-center overflow-hidden cursor-pointer
                hover:bg-gray-100 group"
                onClick={openModal}>
                
                {/* Create Activity */}
                <div className="flex items-center flex-row">
                    <div className="flex flex-col items-center ">
                        <Upload className="w-10 h-10 text-[#FF7E69]" />
                        <p className="text-gray-300 mt-2 text-center duration-300 group-hover:text-[#FF7E69]">
                        สร้างกิจกรรม <br /> หรือประกาศใหม่
                        </p>
                    </div>
                    <div>
                        <img src="/assets/walkinghalf.png" alt="Illustration" 
                            className="relative w-36 translate-x-1/2 duration-300 group-hover:translate-x-1/5"/>
                    </div>
                </div>
            </div>
              
            {/* Announcement */}
            <h1 className="text-2xl pt-6">ประกาศ</h1>
            {clubAnnouncement.length === 0 ? (
              <div className="bg-gray-100 text-gray-500 text-center py-4 rounded-lg">
                ไม่มีประกาศ
              </div>
            ) : (
              clubAnnouncement.map((announcement) => (
                <div key={announcement.id}>
                  <AnnouncementList id={announcement.id} clubName={clubName} />
                  <br />
                </div>
              ))
            )}

            {/* Event */}
            <h1 className="text-2xl pt-6">กิจกรรม</h1>
            {clubEvent.length === 0 && clubEventExpired.length === 0 ? (
              <div className="bg-gray-100 text-gray-500 text-center py-4 rounded-lg">
                ไม่มีกิจกรรม
              </div>
            ) : (
              <>
                {clubEvent.map((event) => (
                  <div key={event.id}>
                    <EventList id={event.id} clubName={clubName} />
                    <br />
                  </div>
                ))}
                {clubEventExpired.map((event) => (
                  <div key={event.id}>
                    <EventList id={event.id} clubName={clubName} />
                    <br />
                  </div>
                ))}
              </>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default ClubManage;