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
  Typography,
  Paper,
  Avatar,
  Chip,
  ThemeProvider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";
import theme from "../Theme";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";

const AdminApprove = () => {
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchPendingClubs = async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("*, member_count:clubMembers(count)")
        .eq("club_approval", true);

      if (error) {
        console.error("Error fetching clubs:", error);
      } else {
        setPendingClubs(
          data.map((club) => ({
            ...club,
            member_count: club.member_count[0]?.count || 0,
            founded_date: new Date(club.approve_date).toLocaleDateString(
              "th-TH",
              { day: "2-digit", month: "2-digit", year: "numeric" }
            ),
          }))
        );
      }
      setLoading(false);
    };

    fetchPendingClubs();
  }, []);

  const CustomTableCell = styled(TableCell)({
    borderBottom: '2px solid #FF7E69',
    color: '#FF7E69',
    textAlign:'center',
  });
  return (
    <ThemeProvider theme={theme}>
      <Container className="p-6 mt-24 min-h-[77vh] flex flex-col justify-center">
        <div className="flex max-w-6xl w-full">
          <div className=" w-full h-fit flex">
            <h1 className="text-4xl font-bold my-auto ">รายชื่อชมรม</h1>
            <div className="my-auto flex ml-auto w-fit">
              <Button
                variant="contained"
                color="primary"
                sx={{
                  boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                  mr: 2,
                  paddingX: "3vw",
                  bgcolor: "white",
                  color: "#1A1A1A",
                  "&:hover": { bgcolor: "#7CE9BF",boxShadow:"0px 0px 2px #7CE9BF60"},
                }}
                onClick={() => navigate("/adminRespond")}
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
                onClick={() => navigate("/approvalHistory")}
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
                  bgcolor: "white",
                  color: "#1A1A1A",
                  "&:hover": { bgcolor: "#FF7E69",boxShadow:"none"},
                  borderRadius:"5px 5px 0 0",
                }}
                onClick={() => navigate("/approvalHistory")}
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
                onClick={() => navigate("/approvalHistory")}
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
                  <CustomTableCell>ชื่อชมรม</CustomTableCell>
                  <CustomTableCell>ประเภท</CustomTableCell>
                  <CustomTableCell>สมาชิก</CustomTableCell>
                  <CustomTableCell>วันก่อตั้ง</CustomTableCell>
                  <CustomTableCell>ที่ปรึกษา</CustomTableCell>
                  <CustomTableCell>สถานะ</CustomTableCell>
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
                    <TableCell colSpan={8} align="center">
                      ไม่มีชมรม
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingClubs.map((club) => (
                    <TableRow key={club.club_id} sx={{'&:hover':{backgroundColor:'#f9f9f9' , cursor:'pointer'}}}>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>
                        <Avatar
                          src={`${
                            supabase.storage
                              .from("club-avatars")
                              .getPublicUrl(club.club_avatar).data.publicUrl
                          }`}
                          alt={club.club_name}
                        />
                      </TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.club_name}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.club_type}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.member_count || "N/A"}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.founded_date || "N/A"}</TableCell>
                      <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.club_adviser}</TableCell>
                      {club.club_approval===true?(
                        <TableCell sx={{textAlign:'center', borderColor:'#fff',color:'#7CE9BF'}}>
                        Active
                      </TableCell>
                      ):(
                        <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>
                        Inactive
                      </TableCell>
                      )}
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

export default AdminApprove;
