import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  ThemeProvider,
  Box,
} from "@mui/material";
import supabaseService from "../../service/supabaseService";
import theme from "../Theme";
import { X, File } from "lucide-react";

const ApprovalPopup = ({ clubdata, count, onClose }) => {
  const supabase = supabaseService.getClient();
  const { clubId } = useParams();
  const club = clubdata;
  const [rejectReason,setReason] = useState("");
  const { data: urlData } = supabase.storage
    .from("club-documents")
    .getPublicUrl(clubdata.application_document);
  const combined = club.clubMembers.map((user) => {
    const memberDATA = club.memberdata.find(
      (member) => member.email === user.email
    );
    return memberDATA
      ? {
          ...user,
          name: memberDATA.name,
          PositionNumber:
            user.position === "ประธานชมรม"
              ? 1
              : user.position === "รองประธานชมรม"
              ? 2
              : user.position === "กรรมการ"
              ? 3
              : user.position === "เลขานุการ"
              ? 4
              : user.position === "ผู้ช่วยเลขานุการ"
              ? 5
              : 6,
        }
      : user;
  });
  if (!club) return <></>;
  const today = new Date().toISOString().slice(0, 19).replace("T", " "); // YYYY-MM-DD HH:MM:SS
  const handleclose = () => {
    onClose();
  };
  const handleApprove = async (clubId) => {
    console.log(member_count);
    // Insert into approvalHistory
    const { error: insertError } = await supabase
      .from("approvalHistory")
      .insert([
        {
          club_name: club.club_name,
          club_avatar: club.club_avatar,
          club_type: club.club_type,
          member_count: count,
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
    } else {
      console.log(clubMembers);
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
    console.log(member_count);
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
    const { Cerror } = await supabase
      .from("clubMembers")
      .delete()
      .eq("club_id", clubId);
    const { CMerror } = await supabase
      .from("clubs")
      .delete()
      .eq("club_id", clubId);

    if (Cerror || CMerror) {
      console.error("Rejection failed:", Cerror || CMerror);
    } else {
      alert("ปฏิเสธชมรมเรียบร้อย!");
      window.history.back();
    }
  };
 

  return (
    <div className="bg-[rgba(16,16,16,0.5)] w-screen h-screen flex justify-center items-center fixed z-1000 top-0">
      <ThemeProvider theme={theme}>
        <div className="bg-white w-[60dvw] h-[70dvh] rounded-[8px] overflow-clip">
          <div className=" w-[100%] h-[10%] flex justify-between">
            <div className="h-[100%] w-fit  flex items-center px-5">
              <h1
                style={{
                  fontFamily: "Prompt, san-serif",
                  fontWeight: "regular",
                  fontSize: "20px",
                }}
              >
                รายละเอียด
              </h1>
            </div>
            <div
              className="h-[100%] w-fit  flex items-center px-2 cursor-pointer"
              onClick={() => handleclose()}
            >
              <X />
            </div>
          </div>
          <div className="h-[80%] flex">
            <div
              className="flex-1 flex-col flex max-w-[50%] "
              style={{ flex: "0 0 50%" }}
            >
              <div className="flex py-7 justify-center flex-1">
                <Avatar
                  src={`${
                    supabase.storage
                      .from("club-avatars")
                      .getPublicUrl(club.club_avatar).data.publicUrl
                  }`}
                  alt={club.club_name}
                  sx={{
                    width: "17dvh",
                    height: "17dvh",
                    boxShadow: "0px 0px 2px 1px rgba(16,16,16,0.15)",
                  }}
                />
              </div>
              <div className="h-full space-y-3">
                <div className="flex ml-20 h-fit w-fit">
                  <div
                    className="h-fit min-w-[12dvh] flex justify-between"
                    style={{
                      fontFamily: "Prompt, san-serif",
                      fontWeight: 550,
                      fontSize: "14px",
                    }}
                  >
                    <h1>ชื่อชมรม</h1>
                  </div>
                  <div
                    className="h-fit min-w-[20dvh]"
                    style={{
                      fontFamily: "Prompt, san-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                    }}
                  >
                    <h1>{club.club_name}</h1>
                  </div>
                </div>
                <div className="flex ml-20 h-fit w-fit">
                  <div
                    className="h-fit min-w-[12dvh] flex justify-between"
                    style={{
                      fontFamily: "Prompt, san-serif",
                      fontWeight: 550,
                      fontSize: "14px",
                    }}
                  >
                    <h1>ที่ปรึกษา</h1>
                  </div>
                  <div
                    className="h-fit min-w-[20dvh]"
                    style={{
                      fontFamily: "Prompt, san-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                    }}
                  >
                    <h1>{club.club_adviser}</h1>
                  </div>
                </div>
                <div className="flex ml-20 h-fit w-fit">
                  <div
                    className="h-fit min-w-[12dvh] flex justify-between"
                    style={{
                      fontFamily: "Prompt, san-serif",
                      fontWeight: 550,
                      fontSize: "14px",
                    }}
                  >
                    <h1>ประเภทชมรม</h1>
                  </div>
                  <div
                    className="h-fit min-w-[20dvh]"
                    style={{
                      fontFamily: "Prompt, san-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                    }}
                  >
                    <h1>{club.club_type}</h1>
                  </div>
                </div>
                <div className="flex ml-20 h-fit w-fit">
                  <div
                    className="h-fit min-w-[12dvh] flex justify-between"
                    style={{
                      fontFamily: "Prompt, san-serif",
                      fontWeight: 550,
                      fontSize: "14px",
                    }}
                  >
                    <h1>โควท</h1>
                  </div>
                  <div
                    className="h-fit min-w-[20dvh]"
                    style={{
                      fontFamily: "Prompt, san-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                    }}
                  >
                    <h1>{club.club_quote}</h1>
                  </div>
                </div>
                <div className="flex ml-20 h-fit w-fit max-w-[80%] ">
                  <div
                    className="h-fit min-w-[12dvh] flex justify-between00"
                    style={{
                      fontFamily: "Prompt, san-serif",
                      fontWeight: 550,
                      fontSize: "14px",
                    }}
                  >
                    <h1>Tag</h1>
                  </div>
                  <div
                    className="h-fit min-w-[20dvh] max-w-[100%] "
                    style={{
                      fontFamily: "Prompt, san-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                      overflowWrap: "break-word",
                    }}
                  >
                    {club.club_description.map((tag, index) => (
                      <>{tag},</>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1" style={{ flex: "0 0 50%" }}>
              <div
                className="h-fit min-w-[20dvh] pb-2"
                style={{
                  fontFamily: "Prompt, san-serif",
                  fontWeight: 550,
                  fontSize: "14px",
                }}
              >
                <h1>คณะกรรมการ</h1>
              </div>
              {combined
                .sort((a, b) => a.PositionNumber - b.PositionNumber)
                .map((member, index) => (
                  <div
                    key={index}
                    className="h-fit min-w-[20dvh] ml-5 pb-1 grid grid-cols-2"
                    style={{
                      fontFamily: "Prompt, san-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                    }}
                  >
                    <div className="mb-1">
                      <h1>{member.name}</h1>
                    </div>
                    <div>
                      <h1>{member.position}</h1>
                    </div>
                  </div>
                ))}
              <div
                className="h-fit min-w-[20dvh] pb-2"
                style={{
                  fontFamily: "Prompt, san-serif",
                  fontWeight: 550,
                  fontSize: "14px",
                }}
              >
                <h1>เอกสารแนบ</h1>
              </div>
              {urlData && (
                <Box
                  onClick={() => window.open(urlData.publicUrl, "_blank")}
                  sx={{
                    display: "flex",
                    borderRadius: "5px",
                    width: "fit-content",
                    marginLeft: "10px",
                    paddingX: "15px",
                    alignItems: "end",
                    color: "#1A1A1A7D",
                    "&:hover": {
                      cursor: "pointer",
                      bgcolor: "#f9f9f9",
                      color: "#1A1A1A",
                    },
                  }}
                >
                  <File className="text-[#FF7E69] mr-3" />{" "}
                  <h1 className="text-[15px]">
                    {clubdata.application_document}
                  </h1>
                </Box>
              )}
            </div>
          </div>
          <div className=" h-[100%] justify-end flex px-4">
            <div className="h-fit w-fit flex ">
              <ThemeProvider theme={theme}>
              <input
                    type="text"
                    placeholder="เหตุผลในการปฏิเสธ"
                    className="border border-[#1A1A1A7D] rounded-md w-full p-1 mr-4 focus:outline-none focus:border-[#FF7E69] focus:border-2"
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                {rejectReason===''?(<Button
                  variant="outlined"
                  color="error"
                  sx={{
                    boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                    mr: 2,
                    paddingX: "3vw",
                    bgcolor: "white",
                    color: "#1A1A1A7D",
                    borderWidth:'2px',
                    borderColor:'white',
                    "&:hover": {
                      boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                      cursor: "no-drop",
                    },
                  }}
                >
                  ปฏิเสธ
                </Button>):(
                    <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                      mr: 2,
                      paddingX: "3vw",
                      bgcolor:"#FF7E69",
                        color:'white',
                      borderColor:'#FF7E69',
                      borderWidth:'2px',
                      "&:hover": {
                        boxShadow: "0px 0px 5px 1px #FF7E697D",
                        
                      },
                    }}
                    onClick={() => handleReject()}
                  >
                    ปฏิเสธ
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                    mr: 0,
                    paddingX: "3vw",
                    bgcolor: "#7CE9BF",
                    color: "#1A1A1A",
                    "&:hover": {
                      bgcolor: "#7CE9BF",
                      boxShadow: "0px 0px 5px 0.1px #7CE9BF",
                    },
                  }}
                  onClick={() => handleApprove(clubId)}
                >
                  อนุมัติ
                </Button>
              </ThemeProvider>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};
export default ApprovalPopup;
