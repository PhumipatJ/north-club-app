import { useState, useEffect ,} from "react";
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  ThemeProvider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import supabaseService from "../../service/supabaseService";
import theme from "../Theme";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Loading from "../loading";
import AdmindatabaseBox from "./AdmindatabaseBox";
import { List } from "lucide-react";
const AdminActivitiesRequest = () => {
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const supabase = supabaseService.getClient();

  useEffect(() => {
    const fetchPendingClubs = async () => {
      const { data, error } = await supabase
        .from("event")
        .select("created_at,title,status,start_date,id, clubs!inner(club_name,club_avatar)")
        .eq("approval_status", false);

      if (error) {
        console.error("Error fetching clubs:", error);
      } else {
        setPendingClubs(
          data.sort((a,b)=>a.created_at.localeCompare(b.created_at)).map((club) => ({
            ...club,
            req_date: new Date(club.created_at).toLocaleDateString(
              "th-TH",
              { day: "2-digit", month: "2-digit", year: "numeric" })
          }))
        );
      }
      console.log(data)
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    fetchPendingClubs();
  }, []);
  
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
      <Container className="p-6 mt-24 min-h-[77vh] flex flex-col justify-center">
        <div className="flex max-w-6xl w-full">
          <div className=" w-full h-fit flex">
            <h1 className="text-4xl font-bold my-auto ">รายชื่อกิจกรรม</h1>
            <div className="my-auto flex ml-auto w-fit">
              <Button
                variant="contained"
                color="primary"
                sx={{
                  boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                  mr: 2,
                  paddingX: "3vw",
                  bgcolor: location.pathname ==='/database/adminActivitiesReq'? '#7CE9BF' : 'white',
                  color: "#1A1A1A",
                  "&:hover": { bgcolor: "#7CE9BF",boxShadow:"0px 0px 2px #7CE9BF60"},
                }}
              >
                คำขอกิจกรรม
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between gap-10 h-[calc(100vh-184px)]">
          <AdmindatabaseBox/>
          <TableContainer
            component={Paper}
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
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <CustomTableCell>ผู้จัด</CustomTableCell>
                  <CustomTableCell>วันที่ส่งคำขอ</CustomTableCell>
                  <CustomTableCell>ชื่อกิจกรรม</CustomTableCell>
                  <CustomTableCell>รูปแบบ</CustomTableCell>
                  <CustomTableCell>วันจัดงาน</CustomTableCell>
                  <CustomTableCell>รายละเอียด</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{overflowY:"auto"}}>
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
                  pendingClubs.map((event) => (
                    <TableRow key={event.id} sx={{'&:hover':{backgroundColor:'#f9f9f9' , cursor:'pointer'}}} 
                    onClick={()=>navigate(`/database/ReqDetail/${event.id}`)}
                    >
                      <TableCell sx={{textAlign:'center', borderColor:'#fff',display:'flex',justifyContent:'center'}}>
                         <Avatar
                          src={`${
                            supabase.storage
                              .from("club-avatars")
                              .getPublicUrl(event?.clubs.club_avatar).data.publicUrl
                          }`}
                          alt={event?.clubs.club_name}
                        /> 
                      </TableCell> 
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{event.req_date}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{event.title}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{event.status}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{event.start_date || "N/A"}</TableCell>
                      <TableCell sx={{borderColor:'#fff'}}>
                        <div className="h-[100%] w-[100%] justify-center flex" >
                        <List className="text-[#FF7E69] "/>
                        </div>
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

export default AdminActivitiesRequest;
