import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { Mail ,BellRing} from "lucide-react";
import Calendar from "../Calendar"
import supabaseService from "../../service/supabaseService";
import { useLocation } from "react-router-dom";
import Loading from "../loading";
import { Button ,ThemeProvider,Box} from "@mui/material";
import theme from "../Theme";
import Clubform from "./Clubform";
import ConfirmCard from "../confirmCard";
const Clubpage = ({info}) => {
  const supabase = supabaseService.getClient();
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [onLoad,setonLoad] = useState(true);
  const [applyForm,setForm] = useState();
  const [isFormopen,setFormopen] = useState(false);
  const [loaded,setloaded] = useState([false,false,false])
  const [confirmOpen,setConfirm] = useState(false);
  const [openType,setOpentype] = useState('');
  const [openText,setOpentext] = useState('');
  useEffect(()=>{
    if(loaded[0] && loaded[1] && loaded[2]){
      setTimeout(() => {
        setonLoad(false);
      }, 200);
    }
  },[loaded]);
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
      setloaded([true,false,false])
    };
  
    fetchClubData();
  }, [clubId]);
  useEffect(()=>{
    const fetchingForm = async () =>{
      const {data:form , error:Ferror} = await supabase
      .from("ClubRegisterForm")
      .select("*")
      .eq("club_id",clubId)
      .maybeSingle();
      if(Ferror){
        console.log(Ferror)
      }
      setForm(form);
    }
    setloaded([true,true,false])
    fetchingForm();
  },[clubId])
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
      setloaded([true,true,true])
    };
  
    fetchMembers();
  }, [clubId]);

  const isAppiled = async () =>{
    const {data,error} = await supabase
    .from('userform')
    .select('status')
    .eq("club_id",clubId)
    .eq("user_id",info?.id)
    .maybeSingle();
    if(error){
      console.log(error)
    }
    return data;
  }
  const isJoined = async ()=>{
    const {data,error} = await supabase
    .from('clubMembers')
    .select('email')
    .eq('email',info?.email)
    .eq('club_id',clubId)
    .maybeSingle();
    if(error){
      console.log(error);
    }
    console.log(data);
    return data;
  }
  const handleOpenform = async() =>{
    if(info?.role === undefined){
      setOpentype('login');
      setConfirm(true);
    }else{
      if(info?.role === 'admin'){
        console.log('you are admin bro')
      }
      else{
        if(await isAppiled() === null){
          setFormopen(true);
        }
        else if(await isJoined() !== null){
          setOpentype('alreadyInClub');
          setConfirm(true);
        }
        else{
          setOpentype('alreadyApplied');
          setConfirm(true);
        }
      }
    }
  }
  //console.log(clubTest);
  //console.log(members);
  return (
    <div className="bg-gray-50">
      <ConfirmCard isOpen={confirmOpen} type={openType} onClose={()=>setConfirm(false)} text={openText}></ConfirmCard>
      {onLoad?(<Loading/>):(<></>)}
      {isFormopen&&(
        <Clubform formdata={{...applyForm, clubname:club?.club_name}} onClose={()=>setFormopen(false)} userInfo={info}/>
      )}
      <div className="max-w-5xl mx-auto rounded-lg overflow-hidden">
      <div className="bg-white drop-shadow-lg mt-24">
        {/* Club Banner */}
        <div className="relative bg-[#FF7E69] h-64 flex items-center justify-start">

        </div>
  
        {/* Club Details */}
        <div className="flex flex-col ">
          <div className="flex flex-row p-6 h-fit  justify-between ">
            <div className="relative rounded-full flex justify-center mx-12 gap-10 ">
            <img className="w-48 h-48 rounded-full -translate-y-1/2" src={`${supabase.storage.from("club-avatars").getPublicUrl(club?.club_avatar).data.publicUrl}`} alt={club?.club_name } />
            <div className="flex flex-col h-fit ">
              <h1 onClick={isAppiled} className={`font-bold text-left overflow-visible ${club?.club_name.length > 20 ? "text-3xl" : "text-[32px]"}`}>{club?.club_name}</h1>
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
            <div>
              <ThemeProvider theme={theme}>
            {applyForm?.form_status===true?(
              <div className="w-[25vh] text-center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenform}
                sx={{
                  boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                  mr: 0,
                  width:'100%',
                  paddingX: "2vw",
                  bgcolor: "white",
                  color: "#1A1A1A",
                  "&:hover": { bgcolor: "#7CE9BF",boxShadow:"0px 0px 2px #7CE9BF60"},
                }}
              >
                สมัครเข้าชมรม
              </Button>
              <div className="text-[13px] mt-2 text-[#5ccca1] flex gap-3 justify-center">
              <BellRing/>ขณะนี้ชมรมกำลังเปิดรับ
            </div>
              </div>
            ):(<div className="w-[25vh] text-center">
              <Box
              sx={{
                boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                mr: 0,
                userSelect:'none',
                borderRadius:'5px',
                paddingY:'0.5vw',
                paddingX: "2vw",
                bgcolor: "white",
                color: "#1A1A1A7D",
                cursor:'default',
                width:'100%',
                "&:hover": {boxShadow:"0px 0px 2px rgba(26,26,26,0.25)"},
              }}
            >
              สมัครเข้าชมรม
            </Box>
            <div className="text-[13px] mt-2 text-[#1a1a1a7D]">
              ชมรมยังไม่เปิดรับสมาชิก
            </div>
            </div>)}
              </ThemeProvider>
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
