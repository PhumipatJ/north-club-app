import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Button, ThemeProvider, Box } from "@mui/material";
import supabase from "../../../supabaseClient";
import theme from "../Theme";
import { X, File, ChevronUp, ChevronDown } from "lucide-react";
import Loading from "../loading";
const Clubform = ({ formdata, onClose }) => {
  const [piconload, Setonload] = useState(true);
  const [userdata, setUserData] = useState(null);
  const [isDropdownOpen, setShowDropdown] = useState(false);
  const [test,settest] = useState("hello");
  const [role, setrole] = useState([
    "กีฬา",
    "วิชาการ",
    "อาสาและบำเพ็ญประโยชน์",
    "ศิลปะและวัฒนธรรม",
  ]);
  const handleclose = () => {
    onClose();
  };
  const isFormValid = () => {};
  const handleConfirm = async () => {
    const { error } = await supabase.from("userform").insert([
      {
        user_id: userdata.id,
        club_id: userdata.club_id,
        role_apply: userdata.role,
        Description: userdata.Descrip,
        filename: userdata.file,
      },
    ]);
    if (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-[rgba(16,16,16,0.5)] w-screen h-screen flex justify-center items-center fixed z-1000 top-0">
      {piconload && <Loading />}
      <ThemeProvider theme={theme}>
        <div className="bg-white w-[60vw] rounded-[8px] h-[90vh]">
          <div className=" w-[100%] h-[10%] flex justify-between px-5 shadow-[0px_0px_2px_rgba(26,26,26,0.25)]">
            <div className="h-[100%] w-fit  flex items-center">
              <h1 className="font-semibold text-[20px]">รายละเอียด</h1>
            </div>
            <div
              className="h-[100%] w-fit  flex items-center cursor-pointer"
              onClick={() => handleclose()}
            >
              <X />
            </div>
          </div>
          <div className="h-[85%] px-10 py-5 overflow-auto ">
            <div className=" max-h-fit">
              <div className="flexbox justify-center">
                <div className="w-[100%] flex px-10 gap-4">
                  <img
                    onLoad={() => Setonload(false)}
                    src={`${
                      supabase.storage
                        .from("club-avatars")
                        .getPublicUrl("/" + formdata.Pic).data.publicUrl
                    }`}
                    className="max-h-[60vh] rounded-[5px]"
                    alt="poster รับสมัคร"
                  />
                  <div className="p-5">
                    <h1 className="text-[24px] font-semibold text-[#FF7E69]">
                      {formdata?.form_title}
                    </h1>
                    <h1 className="text-gray-600 text-[14px]">
                      {formdata?.clubname}
                    </h1>
                    <h1 className="text-[20px] font-semibold text-[#FF7E69]">
                      ปิดรับสมัครวันที่
                    </h1>
                    <h1 className="text-gray-600 text-[14px]">
                      {formdata.date_close?.split("T")[0]} เวลา{" "}
                      {formdata.date_close?.split("T")[1]} น.
                    </h1>
                    <h1 className="text-[20px] font-semibold text-[#FF7E69]">
                      รายละเอียด
                    </h1>
                    <h1 className="text-gray-600 text-[14px]">
                      {formdata?.form_discrip}
                    </h1>
                    <h1 className="text-[20px]  font-semibold text-[#FF7E69]">
                      ตำแหน่งที่เปิดรับ
                    </h1>
                    <h1 className="text-gray-600 text-[14px]">
                      {formdata?.role_available}
                    </h1>
                  </div>
                </div>
                <div className="p-5">
                  <h1 className="text-[20px]  font-semibold text-[#FF7E69]">
                    กรอกข้อมูลในการสมัคร
                  </h1>
                  <form className="mx-10 mt-4">
                    <div className="flex gap-10 ">
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="eventName"
                        >
                          ชื่อ
                        </label>
                        <input
                          type="text"
                          id="eventName"
                          placeholder="Enter Title"
                          value={test}
                          disabled
                          className="w-full border border-[#FF7E69] rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="eventName"
                        >
                          Email
                        </label>
                        <input
                          type="text"
                          id="eventName"
                          placeholder="Enter Title"
                          className="w-full border border-[#FF7E69] rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="eventName"
                        >
                          ชั้นปี
                        </label>
                        <input
                          type="text"
                          id="eventName"
                          placeholder="year"
                          className="w-[60px] border border-[#FF7E69] rounded px-3 py-2"
                        />
                      </div>
                    </div>
                    <div className="flex gap-10 my-5 ">
                      <div className="w-[41%]">
                        <label
                          className="font-semibold mb-1"
                          htmlFor="eventName"
                        >
                          คณะ
                        </label>
                        <input
                          type="text"
                          id="eventName"
                          placeholder="Enter Title"
                          className="w-full border border-[#FF7E69] rounded px-3 py-2"
                        />
                      </div>
                      <div className="w-[41%]">
                        <label
                          className=" font-semibold mb-1"
                          htmlFor="eventName"
                        >
                          สาขา
                        </label>
                        <input
                          type="text"
                          id="eventName"
                          placeholder="Enter Title"
                          className="w-full border border-[#FF7E69] rounded px-3 py-2 "
                          
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowDropdown(!isDropdownOpen)}
                        className="cursor-pointer border border-[#FF7E69] rounded-md w-full p-2 text-left bg-white"
                      >
                        <div className="flex flex-row items-center justify-between">
                          <div>{"เลือกประเภทชมรม"}</div>
                          <div className="text-[#FF7E69]">
                            {isDropdownOpen ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </div>
                        </div>
                      </button>
                      {isDropdownOpen && (
                        <ul className="absolute w-full mt-1 rounded-md bg-white shadow-md z-10">
                          {role.map((type, index) => (
                            <li
                              key={index}
                              onClick={() => {
                                isDropdownOpen(false);
                              }}
                              className="p-2 cursor-pointer hover:bg-[#FF7E69] hover:rounded-md"
                            >
                              {type}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="mt-3">
                  <label
                    className="block font-semibold mb-1"
                    htmlFor="description"
                  >
                    <div className="flex items-end gap-3">
                      คำอธิบายเพิ่มเติม{" "}
                      <p className="text-[#99a1af] text-[13px] font-medium">
                        ใส่หรือไม่ก็ได้
                      </p>
                    </div>
                  </label>
                  <textarea
                    id="description"
                    placeholder=""
                    className="w-full border border-[#FF7E69] rounded px-3 pt-2 h-32 max-h-[20vh] min-h-[10vh]"
                    
                  />
                </div>
                    <div>
                      <div className=" h-fit flex justify-between items-end bg">
                        <div className="w-[50%]"> 
                        <label
                          className=" font-semibold mb-1"
                          htmlFor="eventName"
                        >
                          <div className="flex items-end gap-3">
                          Portfolio<p className="text-[13px] text-[#99a1af] font-medium">(upload .pdf to Google Drive)</p>

                          </div>
                        </label>
                        <input
                          type="text"
                          id="eventName"
                          placeholder="Enter Google Drive URL"
                          className="w-full border border-[#FF7E69] rounded px-3 py-2"
                        />
                        </div>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          boxShadow: "0px 0px 2px rgba(26,26,26,0.25)",
                          mr: 0,
                          height: "100%",
                          paddingX: "3vw",
                          bgcolor: "white",
                          color: "#1A1A1A",
                          "&:hover": {
                            bgcolor: "#7CE9BF",
                            boxShadow: "0px 0px 2px #7CE9BF60",
                          },
                        }}
                      >
                        สมัครเข้าชมรม
                      </Button>
                    </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[5%] flex justify-end w-full px-5 py-3shadow-[0px_0px_2px_rgba(26,26,26,0.25)]">
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};
export default Clubform;
