import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Button, ThemeProvider, Box } from "@mui/material";
import supabase from "../../../supabaseClient";
import theme from "../Theme";
import { X, File } from "lucide-react";

const Clubform = ({ formdata, onClose }) => {
    const [piconload,Setonload] = useState(true);
    const handleclose = () => {
    onClose();
  };
  useEffect(() => {
    if(!piconload){
        console.log("loding");
    }
    console.log(formdata)
  });
  return (
    <div className="bg-[rgba(16,16,16,0.5)] w-screen h-screen flex justify-center items-center fixed z-1000 top-0">
      <ThemeProvider theme={theme}>
        <div className="bg-white w-[60dvw] pt-5 rounded-[8px] max-h-[80%] overflow-clip">
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
          <div className="h-[75vh] bg-red-400 overflow-auto p-10">
            <div className="">
            <img
                onLoad={()=>Setonload(false)}
              src={`${
                supabase.storage.from("club-avatars").getPublicUrl("/"+formdata[0].Pic)
                  .data.publicUrl
              }`}
              alt=""
            />
            <div className="bg-gray-100">
              <div>
                <h1 className="text-[24px] font-semibold">{formdata[0].form_title}</h1><br/>
                <h1>{formdata[1]}</h1>

              </div>
            </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};
export default Clubform;
