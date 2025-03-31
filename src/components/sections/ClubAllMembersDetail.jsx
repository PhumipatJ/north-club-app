import { Mail, ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect} from "react";
import {
  Container,
  ThemeProvider,
  Button,
  Box
} from "@mui/material";
import { useNavigate ,useParams} from "react-router-dom";
import supabaseService from "../../service/supabaseService";
import theme from "../Theme";
import { useLocation } from "react-router-dom";
import Loading from "../loading";
import ClubApplicantsBox from "./ClubApplicantBox";
import ConfirmCard from "../confirmCard";

const ClubAllMembersDetail = ({info}) => {
  const { clubId } = useParams();
  const location = useLocation();
  const email = location.state?.email;
  const [loading, setLoading] = useState(true);
  const [rejectReason,setReason] = useState('');
  const [isConfirmOpen,setopen] = useState(false);
  const [Opentype, setOpentype] = useState('');
  const navigate = useNavigate(0);
  const supabase = supabaseService.getClient();
  const [clubApplicant, setClubApplicant] = useState([]);

  const [userClubPosition, setUserClubPosition] = useState("");

  const positionOrder = [
    "ประธานชมรม", 
    "รองประธานชมรม", 
    "กรรมการ", 
    "เลขานุการ", 
    "ผู้ช่วยเลขานุการ", 
    "สมาชิกชมรม"
  ];

  const positionOrderProhibit = [
    "กรรมการ", 
    "เลขานุการ", 
    "ผู้ช่วยเลขานุการ", 
    "สมาชิกชมรม"
  ];

  const [isDropdownOpen, setShowDropdown] = useState(false);
  const [roleSelected,setRoleSelected] = useState('');

  
  const handleSelectRole = (role) =>{
    setRoleSelected(role);
    setShowDropdown(false);
  }

    useEffect(() => {
        const getClubPosition = async () => {
            const { data, error } = await supabase
                .from("clubMembers")
                .select("position")
                .eq("email", info.email)
                .eq("club_id", clubId)
                .single();

            if (error) {
                console.error("Error fetching club position:", error);
            } else {
                //console.log("ตำแหน่งผู้ใช้ : " + data.position);
                setUserClubPosition(data.position);
            }
        };

        getClubPosition();
    }, ); // Re-run when email or clubId changes


  useEffect(() => {
    const fetchApplicantUser = async () => {
        const { data, error } = await supabase
            .from("clubMembers")
            .select("club_id, position, created_at,clubPosition, user(name,gender,faculty,department,admission_year)")
            .eq("email", email);

      if (error) {
        console.error("Error fetching clubs:", error);
      } else {
        //console.log(data)
        setClubApplicant(data);
      }
      setLoading(false);
    };

    fetchApplicantUser();
  }, [clubId, email]);

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

  if(loading){
    return <Loading/>
  }

  const handleChangePosition = async () => {
    //console.log("ตำแหน่งรายละเอียด : " + clubApplicant[0].position);
    //console.log("ตำแหน่งที่เลือก : " + roleSelected);
    //console.log("ตำแหน่งผู้ใช้ : " + userClubPosition);
    //console.log("email ผู้ถูกเปลี่ยน : " + email);

    try {
      const { error: updateError } = await supabase
        .from("clubMembers")
        .update({ position: roleSelected })
        .eq("email", email)
        .eq("club_id", clubId);

      if (updateError) {
        console.error(`Failed to update event:`, updateError);
      }

      if(roleSelected === "สมาชิกชมรม"){
        const { data: updateData, error: updateRoleError } = await supabase
        .from('user')
        .update({ role: 'clubMember' })
        .eq('email', email);
  
        if (updateError) {
          console.error("Error updating user role:", updateRoleError);
          return;
        }
        console.log("Applicant role updated to 'club':", updateData);
      }
      else{
        const { data: updateData, error: updateRoleError } = await supabase
        .from('user')
        .update({ role: 'club' })
        .eq('email', email);
  
        if (updateError) {
          console.error("Error updating user role:", updateRoleError);
          return;
        }
        console.log("Applicant role updated to 'club':", updateData);
      }
        

      window.location.reload();

      }
      catch (err) {
        console.error("Error during approve process:", err);
      }
  }


  return (
    <ThemeProvider theme={theme}>

    <Container className="p-6 mt-24 min-h-[77vh] flex flex-col justify-center">
      <div className="flex max-w-6xl w-full">
        <div className=" w-full h-fit flex">
          <h1 className="text-4xl font-bold my-auto ">ข้อมูลสมาชิก</h1>
        </div>
      </div>
      
      <div className="flex justify-between gap-10 items-stretch">
        <ClubApplicantsBox clubId={clubId}/>
          <div className="mt-10 p-12 shadow-lg rounded-xl border border-gray-200 bg-white w-full flex-grow ">

            
            <div className="flex flex-col items-center justify-center h-full px-6 w-full ">
              <div className="flex flex-col text-left w-full justify-start">
                <div className="mt-2">
                  <span className="text-gray-400 text-sm">วันที่เข้าชมรม</span>
                </div>
                <div>
                  <span className="bg-[#FF7E69] text-white px-3 py-1 rounded-md text-sm font-semibold">
                    {formatDate(clubApplicant[0].created_at)}
                  </span>
                </div>  
              </div>
              

              {/* Applicant Data */}
              <div className="relative flex flex-col items-center ">
                <img
                  src="/assets/Maskgroup.png"
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                />
                <h2 className="text-2xl font-bold text-[#FF7E69] mt-2">
                  {clubApplicant[0]?.user.gender === "M" ? "นาย" : "นาง"} {clubApplicant[0]?.user.name}
                </h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{email}</span>
                </div>
              </div>

            <div className="flex flex-row justify-between w-full mt-6">
                {/* ข้อมูลส่วนตัว */}
                <div className="flex flex-col w-full">
                    <h3 className="text-lg font-semibold mb-2">ข้อมูลส่วนตัว</h3>

                    <div className="flex flex-row p-4 gap-8 rounded-lg">
                    <div className="flex flex-col">
                        <p className="mb-6 mt-3">
                        <strong>ชื่อ : </strong>
                        {clubApplicant[0]?.user.gender === "M" ? "นาย" : "นาง"} {clubApplicant[0]?.user.name}
                        </p>
                        <p className="mb-6"> <strong>ชั้นปี : </strong> 
                        {new Date().getFullYear() + 543 - clubApplicant[0]?.user.admission_year}
                        </p>
                        <p className="mb-6"><strong>คณะ : </strong>
                        {clubApplicant[0]?.user.faculty}
                        </p>
                        <p className="mb-6"><strong>สาขา : </strong>
                        {clubApplicant[0]?.user.department}
                        </p>
                    </div>


                    <div className="flex flex-col">
                        {/* ตำแหน่ง dropdown */}
                        <div className="flex items-center mb-6">
                            <p className="mr-4"><strong>ตำแหน่ง :</strong></p>
                            
                            {info.email === email ? (    
                              <div>
                                {clubApplicant[0].position}
                                <button className="p-2 border border-transparent text-white">.</button>
                              </div>
                              ) : userClubPosition === "ประธานชมรม" ? (
                                // Show dropdown and button if user is "ประธานชมรม"
                                <div className="flex items-center">
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setShowDropdown(!isDropdownOpen)}
                                      className="cursor-pointer border border-[#FF7E69] rounded-md w-50 p-2 text-left bg-white"
                                    >
                                      <div className="flex flex-row items-center justify-between">
                                        <div>{roleSelected || clubApplicant[0].position}</div>
                                        <div className="text-[#FF7E69]">
                                          {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                      </div>
                                    </button>
                                    {isDropdownOpen && (
                                      <ul className="absolute w-50 mt-1 rounded-md bg-white shadow-md z-10">
                                        {positionOrder.map((type, index) => (
                                          <li
                                            key={index}
                                            onClick={() => handleSelectRole(type)}
                                            className="p-2 cursor-pointer hover:bg-[#FF7E69] hover:rounded-md"
                                          >
                                            {type}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>

                                  <div className="relative ml-10">
                                    {roleSelected === "" || roleSelected === clubApplicant[0].position ? (
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{
                                          boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                                          mr: 2,
                                          paddingX: "3vw",
                                          bgcolor: "white",
                                          color: "#1A1A1A7D",
                                          borderWidth: "2px",
                                          borderColor: "white",
                                          "&:hover": {
                                            boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                                            cursor: "no-drop",
                                          },
                                        }}
                                      >
                                        เปลี่ยนตำแหน่ง
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{
                                          boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                                          mr: 2,
                                          paddingX: "3vw",
                                          bgcolor: "#FF7E69",
                                          color: "white",
                                          borderColor: "#FF7E69",
                                          borderWidth: "2px",
                                          "&:hover": {
                                            boxShadow: "0px 0px 5px 1px #FF7E697D",
                                          },
                                        }}
                                        onClick={() => handleChangePosition()}
                                      >
                                        เปลี่ยนตำแหน่ง
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ) : userClubPosition !== "ประธานชมรม" && clubApplicant[0].position !== "สมาชิกชมรม" ? (
                                // Show only text if user is not "ประธานชมรม" and position is not "สมาชิกชมรม"
                                <div>
                                  {clubApplicant[0].position}
                                  <button className="p-2 border border-transparent text-white">.</button>
                                </div>
                              ) : (
                                // Show dropdown and button for others
                                <div className="flex items-center">
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() => setShowDropdown(!isDropdownOpen)}
                                      className="cursor-pointer border border-[#FF7E69] rounded-md w-50 p-2 text-left bg-white"
                                    >
                                      <div className="flex flex-row items-center justify-between">
                                        <div>{roleSelected || clubApplicant[0].position}</div>
                                        <div className="text-[#FF7E69]">
                                          {isDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                      </div>
                                    </button>
                                    {isDropdownOpen && (
                                      <ul className="absolute w-50 mt-1 rounded-md bg-white shadow-md z-10">
                                        {positionOrderProhibit.map((type, index) => (
                                          <li
                                            key={index}
                                            onClick={() => handleSelectRole(type)}
                                            className="p-2 cursor-pointer hover:bg-[#FF7E69] hover:rounded-md"
                                          >
                                            {type}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </div>

                                  <div className="relative ml-10">
                                    {roleSelected === "" || roleSelected === clubApplicant[0].position ? (
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{
                                          boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                                          mr: 2,
                                          paddingX: "3vw",
                                          bgcolor: "white",
                                          color: "#1A1A1A7D",
                                          borderWidth: "2px",
                                          borderColor: "white",
                                          "&:hover": {
                                            boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                                            cursor: "no-drop",
                                          },
                                        }}
                                      >
                                        เปลี่ยนตำแหน่ง
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{
                                          boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                                          mr: 2,
                                          paddingX: "3vw",
                                          bgcolor: "#FF7E69",
                                          color: "white",
                                          borderColor: "#FF7E69",
                                          borderWidth: "2px",
                                          "&:hover": {
                                            boxShadow: "0px 0px 5px 1px #FF7E697D",
                                          },
                                        }}
                                        onClick={() => handleChangePosition()}
                                      >
                                        เปลี่ยนตำแหน่ง
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}


                        </div>

                        <p className="mb-6">
                        <strong>หน้าที่ในชมรม : </strong>
                        {clubApplicant[0].clubPosition || "ผู้ดูแลชมรม"}
                        </p>
                    </div>
                    </div>
                </div>
            </div>

             
       
              {/* Reply */}
              <div className="flex flex-col w-full bg-grey">
                <div className="h-fit w-full flexbox justify-end mt-10  gap-1">
                  <ThemeProvider theme={theme}> 
                    <h3 className="text-lg font-semibold mb-2">ยุติการเป็นสมาชิกชมรม</h3>
                    <div className="flex justify-end pl-10 mt-1">
                      
                    <input
                            type="text"
                            placeholder="เหตุผลในการยุติการเป็นสมาชิกชมรม"
                            className="border border-[#1A1A1A7D] rounded-md w-full p-1 mr-4 focus:outline-none focus:border-[#FF7E69] focus:border-2"
                            onChange={(e) => setReason(e.target.value)}
                            required
                          />
                        {rejectReason===''?(<Button
                          variant="outlined"
                          color="error"
                          sx={{
                            boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                            mr: 2,
                            paddingX: "3vw",
                            bgcolor: "white",
                            color: "#1A1A1A7D",
                            borderWidth:'2px',
                            borderColor:'white',
                            "&:hover": {
                              boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                              cursor: "no-drop",
                            },
                          }}
                        >
                          ตกลง
                        </Button>):(
                            <Button
                            variant="outlined"
                            color="error"
                            sx={{
                              boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                              mr: 2,
                              paddingX: "3vw",
                              bgcolor:"#FF7E69",
                                color:'white',
                              borderColor:'#FF7E69',
                              borderWidth:'2px',
                              "&:hover": {
                                boxShadow: "0px 0px 5px 1px #FF7E697D",
                                
                              },
                            }}
                            onClick={() => {
                              
                            }}
                          >
                            ตกลง
                          </Button>
                        )}
                    </div>
                  </ThemeProvider>
                </div>
              </div>

            </div>
          </div>
      </div>
    </Container>
    {isConfirmOpen && (
      <ConfirmCard
        isOpen={isConfirmOpen}
        onClose={() => setopen(false)}
        onConfirm={handleConfirm}
        type={Opentype} 
        onSecondConfirm={handleSecondConfirm}
      />
    )}
  </ThemeProvider>
  );
};

export default ClubAllMembersDetail;
