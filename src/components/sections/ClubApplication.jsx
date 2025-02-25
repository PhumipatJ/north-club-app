import { useState, useEffect } from "react";
import { FileUp, ChevronDown, ChevronUp } from "lucide-react";
import supabase from "../../../supabaseClient";
import authService from "../../service/AuthService";

const ClubApplication = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [clubName, setClubName] = useState("");
  const [clubType, setClubType] = useState(""); // Single selection
  const [clubAdviser, setClubAdviser] = useState(""); // New field
  const [clubQuote, setClubQuote] = useState("");
  const [clubDescription, setClubDescription] = useState("");

  const [clubAvatar, setClubAvatar] = useState(null);
  const [clubAvatarName, setClubAvatarName] = useState("using (png, jpg, webp)");
  const [clubAvatarPreview, setClubAvatarPreview] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  
  const [applicationDocument, setApplicationDocument] = useState(null);
  const [fileName, setFileName] = useState("using (png, jpg, webp)");

  const positionFrontEnd = ["ประธานชมรม", "รองประธานชมรม", "กรรมการ", "กรรมการ", "กรรมการ", "กรรมการ", "เลขานุการ", "ผู้ช่วยเลขานุการ"];
  //const positions = ["club_president", "vice_president", "committee_member", "committee_member", "committee_member", "committee_member", "secretary", "assistant_secretary"];
  const [members, setMembers] = useState(
    positionFrontEnd.map(position => ({ email: "", position }))
  );

  const clubTypes = ["กีฬา", "วิชาการ", "อาสาและบำเพ็ญประโยชน์", "ศิลปะและวัฒนธรรม"];

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

  const handleClubTypeChange = (type) => {
    setClubType(type);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClubAvatarPreview(URL.createObjectURL(file));
      setClubAvatarName(e.target.files[0]?.name || "using (png, jpg, webp)");
      setClubAvatar(e.target.files[0]);
    }
  };

  const handleDocumentFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(e.target.files[0]?.name || "using (png, jpg, webp)");
      setApplicationDocument(e.target.files[0]);
    }
  };

  const handleMemberChange = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index].email = value;
    setMembers(updatedMembers);
  };

  const uploadFile = async (file, bucket) => {
    console.log(file)
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
    const club_tag = clubDescription.split(",").map(tag => tag.trim());
    const { data: clubData, error: clubError } = await supabase.from("clubs").insert([
      {
        club_name: clubName,
        club_type: clubType, 
        club_adviser: clubAdviser,
        club_quote: clubQuote,
        club_description: club_tag,
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
        club_id: clubId,
        email: m.email,
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
    <div className="max-w-5xl mx-auto mt-24 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6">คำขอสร้างชมรม</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold mb-1">โลโก้ชมรม</label>
          <div className="flex flex-col">
            <div className="flex flex-row items-center p-4 rounded-md text-center">
              <img src={clubAvatarPreview || "/assets/Maskgroup.png"} alt="Member" className="w-32 h-32 mx-4 rounded-full " />
              <div className="flex flex-col">
                <div className="flex flex-row items-center">
                  <label className="cursor-pointer flex items-center gap-2">
                    <FileUp size={50} className="text-white fill-[#7CE9BF]" />
                    <span className="text-gray-300">{clubAvatarName}</span>
                    <input
                      type="file"
                      /*onChange={(e) => setClubAvatar(e.target.files[0]?.name || "using (png, jpg, webp)")}*/
                      onChange={handleAvatarFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                  </div>
                <h2 className="text-left text-gray-400">Upload</h2>
              </div>
            </div>
            <div className="mb-6">
              <label className="block font-medium mb-1">ชื่อชมรม</label>
              <input type="text" placeholder="ชื่อชมรม" className="border border-[#FF7E69] rounded-md w-full p-2" onChange={(e) => setClubName(e.target.value)} required/>
            </div>
            <div className="mb-5">
              <label className="block font-medium mb-2">อาจารย์ที่ปรึกษา</label>
              <input type="text" placeholder="ชื่อ นามสกุล" className="border border-[#FF7E69] rounded-md w-full p-2 mb-2" onChange={(e) => setClubAdviser(e.target.value)} required/>
              <input type="email" placeholder="Gmail อาจารย์ที่ปรึกษา" className="border border-[#FF7E69] rounded-md w-full p-2 mb-1" />
            </div>
            <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="border border-[#FF7E69] rounded-md w-full p-2 text-left bg-white"
      >
        <div className="flex flex-row items-center justify-between">
          <div>
            {clubType || "เลือกประเภทชมรม"}
          </div>
          <div className="text-[#FF7E69]">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </button>

      {isOpen && (
        <ul className="absolute w-full mt-1 rounded-md bg-white shadow-md z-10">
          {clubTypes.map((type, index) => (
            <li 
              key={index} 
              onClick={() => { handleClubTypeChange(type); setIsOpen(false); }} 
              className="p-2 cursor-pointer hover:bg-[#FF7E69] hover:rounded-md"
            >
              {type}
            </li>
            
          ))}
        </ul>
      )}
    </div>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-2">Gmail นักศึกษา</label>
          <div className="space-y-2">
            {members.map((member, index) => (
              <div className="flex flex-row mb-2">
                <input
                  key={index}
                  type="email"
                  placeholder="Gmail นักศึกษา"
                  className="border-1 border-[#FF7E69] rounded-md max-w-2/3 w-full p-2 mb-3"
                  value={member.email}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  disabled={index === 0}
                  required
                  style={{ opacity: index === 0 ? 0.5 : 1 }}
                />
                <h2 className="text-left pl-4">{member.position}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block font-medium mb-1">Quote</label>
        <textarea className="border border-[#FF7E69] rounded-md w-full p-2 h-20" onChange={(e) => setClubQuote(e.target.value)} required></textarea>
      </div>

      <div className="mt-4">
        <label className="block font-medium mb-1">Tag* (ใช้ "," คั่นระหว่าง tag)</label>
        <input type="text" className="border border-[#FF7E69] rounded-md w-full p-2" onChange={(e) => setClubDescription(e.target.value)}/>
      </div>

      <div className="mt-4">
        <label className="block font-medium mb-1">ไฟล์เอกสาร</label>
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <label className="cursor-pointer flex items-center gap-2">
              <FileUp size={50} className="text-white fill-[#7CE9BF]" />
              <span className="text-gray-300">{fileName}</span>
              <input
                type="file"
                onChange={handleDocumentFileChange}
                className="hidden"
              />
            </label>
          </div>
          <h2 className="text-left text-gray-400">Upload</h2>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="mt-6 w-1/4 bg-[#7CE9BF] text-white py-2 rounded-md hover:bg-emerald-400 active:bg-emerald-500 "  
        onClick={handleSubmit}>
          ส่งคำขอ
        </button>
      </div>
    </div>
  );
};

export default ClubApplication;
