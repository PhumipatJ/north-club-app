import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Button, ThemeProvider, Box } from "@mui/material";
import supabaseService from "../../service/supabaseService";
import theme from "../Theme";
import { X, File, ChevronUp, ChevronDown } from "lucide-react";
import Loading from "../loading";
import ConfirmCard from "../confirmCard";
const Clubform = ({ formdata, onClose ,userInfo}) => {
  const supabase = supabaseService.getClient();
  const [piconload, Setonload] = useState(true);
  const [isDropdownOpen, setShowDropdown] = useState(false);
  const role = [...formdata?.role_available.split(',')]
  const [roleSelected,setRoleSelected] = useState('');
  const [Description,setDescript] = useState('');
  const [folioURL,setfolioURL] = useState('');
  //comfirmcard
  const [isConfirmOpen,setConfirmopen] = useState(false);
  const [typeopen,setTypeopen] = useState('');
  const [texterror,setTexterror] = useState('');
  //confirmcard
  const handleclose = () => {
    setRoleSelected('');
    setDescript('');
    setfolioURL('');
    onClose();
    window.location.reload();
  };
  
  const isFormValid = () => {
    const googleDrivePattern = /^(https?:\/\/)?(www\.)?drive\.google\.com\/.*$/;

    if (roleSelected === '') {
      setTypeopen('errorEmpty');
      return false;
    } else if (folioURL && !googleDrivePattern.test(folioURL)) {
      setTypeopen('errorURL');
      return false;
    } else {
      return true;
    }
  };
  const Confirm = async () => {
    const { error } = await supabase.from("userform").insert([
      {
        user_id: userInfo?.id,
        club_id: formdata?.club_id,
        role_apply: roleSelected,
        Description: Description,
        filename: folioURL,
        status: false
      },
    ]);
    if (error) {
      console.log(error);
    }

  }
  const handleConfirm = () => {
    if(isFormValid()){
      setConfirmopen(true);
      setTypeopen('registrationConfirm');
    }
    else{
       setConfirmopen(true);
       setTexterror("No role Selected");
    }
  };
  const handleSelectRole = (role) =>{
    setRoleSelected(role);
    setShowDropdown(false);
  }
  return (
    <div className="bg-[rgba(16,16,16,0.5)] w-screen h-screen flex justify-center items-center fixed z-1000 top-0">
      {piconload && <Loading />}
      <ConfirmCard 
        isOpen={isConfirmOpen} 
        onConfirm={()=>Confirm()} 
        onClose={()=>setConfirmopen(false)} 
        onSecondConfirm={()=>handleclose()} 
        type={typeopen} 
        text={texterror||" "}/>
      <ThemeProvider theme={theme}>
        <div className="bg-white w-[60vw] rounded-[8px] h-[90vh]">
          <div className=" w-[100%] h-[10%] flex justify-between px-5 shadow-[0px_0px_2px_rgba(26,26,26,0.25)]">
            <div className="h-[100%] w-fit  flex items-center">
              <h1 className="font-semibold text-[20px] " onClick={()=>console.log(roleSelected)}>รายละเอียด</h1>
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
                          value={userInfo.name}
                          disabled
                          className="w-full border border-[#FF7E69] rounded px-3 py-2 text-[#1a1a1a7d]"
                        />
                      </div>
                      <div className="w-[45%]">
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
                          className="w-full border border-[#FF7E69] rounded px-3 py-2 text-[#1a1a1a7d]"
                          value={userInfo.email}
                          disabled
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
                          className="w-[60px] border border-[#FF7E69] rounded px-3 py-2 text-[#1a1a1a7d]"
                          value={new Date().getFullYear() + 543 - userInfo?.admission_year}
                          disabled
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
                          className="w-full border border-[#FF7E69] rounded px-3 py-2 text-[#1a1a1a7d]"
                          value={userInfo?.faculty}
                          disabled
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
                          className="w-full border border-[#FF7E69] rounded px-3 py-2 text-[#1a1a1a7d]"
                          value={userInfo.department}
                          disabled
                          
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
                          <div>{roleSelected||"เลือกตำแหน่ง"}</div>
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
                                handleSelectRole(type);
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
                    onChange={(e)=>setDescript(e.target.value)}
                  />
                </div>
                    <div>
                      <div className=" h-fit flex justify-between items-end bg">
                        <div className="w-[50%]"> 
                        <label
                          className=" font-semibold mb-1"
                          htmlFor="eventName"
                        >
                          <div className="items-end gap-3 mb-1">
                          Portfolio (ตามที่ชมรมกำหนด)<p className="text-[13px] text-[#99a1af] font-medium">(upload .pdf to Google Drive) ใส่หรือไม่ก็ได้</p>

                          </div>
                        </label>
                        <input
                          type="text"
                          id="eventName"
                          placeholder="Enter Google Drive URL"
                          className="w-full border border-[#FF7E69] rounded px-3 py-2"
                          onChange={(e)=>setfolioURL(e.target.value)}
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
                        onClick={handleConfirm}
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
