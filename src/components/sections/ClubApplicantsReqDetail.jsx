import { Mail, User, SquarePen } from "lucide-react";
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
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Loading from "../loading";
import ClubApplicantsBox from "./ClubApplicantBox";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import {MapPin,Calendar,File} from "lucide-react";
import ConfirmCard from "../confirmCard";

const ClubApplicantsReqDetail = () => {
  const { clubId } = useParams();
  const location = useLocation();
  const applicantId = location.state?.applicantId;
  const [loading, setLoading] = useState(true);
  const [rejectReason,setReason] = useState('');
  const [isConfirmOpen,setopen] = useState(false);
  const [Opentype, setOpentype] = useState(''); // Tracks the action to confirm
  const navigate = useNavigate(0);
  const supabase = supabaseService.getClient();
  const [clubApplicant, setClubApplicant] = useState([]);

  useEffect(() => {
    const fetchApplicantUser = async () => {
      const { data, error } = await supabase
        .from("userform")
        .select("* , user: user_id(name,gender,faculty,department,admission_year,email)")
        .eq("club_id", clubId)  
        .eq("id", applicantId) 

      if (error) {
        console.error("Error fetching clubs:", error);
      } else {
        console.log(data)
        setClubApplicant(data);
      }
      setLoading(false);
    };

    fetchApplicantUser();
  }, [clubId, applicantId]);

  const handleReject = async () => {
    try {
      const { data, error } = await supabase
        .from('userform')
        .delete()
        .eq('club_id', clubId) 
        .eq('id', applicantId);
  
      if (error) {
        console.error("Error rejecting applicant:", error);
        return;
      }
  
      console.log("Applicant rejected successfully:", data);
      navigate(-1);  
  
    } catch (err) {
      console.error("Error during rejection process:", err);
    }
  }
  
  
  const handleApprove = async () => {
    
    try {
      // Step 1: Accept the applicant into the 'clubMembers' table
      const { data: clubMemberData, error: clubMemberError } = await supabase
        .from('clubMembers')
        .insert([
          {
            email: clubApplicant[0]?.user.email, // Assuming you have the applicant's email
            club_id: clubId, // The current club ID
            position: "สมาชิกชมรม", // The applicant's role apply in the club
            clubPosition: clubApplicant[0]?.role_apply // You can adjust the club position if necessary
          }
        ]); // Ensures no duplicates for email and club_id
    
      if (clubMemberError) {
        console.error("Error adding applicant to clubMembers:", clubMemberError);
        return;
      }
  
      console.log("Applicant added to clubMembers:", clubMemberData);
  
      // Step 2: Delete the applicant from the 'userform' table
      const { data: deleteData, error: deleteError } = await supabase
        .from('userform')
        .delete()
        .eq('club_id', clubId)
        .eq('id', applicantId);
  
      if (deleteError) {
        console.error("Error deleting applicant from userform:", deleteError);
        return;
      }
  
      console.log("Applicant deleted from userform:", deleteData);
  
      // Step 3: Update the applicant's role to "club" in the 'user' table
      const { data: updateData, error: updateError } = await supabase
        .from('user')
        .update({ role: 'club' })
        .eq('id', clubApplicant[0]?.user_id); // Assuming you have the user ID for the applicant
  
      if (updateError) {
        console.error("Error updating user role:", updateError);
        return;
      }
  
      console.log("Applicant role updated to 'club':", updateData);
  
      navigate(-1);  
  
    } catch (err) {
      console.error("Error during approve process:", err);
    }
  };

  const handleConfirm = () => {
    setopen(true);
  };

  const handleSecondConfirm = () => {
    if (Opentype === "approve") {
      handleApprove();
    } else if (Opentype === "reject") {
      handleReject();
    }
  
  };

  const handleclose = () => {
    
  }

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

  return (
    <ThemeProvider theme={theme}>

    <Container className="p-6 mt-24 min-h-[77vh] flex flex-col justify-center">
      <div className="flex max-w-6xl w-full">
        <div className=" w-full h-fit flex">
          <h1 className="text-4xl font-bold my-auto ">ข้อมูลผู้สมัคร</h1>
        </div>
      </div>
      
      <div className="flex justify-between gap-10 items-stretch">
        <ClubApplicantsBox clubId={clubId}/>
          <div className="mt-10 p-12 shadow-lg rounded-xl border border-gray-200 bg-white w-full flex-grow ">

            
            <div className="flex flex-col items-center justify-center h-full px-6 w-full ">
              <div className="flex flex-col text-left w-full justify-start">
                <div className="mt-2">
                  <span className="text-gray-400 text-sm">วันที่สมัคร</span>
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
                  <span>{clubApplicant[0]?.user.email}</span>
                </div>
              </div>

              <div className="flex flex-row justify-between w-full mt-6">
                {/* ข้อมูลส่วนตัว */}
                <div className="flex flex-col w-full">
                  <h3 className="text-lg font-semibold mb-2">ข้อมูลผู้สมัคร</h3>
                  
                  <div className="flex flex-row p-4 gap-8 rounded-lg">
                    <div className="flex flex-col">
                      <p className="mb-6"><strong>ชื่อ : </strong>{clubApplicant[0]?.user.gender === "M" ? "นาย" : "นาง"} {clubApplicant[0]?.user.name}</p>
                      <p className="mb-6"><strong>คณะ : </strong>{clubApplicant[0]?.user.faculty}</p>
                    </div>
                    <div className="flex flex-col justify-end">
                      <p className="mb-6"><strong>ชั้นปี : </strong>{new Date().getFullYear() + 543 - clubApplicant[0]?.user.admission_year}</p>
                      <p className="mb-6"><strong>สาขา : </strong>{clubApplicant[0]?.user.department}</p>
                    </div>
                  </div>
                </div>

                {/* รายละเอียดการสมัคร */}
                <div className="w-1/2">
                  <div className="flex flex-col w-full">
                    <h3 className="text-lg font-semibold mb-2">รายละเอียดการสมัคร</h3>
                    <div className="flex flex-row p-4 gap-8 rounded-lg">
                      <div className="flex flex-col">
                        <p className="mb-6"><strong>ตำแหน่ง : </strong>{clubApplicant[0].role_apply}</p>
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
                            onClick={() => window.open(clubApplicant[0].filename, '_blank')}
                          >
                            ผลงานผู้สมัคร
                          </Button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* คำอธิบายเพิ่มเติม */}
              
              <div className="flex flex-col w-full">
                <h3 className="text-lg font-semibold mb-2">คำอธิบายเพิ่มเติม</h3>
                <div className="flex max-w-3xl">
                  <p className="mb-6 px-6 break-words max-w-full">{clubApplicant[0].Description}</p>
                </div>
              </div>
       
              {/* Reply */}
              <div className="flex flex-col w-full bg-grey">
                <div className="h-fit w-full flexbox justify-end mt-10  gap-1">
                  <ThemeProvider theme={theme}> 
                  <h1 className="text-[20px] font-semibold">ตอบกลับ</h1>
                    <div className="flex justify-end pl-10 mt-1">
                    <input
                            type="text"
                            placeholder="เหตุผลในการปฏิเสธ"
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
                          ปฏิเสธ
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
                              setOpentype("reject");
                              setopen(true);
                            }}
                          >
                            ปฏิเสธ
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="success"
                          sx={{
                            boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                            mr: 0,
                            paddingX: "3vw",
                            bgcolor: "#7CE9BF",
                            color: "#1A1A1A",
                            "&:hover": {
                              bgcolor: "#7CE9BF",
                              boxShadow: "0px 0px 5px 0.1px #7CE9BF",
                            },
                          }}
                          onClick={() => {
                            setOpentype("approve");
                            setopen(true);
                          }}
                        >
                          อนุมัติ
                        </Button>
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

export default ClubApplicantsReqDetail;
