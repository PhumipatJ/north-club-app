import { useState, useEffect } from "react";
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Avatar, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import supabase from "../../../supabaseClient";

const ApprovalHistory = () => {
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingClubs = async () => {
      const { data, error } = await supabase
        .from("approvalHistory")
        .select("*")
    
      if (error) {
        console.error("Error fetching clubs:", error);
      } else {
        setPendingClubs(
          data.map((club) => ({
            ...club,
            approve_date: new Date(club.approve_date)
              .toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" })
          }))
        );
      }
      setLoading(false);
    };
    

    fetchPendingClubs();
  }, []);

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        คำขอที่ตอบแล้ว
      </Typography>
      <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => navigate("/adminApprove")}>
        ชมรมทั้งหมด
      </Button>
      <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => navigate("/adminRespond")}>
        คำขอสร้างชมรม
      </Button>
      <Button variant="contained" color="primary" sx={{ mr: 2 }}>
        คำขอที่ตอบแล้ว
      </Button>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>รูปชมรม</TableCell>
              <TableCell>ชื่อชมรม</TableCell>
              <TableCell>ประเภท</TableCell>
              <TableCell>จำนวนสมาชิก</TableCell>
              <TableCell>วันก่อตั้งชมรม</TableCell>
              <TableCell>อาจารย์ที่ปรึกษา</TableCell>
              <TableCell>สถานะ</TableCell>
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
                <TableCell colSpan={8} align="center">
                  ไม่มีประวัติ
                </TableCell>
              </TableRow>
            ) : (
              pendingClubs.map((club) => (
                <TableRow key={club.club_id}>
                  <TableCell>
                  <Avatar src={`${supabase.storage.from("club-avatars").getPublicUrl(club.club_avatar).data.publicUrl}`} alt={club.club_name} />
                  </TableCell>
                  <TableCell>{club.club_name}</TableCell>
                  <TableCell>{club.club_type}</TableCell>
                  <TableCell>{club.member_count || "N/A"}</TableCell>
                  <TableCell>{club.approve_date || "N/A"}</TableCell>
                  <TableCell>{club.club_adviser}</TableCell>
                  <TableCell>
                    {club.approval_status ? (
                      <Chip label="อนุมัติ" color="success" />
                    ) : (
                      <Chip label="ปฏิเสธ" color="error" />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ApprovalHistory;
