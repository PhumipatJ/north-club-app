import { useState } from "react";
import { Button, TextField, FormControl, FormControlLabel, Checkbox, Container, Typography, Box } from "@mui/material";
import supabase from "../../../supabaseClient";

const CreateClub = () => {
  const [clubName, setClubName] = useState("");
  const [clubType, setClubType] = useState([]);
  const [clubQuote, setClubQuote] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [applicationDocument, setApplicationDocument] = useState(null);
  const [clubAvatar, setClubAvatar] = useState(null);
  const positions = ["ประธานชมรม", "รองประธานชมรม", "กรรมการ", "กรรมการ", "กรรมการ", "กรรมการ", "เลขานุการ", "ผู้ช่วยเลขานุการ"];
  const [members, setMembers] = useState(
    positions.map(position => ({ email: "", position }))
  );

  const clubTypes = ["Sports", "Music", "Tech", "Arts"];

  const handleClubTypeChange = (type) => {
    setClubType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleMemberChange = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index].email = value;
    setMembers(updatedMembers);
  };

  const uploadFile = async (file, bucket) => {
    if (!file) return "";
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      contentType: file.type,
    });
    
    if (error) {
      console.error(`Upload error (${bucket}):`, error);
      return "";
    }
    return data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert("Creating club...");

    // Get a list of all unique emails from the members
    const emails = members.map((m) => m.email.trim()).filter((email) => email !== "");

    //console.log("Checking these emails:", emails);

    const { data: existingUsers, error: emailError } = await supabase
        .from("user") 
        .select("email")
        .in("email", emails);

    //console.log("Existing Users:", existingUsers);
    //console.log("Supabase error:", emailError);

  if (emailError) {
    console.error("Error checking emails:", emailError);
    alert("Error checking member emails.");
    return;
  }

  const existingEmails = existingUsers.map((user) => user.email);
  const invalidEmails = emails.filter((email) => !existingEmails.includes(email));

  if (invalidEmails.length > 0) {
    alert(`The following emails are not registered: ${invalidEmails.join(", ")}`);
    return;
  }
    
    const avatarUrl = await uploadFile(clubAvatar, "club-avatars");
    const docUrl = await uploadFile(applicationDocument, "club-documents");

    const { data: clubData, error: clubError } = await supabase.from("clubs").insert([
      {
        club_name: clubName,
        club_type: clubType,
        club_quote: clubQuote,
        club_description: clubDescription,
        application_document: docUrl,
        club_avatar: avatarUrl,
      },
    ]).select("club_id");
    
    if (clubError) {
      console.error("Club insert error", clubError);
      return;
    }
    
    const clubId = clubData[0]?.club_id;
    //console.log(clubId)
    
    if (clubId) {
      const memberData = members.filter(m => m.email.trim() !== "").map(m => ({
        club_id: clubId,
        email: m.email,
        position: m.position,
      }));
      
      if (memberData.length > 0) {
        const { error: memberError } = await supabase.from("clubMembers").insert(memberData);
        if (memberError) {
          console.error("Members insert error", memberError);
          return;
        }
      }
    }
    
    alert("Club created successfully");
  };

  return (
    <Container className="pt-8">
      <Typography variant="h4">Create a Club</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <TextField label="Club Name" value={clubName} onChange={(e) => setClubName(e.target.value)} required />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Typography variant="body1">Club Type</Typography>
          {clubTypes.map((type) => (
            <FormControlLabel
              key={type}
              control={<Checkbox checked={clubType.includes(type)} onChange={() => handleClubTypeChange(type)} />}
              label={type}
            />
          ))}
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Club Quote" value={clubQuote} onChange={(e) => setClubQuote(e.target.value)} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Club Description" multiline rows={4} value={clubDescription} onChange={(e) => setClubDescription(e.target.value)} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Typography variant="body1">Upload Club Avatar</Typography>
          <input type="file" onChange={(e) => setClubAvatar(e.target.files[0])} />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Typography variant="body1">Upload Application Document</Typography>
          <input type="file" onChange={(e) => setApplicationDocument(e.target.files[0])} />
        </FormControl>
        <Typography variant="h6">Club Members</Typography>
        {members.map((member, index) => (
          <Box key={index} display="flex" gap={2} marginBottom={2}>
            <TextField label="Member Email" type="email" value={member.email} onChange={(e) => handleMemberChange(index, e.target.value)} fullWidth required />
            <TextField label="Position" value={member.position} fullWidth disabled />
          </Box>
        ))}
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>Create Club</Button>
      </form>
    </Container>
  );
};

export default CreateClub;
