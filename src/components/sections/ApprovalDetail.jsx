import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Avatar, CircularProgress, Button } from "@mui/material";
import supabase from "../../../supabaseClient";

const ApprovalDetail = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documentUrl, setDocumentUrl] = useState("");

  useEffect(() => {
    const fetchClubDetails = async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("club_id", clubId)
        .single();

      if (error) {
        console.error("Error fetching club details:", error);
      } else {
        setClub(data);

        // Generate document URL if it exists
        if (data.application_document) {
          const { data: urlData } = supabase.storage
            .from("club-documents")
            .getPublicUrl(data.application_document);
          setDocumentUrl(urlData.publicUrl);
        }
      }
      setLoading(false);
    };

    fetchClubDetails();
  }, [clubId]);

  if (loading) return <CircularProgress />;
  if (!club) return <Typography>Club not found</Typography>;

  const handleApprove = async (clubId) => {
    const today = new Date().toISOString().slice(0, 19).replace("T", " "); // รูปแบบ YYYY-MM-DD HH:MM:SS
  
    const { error } = await supabase
      .from("clubs")
      .update({ club_approval: true, approve_date: today })
      .eq("club_id", clubId);
  
    if (error) {
      console.error("Approval failed:", error);
    } else {
      alert("อนุมัติชมรมเรียบร้อย!");
      window.history.back(); // กลับไปหน้าก่อนหน้า
    }
  };
  
  const handleReject = async (clubId, clubOwnerEmail) => {
    const confirmReject = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธชมรมนี้?");
    if (!confirmReject) return;
  
    const mailtoLink = `mailto:${clubOwnerEmail}?subject=ปฏิเสธการขออนุมัติชมรม&body=ขออภัย, การขออนุมัติชมรมของคุณไม่ได้รับการอนุมัติ.`;
    window.location.href = mailtoLink;
  
    const { error } = await supabase
      .from("clubs")
      .delete()
      .eq("club_id", clubId);
  
    if (error) {
      console.error("Rejection failed:", error);
    } else {
      alert("ปฏิเสธชมรมเรียบร้อย!");
      window.history.back();
    }
  };
  
  

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>{club.club_name}</Typography>
      <Avatar
        src={`${supabase.storage.from("club-avatars").getPublicUrl(club.club_avatar).data.publicUrl}`}
        alt={club.club_name}
        sx={{ width: 100, height: 100, mb: 2 }}
      />
      <Typography variant="h6">ประเภท: {club.club_type}</Typography>
      <Typography>คำขวัญ: {club.club_quote || "N/A"}</Typography>
      <Typography>คำอธิบาย: {club.club_description || "N/A"}</Typography>
      <Typography>ที่ปรึกษา: {club.club_adviser || "N/A"}</Typography>

      {documentUrl && (
        <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }} 
            onClick={() => window.open(documentUrl, "_blank")}
        >
            เปิดเอกสาร
      </Button>      
      )}
      
      <Button 
        variant="contained" 
        color="success" 
        sx={{ mt: 2, mr: 2 }} 
        onClick={() => handleApprove(clubId)}
        >
        อนุมัติ
        </Button>

        <Button 
        variant="contained" 
        color="error" 
        sx={{ mt: 2 }} 
        onClick={() => handleReject(clubId)}
        >
        ปฏิเสธ
      </Button>

    </Container>
  );
};

export default ApprovalDetail;
