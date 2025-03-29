import { useState, useEffect ,} from "react";
import {
  Container,
  ThemeProvider,
  Button,
  Box
} from "@mui/material";
import { useNavigate ,useParams,useMatch} from "react-router-dom";
import supabaseService from "../../service/supabaseService";
import theme from "../Theme";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Loading from "../loading";
import AdmindatabaseBox from "./AdmindatabaseBox";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import {MapPin,Calendar,File} from "lucide-react";
import ConfirmCard from "../confirmCard";
const ClubApplicantsReqDetail = () => {
  const match = useMatch('/database/ReqDetail/*')
  const { eventId } = useParams();
  const [eventDetail, setEventDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason,setReason] = useState('');
  const [doc,setdoc] = useState('');
  const [isConfirmOpen,setopen] = useState(false);
  const navigate = useNavigate(0);
  const supabase = supabaseService.getClient();

  useEffect(() => {
    const fetchingEvent = async()=>{
        const {data,error} = await supabase
        .from("event")
        .select("*, clubs!inner(club_name,club_id,facebook,instagram,mail)")
        .eq("id",eventId)
        .single()
        if(error){
            console.log(error);
            return;
        }
        else{
            setEventDetail(data)
            setdoc(
              supabase.storage
              .from('club-documents')
              .getPublicUrl("/"+data?.document).data.publicUrl
            )
            setTimeout(() => {
                setLoading(false);
              }, 500);
        }

    }
      
    fetchingEvent();
  }, []);
  const handlelink =(link)=>{
    window.open(link,"_blank");
  }
  const handleApprove = async () =>{
    const { error: updateError } = await supabase
    .from("event")
    .update({ approval_status: true })
    .eq("id", eventDetail.id);

  if (updateError) {
    console.error(`Failed to update role for ${email}:`, updateError);
  }
  }
  if(loading){
    return <Loading/>
  }
  return (
    <ThemeProvider theme={theme}>
      <ConfirmCard
          isOpen={isConfirmOpen}
          onClose={() => setopen(false)}
          type=""
          text=""
          onConfirm={handleApprove}
          onsecondConfirm={()=>navigate('/database/adminActivitiesReq')}
        />
      <Container className="p-6 mt-24 min-h-[77vh] flex flex-col justify-center">
        <div className="flex max-w-6xl w-full">
          <div className=" w-full h-fit flex">
            <h1 className="text-4xl font-bold my-auto ">กิจกรรม</h1>
            <div className="my-auto flex ml-auto w-fit">
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/database/adminActivitiesReq")}
                sx={{
                  boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                  mr: 2,
                  paddingX: "3vw",
                  bgcolor: location.pathname ==='/database/adminActivitiesReq'||match? '#7CE9BF' : 'white',
                  color: "#1A1A1A",
                  "&:hover": { bgcolor: "#7CE9BF",boxShadow:"0px 0px 2px #7CE9BF60"},
                }}
              >
                คำขอกิจกรรม
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between gap-10 h-fit ">
          <AdmindatabaseBox/>
          <div className="mx-auto p-12 shadow-lg rounded-xl border border-gray-200 bg-white mb-10 mt-10 h-fit max-w-[75%]">
            <div className="flex flex-col w-full">
                <div className="flex flex-wrap md:flex-nowrap gap-4">
                    <div className="flex items-center justify-center relative overflow-hidden rounded-lg w-full md:w-1/2 aspect-[4/5]
                    ">
                        <img
                            src={`${
                              supabase.storage
                                .from("club-avatars")
                                .getPublicUrl(eventDetail?.poster).data.publicUrl
                            }`}
                            alt="KMUTNB Alumni Talk Season 2"
                            className="w-fit h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1 px-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="bg-[#FF7E69] text-white px-3 py-1 rounded-md text-sm font-semibold">
                                {eventDetail.start_date}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#FF7E69]">{eventDetail.title}</h2>
                        <p className="text-gray-600 text-sm">Organized by {eventDetail.clubs.club_name}</p>
                        <div className="mt-2 space-y-2 text-gray-700 text-sm">
                            <div>
                                <h2 className="text-xl font-semibold text-[#FF7E69]">สถานที่จัดกิจกรรม</h2>
                                <div className="flex items-center gap-2 pl-4">
                                    <MapPin size={16} />
                                    <span>{eventDetail.location}</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-[#FF7E69]">เวลากิจกรรม</h2>
                                <div className="flex items-center gap-2 pl-4">
                                    <Calendar size={16} />
                                    <span>{eventDetail.start_time} - {eventDetail.end_time} น.</span>
                                </div>
                            </div>
                            <Box
                  onClick={() => window.open(doc, "_blank")}
                  sx={{
                    display: "flex",
                    borderRadius: "5px",
                    width: "fit-content",
                    marginLeft: "10px",
                    paddingX: "15px",
                    alignItems: "end",
                    color: "#1A1A1A7D",
                    marginTop:'10%',
                    "&:hover": {
                      cursor: "pointer",
                      bgcolor: "#f9f9f9",
                      color: "#1A1A1A",
                    },
                  }}
                >
                  <File className="text-[#7CE9BF] mr-3" />{" "}
                  <h1 className="text-[15px]">
                    {eventDetail.document}
                  </h1>
                </Box>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-semibold" onClick={()=>console.log(doc)}>รายละเอียดกิจกรรม</h3>
                    <p className="text-sm text-gray-700 mt-1">
                        {eventDetail.description}
                    </p>
                </div>
                <div className="flex flex-col items-center mt-6">
                    <h2 className="text-xl font-semibold text-[#FF7E69]">สอบถามเพิ่มเติม</h2>
                    <div className="flex gap-4 mt-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2 cursor-pointer"
                        onClick={()=>handlelink(eventDetail.clubs.facebook)}>
                            <FaFacebook className="w-5 h-5 text-[#7CE9BF]" />
                            <p >{eventDetail.clubs.club_name}</p>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer"
                        onClick={()=>handlelink(eventDetail.clubs.instagram)}>
                            <FaSquareInstagram className="w-5 h-5 text-[#7CE9BF]" />
                            <p>{eventDetail.clubs.club_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <CiMail className="w-5 h-5 text-[#7CE9BF]" />
                            <p className="">{eventDetail.clubs.mail}</p>
                        </div>
                    </div>
                </div>
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
                    onClick={() => handleReject()}
                  >
                    UAI
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
                  onClick={() => setopen(true)}
                >
                  UIA
                </Button>
            </div>
              </ThemeProvider>
            </div>
            </div>
        </div>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default ClubApplicantsReqDetail;
