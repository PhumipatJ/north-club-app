import { useState, useEffect } from "react";
import { Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Avatar, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import supabase from "../../../supabaseClient";

const AdminRespond = () => {
  const [pendingClubs, setPendingClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingClubs = async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("status", "FALSE");

      if (error) {
        console.error("Error fetching clubs:", error);
      } else {
        setPendingClubs(data);
      }
      setLoading(false);
    };

    fetchPendingClubs();
  }, []);

  const handleApprove = async (clubId) => {
    const { error } = await supabase
      .from("clubs")
      .update({ status: "TRUE" })
      .eq("club_id", clubId);

    if (error) {
      console.error("Error approving club:", error);
    } else {
      setPendingClubs(pendingClubs.filter((club) => club.club_id !== clubId));
    }
  };

  const handleReject = async (clubId) => {
    const { error } = await supabase
      .from("clubs")
      .update({ status: "rejected" })
      .eq("club_id", clubId);

    if (error) {
      console.error("Error rejecting club:", error);
    } else {
      setPendingClubs(pendingClubs.filter((club) => club.club_id !== clubId));
    }
  };

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
      คำขอสร้างชมรม
      </Typography>
      <Button variant="contained" color="primary" sx={{ mr: 2 }} >
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
                  ไม่มีคำขอที่รอดำเนินการ
                </TableCell>
              </TableRow>
            ) : (
              pendingClubs.map((club) => (
                <TableRow key={club.club_id}>
                  <TableCell>
                    <Avatar src={club.club_avatar} alt={club.club_name} />
                  </TableCell>
                  <TableCell>{club.club_name}</TableCell>
                  <TableCell>{club.club_type}</TableCell>
                  <TableCell>{club.member_count || "N/A"}</TableCell>
                  <TableCell>{club.founded_date || "N/A"}</TableCell>
                  <TableCell>{club.club_adviser}</TableCell>
                  <TableCell>
                    <Chip label="รออนุมัติ" color="warning" />
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

export default AdminRespond;
