import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Avatar,
  ThemeProvider,
  Box,
} from "@mui/material";
import {SquareChartGantt} from "lucide-react";
import { useNavigate ,useLocation} from "react-router-dom";
import supabase from "../../../supabaseClient";
import theme from "../Theme";
import Loading from "../loading";
import {styled} from "@mui/system";
import ApprovalPopup from "./ApprovalPopup";

const AdminRespond = () => {
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [openDetail,setOpenDetail] = useState(false);
  const [requestID,setRequestId] = useState(null);
  const [membercount,setCount] = useState(0);
  const [clubdata,setClubdata] = useState([]);
    useEffect(() => {
    const fetchPendingClubs = async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("*, member_count:clubMembers(count)")
        .eq("club_approval", false);

      if (error) {
        console.error("Error fetching clubs:", error);
      } else {
        setPendingClubs(
          data.map((club) => ({
            ...club,
            member_count: club.member_count[0]?.count || 0,
            founded_date: new Date(club.created_at).toLocaleDateString(
              "th-TH",
              { day: "2-digit", month: "2-digit", year: "numeric" }
            ),
          }))
        );
        console.log(data);
      }
      setTimeout(() => {
        setLoading(false);
      }, 200);
    };

    fetchPendingClubs();
  }, []);
  const handleRequestDetail =(club,id,count)=>{
    setClubdata(club);
    setRequestId(id);
    setOpenDetail(true);
    setCount(count);
  };
  const handlePopup =()=>{
    setOpenDetail(false);
  };
  const CustomTableCell = styled(TableCell)({
    borderBottom: '2px solid #FF7E69',
    color: '#FF7E69',
    textAlign:'center',
  });
  if(loading){
    return <Loading/>
  }
  return (
    <ThemeProvider theme={theme}>
      {openDetail === true &&(
        <ApprovalPopup clubdata={clubdata} requestID={requestID} count={membercount} onClose={handlePopup}/>
      )}
      <Container className="p-6 mt-24 min-h-[77vh] flex flex-col justify-center">
      <div className="flex max-w-6xl w-full">
          <div className=" w-full h-fit flex">
            <h1 className="text-4xl font-bold my-auto ">คำขอสร้างชมรม</h1>
            <div className="my-auto flex ml-auto w-fit">
              <Button
                variant="contained"
                color="primary"
                sx={{
                  boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                  mr: 2,
                  paddingX: "3vw",
                  bgcolor: location.pathname ==='/database/adminRespond'?'#7CE9BF':"white",
                  color: "#1A1A1A",
                  "&:hover": { bgcolor: "#7CE9BF",boxShadow:"0px 0px 2px #7CE9BF60"},
                }}
                onClick={() => navigate("/database/adminRespond")}
              >
                คำขอสร้างชมรม
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                  mr: 0,
                  paddingX: "3vw",
                  bgcolor: "white",
                  color: "#1A1A1A",
                  "&:hover": { bgcolor: "#7CE9BF",boxShadow:"0px 0px 2px #7CE9BF60"},
                }}
                onClick={() => navigate("/database/approvalHistory")}
              >
                คำขอที่ตอบแล้ว
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-10 h-[calc(100vh-184px)]">
          <div className="bg-[#fff] mt-10 rounded-[5px] w-[13dvw] h-fit sticky" style={{boxShadow:'0px 0px 2px rgba(26,26,26,0.25'}}>
          <Button
                variant="contained"
                color="primary"
                sx={{
                  boxShadow: "none",
                  width:'100%',
                  bgcolor: location.pathname ==='/database/adminRespond' ? '#FF7E69' : "white",
                  color: location.pathname ==='/database/adminRespond' ? 'white' : "#1A1A1A",
                  "&:hover": { bgcolor: "#FF7E69",boxShadow:"none"},
                  borderRadius:"5px 5px 0 0",
                }}
                onClick={() => navigate("/database")}
              >
                รายชื่อชมรม
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  boxShadow: "none",
                  width:'100%',
                  bgcolor: "white",
                  color: "#1A1A1A",
                  "&:hover": { bgcolor: "#FF7E69",boxShadow:"none"},
                  borderRadius:"0",
                }}
                onClick={() => setOpenDetail(true)}
              >
                สิทธิ์ผู้ดูแล
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  boxShadow: "none",
                  width:'100%',
                  bgcolor: "white",
                  color: "#1A1A1A",
                  "&:hover": { bgcolor: "#FF7E69",boxShadow:"none"},
                  borderRadius:"0",
                }}
                onClick={() => navigate("/approvalHistory")}
              >
                ผู้ใช้ทั้งหมด
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  boxShadow: "none",
                  width:'100%',
                  bgcolor: "white",
                  color: "#1A1A1A",
                  "&:hover": { bgcolor: "#FF7E69",boxShadow:"none"},
                  borderRadius:"0 0 5px 5px",
                }}
                onClick={() => navigate("/approvalHistory")}
              >
                กิจกรรม
              </Button>
          </div>
          <TableContainer component={Paper}
            sx={{
              overflowY:'auto',
              mt: 2,
              boxShadow:'none',
              "&::-webkit-scrollbar": {
                width: "1px",
                height:'1px',
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor:'#FF7E697D',
                borderRadius: "10px",
                transition: "background-color 1s ease" 
              },
              "&::-webkit-scrollbar-thumb:hover":{
                backgroundColor:'#FF7E69',
              },
            }}>
          <Table>
            <TableHead>
              <TableRow>
                <CustomTableCell>รูป</CustomTableCell>
                <CustomTableCell>ชื่อชมรม</CustomTableCell>
                <CustomTableCell>ประเภท</CustomTableCell>
                <CustomTableCell>สมาชิก</CustomTableCell>
                <CustomTableCell>วันที่ขอก่อตั้ง</CustomTableCell>
                <CustomTableCell>ที่ปรึกษา</CustomTableCell>
                <CustomTableCell>รายละเอียด</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : pendingClubs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{borderColor:'#fff'}}>
                    ไม่มีชมรม
                  </TableCell>
                </TableRow>
              ) : (
                pendingClubs.map((club) => (
                  <TableRow key={club.club_id} sx={{'&:hover':{cursor:'pointer',backgroundColor:'#f9f9f9'}}}
                  // onClick={()=>navigate(`/database/approvalDetail/${club.club_id}`)}
                  >
                    
                    <TableCell sx={{borderColor:'#fff'}}>
                      <Box sx={{display:'flex', justifyContent:'center',}}>
                      <Avatar
                        src={`${
                          supabase.storage
                            .from("club-avatars")
                            .getPublicUrl(club.club_avatar).data.publicUrl
                        }`}
                        alt={club.club_name}
                      />
                      </Box>
                    </TableCell>
                    <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.club_name}</TableCell>
                    <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.club_type}</TableCell>
                    <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.member_count || "N/A"}</TableCell>
                    <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.founded_date || "N/A"}</TableCell>
                    <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.club_adviser}</TableCell>
                    <TableCell sx={{borderColor:'#fff',justifyContent:'center'}}>
                        <Box sx={{'&:hover':{cursor:'pointer',filter:'drop-shadow(0px 0px 2px #7CE9BF7D)'},display:'flex',justifyContent:'center',color:'#7CE9BF'}}>
                        <SquareChartGantt className="h-full"
                        onClick={() => handleRequestDetail(club,club.club_id,club.member_count)
                        }></SquareChartGantt>
                        </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
        
      </Container>
    </ThemeProvider>
  );
};

export default AdminRespond;
