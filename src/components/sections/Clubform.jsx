import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Button, ThemeProvider, Box } from "@mui/material";
import supabase from "../../../supabaseClient";
import theme from "../Theme";
import { X, File } from "lucide-react";

const Clubform = ({ formdata, count, onClose }) => {
    const [piconload,Setonload] = useState(true);
    const handleclose = () => {
    onClose();
  };
  useEffect(() => {
    if(!piconload){
        console.log("loding");
    }
  });
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
          <div className="h-[80%]">
            <img
                onLoad={()=>Setonload(false)}
              src={`${
                supabase.storage.from("club-avatars").getPublicUrl("/"+formdata.Pic)
                  .data.publicUrl
              }`}
              alt=""
            />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};
export default Clubform;
