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
import Loading from "../loading";
import { styled } from"@mui/system";
import AdmindatabaseBox from "./AdmindatabaseBox";

const ApprovalHistory = () => {
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const supabase = supabaseService.getClient();

  useEffect(() => {
    const fetchPendingClubs = async () => {
      const { data, error } = await supabase
        .from("approvalHistory")
        .select("*");

      if (error) {
        console.error("Error fetching clubs:", error);
      } else {
        setPendingClubs(
          data.map((club) => ({
            ...club,
            approve_date: new Date(club.approve_date).toLocaleDateString(
              "th-TH",
              { day: "2-digit", month: "2-digit", year: "numeric" }
            ),
          }))
        );
      }
      setTimeout(() => {
        setLoading(false);
      }, 200);
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
            <h1 className="text-4xl font-bold my-auto ">คำขอที่ตอบแล้ว</h1>
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
                  bgcolor: location.pathname ==='/database/approvalHistory'?'#7CE9BF':"white",
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
        <AdmindatabaseBox/>
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
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <CustomTableCell>รูป</CustomTableCell>
                <CustomTableCell>ชื่อชมรม</CustomTableCell>
                <CustomTableCell>ประเภท</CustomTableCell>
                <CustomTableCell>สมาชิก</CustomTableCell>
                <CustomTableCell>วันที่ขอก่อตั้ง</CustomTableCell>
                <CustomTableCell>ที่ปรึกษา</CustomTableCell>
                <CustomTableCell>สถานะ</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                  </TableCell>
                </TableRow>
              ) : pendingClubs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    ไม่มีประวัติ
                  </TableCell>
                </TableRow>
              ) : (
                pendingClubs.map((club) => (
                  <TableRow key={club.club_id}>
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
                    <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.approve_date || "N/A"}</TableCell>
                    <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>{club.club_adviser}</TableCell>
                    <TableCell sx={{textAlign:'center', borderColor:'#fff'}}>
                      {club.approval_status ? (
                        <h3 className="text-[#7CE9BF]">อนุมัติ</h3>
                      ) : (
                        <h3 className="text-[#FF7E69]">ปฏิเสธ</h3>
                        
                      )}
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

export default ApprovalHistory;
