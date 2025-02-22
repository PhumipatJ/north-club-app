import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Avatar, CircularProgress } from "@mui/material";
import supabase from "../../../supabaseClient";

const ApprovalDetail = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

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
      }
      setLoading(false);
    };

    fetchClubDetails();
  }, [clubId]);

  if (loading) return <CircularProgress />;
  if (!club) return <Typography>Club not found</Typography>;

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
    </Container>
  );
};

export default ApprovalDetail;
