import { useState, useEffect } from "react";
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Avatar, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import supabase from "../../../supabaseClient";

const AdminApprove = () => {
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            founded_date: new Date(club.approve_date)
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
        ชมรมทั้งหมด
      </Typography>
      <Button variant="contained" color="primary" sx={{ mr: 2 }}>
        ชมรมทั้งหมด
      </Button>
      <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => navigate("/adminRespond")}>
        คำขอสร้างชมรม
      </Button>
      <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => navigate("/respondHistory")}>
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
                  ไม่มีคำขอสร้างชมรม
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
                  <TableCell>{club.founded_date || "N/A"}</TableCell>
                  <TableCell>{club.club_adviser}</TableCell>
                  <TableCell>
                    <Chip label="Active" color="success" />
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

export default AdminApprove;
