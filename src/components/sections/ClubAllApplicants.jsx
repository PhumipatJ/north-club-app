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
  Paper,
  Avatar,
  ThemeProvider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import supabaseService from "../../service/supabaseService";
import theme from "../Theme";
import { styled } from "@mui/system";
import { useLocation ,useParams} from "react-router-dom";
import { List } from "lucide-react";
import Loading from "../loading";
import ClubApplicantsBox from "./ClubApplicantBox";

const ClubAllApplicants = () => {
  const [clubMembers, setClubMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const supabase = supabaseService.getClient();
  const location = useLocation();
  const { clubId } = useParams();

  useEffect(() => {
    const fetchClubMembers = async () => {
      const { data, error } = await supabase
        .from("clubMembers")
        .select("club_id, email, position, created_at, user(name, email)")
        .eq("club_id", clubId);
  
      if (error) {
        console.error("Error fetching clubs:", error);
      } else {
        // Define the custom order of positions
        const positionOrder = [
          "ประธานชมรม", 
          "รองประธานชมรม", 
          "กรรมการ", 
          "เลขานุการ", 
          "ผู้ช่วยเลขานุการ", 
          "สมาชิกชมรม"
        ];
  
        // Sort data by the custom position order
        const sortedData = data.sort((a, b) => {
          return positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position);
        });
  
        console.log(sortedData);
        setClubMembers(sortedData);
      }
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
  
    fetchClubMembers();
  }, []);
  
  
  
  const CustomTableCell = styled(TableCell)({
    borderBottom: '2px solid #FF7E69',
    color: '#FF7E69',
    textAlign:'center',
  });
  if(loading){
    return <Loading/>
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <ThemeProvider theme={theme}>
      <Container className="p-6 mt-24 min-h-[77vh] flex flex-col justify-center">
        <div className="flex max-w-6xl w-full">
          <div className=" w-full h-fit flex">
            <h1 className="text-4xl font-bold my-auto ">จัดการสมาชิกชมรม</h1>
          </div>
        </div>
        
        <div className="flex justify-between gap-10 h-[calc(100vh-184px)]">
          <ClubApplicantsBox clubId={clubId}/>
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
                  <CustomTableCell>รูป</CustomTableCell>
                  <CustomTableCell>ชื่อ-นามสกุล</CustomTableCell>
                  <CustomTableCell>Email</CustomTableCell>
                  <CustomTableCell>วันที่เข้าชมรม</CustomTableCell>
                  <CustomTableCell>ตำแหน่ง</CustomTableCell>
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
                ) : clubMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{borderColor:'#fff'}}>
                      ไม่มีชมรม
                    </TableCell>
                  </TableRow>
                ) : (
                  clubMembers.map((club) => (
                    <TableRow key={club.club_id} sx={{'&:hover':{backgroundColor:'#f9f9f9' , cursor:'pointer'}}} 
                    onClick={()=>navigate(`/clubs/${club.club_id}`)}>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>
                        <Avatar src="/assets/Maskgroup.png"/>
                      </TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.user?.name}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.user?.email}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{formatDate(club.created_at)}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.position}</TableCell>
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

export default ClubAllApplicants;
