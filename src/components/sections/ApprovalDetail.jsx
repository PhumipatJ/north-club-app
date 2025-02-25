import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Avatar, CircularProgress, Button,ThemeProvider} from "@mui/material";
import { useLocation } from "react-router-dom";
import supabase from "../../../supabaseClient";
import theme from "../Theme";

const ApprovalDetail = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documentUrl, setDocumentUrl] = useState("");
  const location = useLocation();
  const { member_count } = location.state || {};

  useEffect(() => {
    const fetchClubDetails = async () => {
    console.log(member_count)
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
  const today = new Date().toISOString().slice(0, 19).replace("T", " "); // YYYY-MM-DD HH:MM:SS

  const handleApprove = async (clubId) => {
    console.log(member_count)
    // Insert into approvalHistory
    const { error: insertError } = await supabase
    .from("approvalHistory")
    .insert([
        {
        club_name: club.club_name,
        club_avatar: club.club_avatar,
        club_type: club.club_type,
        member_count: member_count,
        approve_date: today,
        club_adviser: club.club_adviser,
        approval_status: true,
        },
    ]);

    if (insertError) {
        console.error("updated history failed:", error);
        return;
      }

    // Approve the club and set approval date
    let { error } = await supabase
      .from("clubs")
      .update({ club_approval: true, approve_date: today })
      .eq("club_id", clubId);

    if (error) {
      console.error("Approval failed:", error);
      return;
    }

    // Get all emails of members in the club
    const { data: clubMembers, error: membersError } = await supabase
      .from("clubMembers")
      .select("email")
      .eq("club_id", clubId);

    if (membersError) {
      console.error("Failed to fetch club members:", membersError);
      return;
    }

    // Update role of each member to "club"
    for (const member of clubMembers) {
      const { email } = member;

      const { error: updateError } = await supabase
        .from("user")
        .update({ role: "club" })
        .eq("email", email);

      if (updateError) {
        console.error(`Failed to update role for ${email}:`, updateError);
      }
    }

    alert("อนุมัติชมรมเรียบร้อย!");
    window.history.back(); // กลับไปหน้าก่อนหน้า
};

  
const handleReject = async (clubId) => {
    console.log(member_count)
    // Insert into approvalHistory
    const { error: insertError } = await supabase
    .from("approvalHistory")
    .insert([
        {
        club_name: club.club_name,
        club_avatar: club.club_avatar,
        club_type: club.club_type,
        member_count: member_count,
        approve_date: today,
        club_adviser: club.club_adviser,
        approval_status: false,
        },
    ]);

    if (insertError) {
      console.error("updated history failed:", insertError);
      return;
    }

    // Delete club and clubMembers from database
    const { Cerror } = await supabase.from("clubMembers").delete().eq("club_id", clubId);
    const { CMerror } = await supabase.from("clubs").delete().eq("club_id", clubId);
  
    if (Cerror || CMerror) {
      console.error("Rejection failed:", Cerror || CMerror);
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