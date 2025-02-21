import { useState } from "react";
import { Button, TextField, FormControl, FormControlLabel, Checkbox, Container, Typography, Box } from "@mui/material";
import { createClient } from "@supabase/supabase-js";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let docUrl = "";
    let avatarUrl = "";

    if (applicationDocument) {
      const { data, error } = await supabase.storage
        .from("club-documents")
        .upload(`documents/${applicationDocument.name}`, applicationDocument);
      if (error) {
        console.error("Upload error", error);
        return;
      }
      docUrl = data.path;
    }

    if (clubAvatar) {
      const { data, error } = await supabase.storage
        .from("club-avatars")
        .upload(`avatars/${clubAvatar.name}`, clubAvatar);
      if (error) {
        console.error("Avatar upload error", error);
        return;
      }
      avatarUrl = data.path;
    }

    const { error } = await supabase.from("clubs").insert([
      {
        club_name: clubName,
        club_type: clubType,
        club_quote: clubQuote,
        club_description: clubDescription,
        application_document: docUrl,
        club_avatar: avatarUrl,
        members,
      },
    ]);

    if (error) {
      console.error("Insert error", error);
    } else {
      alert("Club created successfully");
    }
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
