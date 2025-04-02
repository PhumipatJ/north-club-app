import { useEffect, useState, useRef } from "react";
import { ThemeProvider, Button } from "@mui/material";
import theme from "../Theme";
import { X, File } from "lucide-react";
import supabaseService from "../../service/supabaseService";
import ConfirmCard from "../confirmCard";
const AdminDocPopup = ({ onClose ,filetype}) => {
    const supabase = supabaseService.getClient();
  const [FolderName, setFolderName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [isConfirmOpen,setConfirmopen] = useState(false);
  const [opentype,setOpentype] = useState("");
  const inputRef = useRef(null);
  const uploadFile = async (file, bucket,index) => {
    console.log(file);
    if (!file) return "";
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}${index}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: file.type,
      });

    if (error) {
      console.error(`Upload error (${bucket}):`, error);
      return "";
    }
    const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(data.path).data;
    return publicUrl;
  };
  const handleFile = (files) => {
    const validFiles = [...files].filter(
      (file) => file.type === "application/pdf"
    );

    if (validFiles.length > 0) {
      setSelectedFile((prev = []) => [...prev, ...validFiles]); // ป้องกัน prev เป็น null
    } else {
        
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFile(e.dataTransfer.files); // ส่งทุกไฟล์เข้าไป
    }
  };

  const handleChange = (e) => {
    if (e.target.files) {
      handleFile(e.target.files); // ส่งทุกไฟล์เข้าไป
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };
  const handelDrag = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  
  const handleSubmit = async () => {
    if (FolderName === null || FolderName === ""){
      setOpentype("errorEmpty")
      return;
    } 
    try {
      const uploaded = await Promise.all(
        selectedFile.map(async (file,index) => {
          const docUrl = await uploadFile(file, "docklist",index);
          return {
            filename: file.name,
            type: FolderName===""?filetype:FolderName,
            filestorage:docUrl,
          };
        })
      );
      const { error } = await supabase.from("doclist").insert(uploaded);
      if (error) {
        console.log(error);
      }
      else{
      }
    } catch (err) {
      console.log(err);
    }
    
  };
  const handleConfirm = () =>{
    if(selectedFile <= 0){
        setOpentype('errorUploadFile')
        setConfirmopen(true);
    }
    else{
        setOpentype('uploadFile')
        setConfirmopen(true);
    }
}
  return (
    <div className="bg-[rgba(16,16,16,0.5)] w-screen h-screen flex justify-center items-center fixed z-1000 top-0">
      <div onClick={(e) => e.stopPropagation()} className="z-51 absolute">
        <ConfirmCard
          isOpen={isConfirmOpen}
          onClose={() => setConfirmopen(false)}
          type={opentype}
          onConfirm={()=>handleSubmit()}
          onSecondConfirm={()=>window.location.reload()}
        />
        </div>
      <ThemeProvider theme={theme}>
        <div className="bg-white w-[40dvw] h-[70dvh] rounded-[8px] overflow-clip">
          <div className=" w-[100%] h-[10%] flex justify-between px-5 border-b-1 border-[#1a1a1a2d]">
            <div className="h-[100%] w-fit  flex items-center ">
              <h1
                style={{
                  fontFamily: "Prompt, san-serif",
                  fontWeight: "regular",
                  fontSize: "20px",
                }}
              >
                เพิ่มโฟลเดอร์ใหม่
              </h1>
            </div>
            <div
              className="h-[100%] w-fit  flex items-center cursor-pointer justify-end hover:text-[#FF7E69]"
              onClick={() => onClose()}
            >
              <X />
            </div>
          </div>
          <div className="h-[80%] ">
            <form className="mx-10 pt-4">
              <div>
                <div>
                  <label
                    className="block font-semibold mb-1"
                    htmlFor="folderName"
                  >
                    ชื่อโฟลเดอร์
                  </label>
                  {filetype===null?(<input
                    type="text"
                    id="folderName"
                    placeholder="Enter Folder Name"
                    className="w-full border border-[#FF7E69] rounded px-3 py-2"
                    onChange={(e) => setFolderName(e.target.value)}
                  />):(<input
                    type="text"
                    id="folderName"
                    placeholder="Enter Folder Name"
                    className="w-full border border-[#FF7E69] rounded px-3 py-2"
                    disabled
                    value={filetype}
                  />)}
                </div>
              </div>
              <div className="my-3 overflow-auto max-h-[35vh]">
                <ul>
                  {selectedFile.map((file, index) => (
                    <li key={index} className="flex justify-between mb-1 ">
                      <div className="flex">
                        <File className="text-[#FF7E69] mr-2" />
                        <span title={file.name}>
                          {" "}
                          {file.name.length <= 40
                            ? file.name
                            : file.name.slice(0, 40) + "..."}
                        </span>{" "}
                      </div>
                      <X
                        className="w-6 hover:text-[#7CE9BF] cursor-pointer"
                        onClick={() =>
                          setSelectedFile(
                            selectedFile.filter((_, i) => i !== index)
                          )
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-[#FF7E69] bg-orange-50"
                    : "border-gray-300"
                }`}
                onClick={handleClick}
                onDragOver={(e) => handelDrag(e)}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false); // กลับเป็นปกติเมื่อออกจากพื้นที่ Drop
                }}
                onDragEnter={(e) => handelDrag(e)}
                onDrop={handleDrop}
              >
                <input
                  multiple
                  type="file"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="hidden"
                  ref={inputRef}
                />

                <p className="text-gray-600">
                  {"ลากไฟล์ PDF มาวาง หรือคลิกเพื่อเลือก"}
                </p>
              </div>
            </form>
          </div>
          <div className="flex justify-end px-5 py-4  h-[10%]">
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
                  bgcolor: "#FF7E69",
                  boxShadow: "0px 0px 2px #FF7E6960",
                },
              }}
              onClick={()=>handleConfirm()}
            >
              อัปโหลด
            </Button>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};
export default AdminDocPopup;
