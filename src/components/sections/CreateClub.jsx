import { useState, useEffect } from "react";
import { Button, TextField, FormControl, FormControlLabel, Radio, RadioGroup, Container, Typography, Box } from "@mui/material";
import supabase from "../../../supabaseClient";
import authService from "../../service/AuthService";

const CreateClub = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [clubName, setClubName] = useState("");
  const [clubType, setClubType] = useState(""); // Single selection
  const [clubAdviser, setClubAdviser] = useState(""); // New field
  const [clubQuote, setClubQuote] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [applicationDocument, setApplicationDocument] = useState(null);
  const [clubAvatar, setClubAvatar] = useState(null);
  // change on positionFrontEnd to display on Club Member text field not the positions na
  //const positionFrontEnd = ["ประธานชมรม", "รองประธานชมรม", "กรรมการ", "กรรมการ", "กรรมการ", "กรรมการ", "เลขานุการ", "ผู้ช่วยเลขานุการ"];
  const positions = ["club_president", "vice_president", "committee_member", "committee_member", "committee_member", "committee_member", "secretary", "assistant_secretary"];
  // don't change positions. it use on database na frontend hua kuy
  const [members, setMembers] = useState(
    positions.map(position => ({ email: "", position }))
  );
  const clubTypes = ["Sports", "Academic", "Volunteer", "Arts"];

  useEffect(() => {
    const fetchUserEmail = async () => {
      const session = await authService.getSession();
      if (session) {
        const email = await authService.getEmail(session.user.id);
        if (email) {
          setCurrentUserEmail(email);
          setMembers(prevMembers => {
            const updatedMembers = [...prevMembers];
            updatedMembers[0].email = email; // Set president's email
            return updatedMembers;
          });
        }
      }
    };
    fetchUserEmail();
  }, []);

  const handleClubTypeChange = (e) => {
    setClubType(e.target.value);
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
     alert(`Creating club... (Logged-in user: ${currentUserEmail})`);

    const emails = members.map((m) => m.email.trim()).filter((email) => email !== "");

    const { data: existingUsers, error: emailError } = await supabase
        .from("user") 
        .select("email")
        .in("email", emails);

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
        club_adviser: clubAdviser,
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
    
    if (clubId) {
      const memberData = members.filter(m => m.email.trim() !== "").map(m => ({
        email: m.email,
        club_id: clubId,
        position: m.position,
      }));
      
      console.log(memberData);

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
          <RadioGroup value={clubType} onChange={handleClubTypeChange}>
            {clubTypes.map((type) => (
              <FormControlLabel key={type} value={type} control={<Radio />} label={type} />
            ))}
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField label="Club Adviser" value={clubAdviser} onChange={(e) => setClubAdviser(e.target.value)} required />
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
            <TextField label="Member Email" type="email" value={member.email} onChange={(e) => handleMemberChange(index, e.target.value)} fullWidth required disabled={index === 0}/>
            <TextField label="Position" value={member.position} fullWidth disabled />
          </Box>
        ))}
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>Create Club</Button>
      </form>
    </Container>
  );
};

export default CreateClub;
