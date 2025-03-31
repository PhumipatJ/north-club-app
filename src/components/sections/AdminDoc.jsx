import AdmindatabaseBox from "./AdmindatabaseBox";
import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  ThemeProvider,
} from "@mui/material";
import { FolderInput, Folder, File, FileInput, Trash2 } from "lucide-react";
import theme from "../Theme";
import { useEffect, useState } from "react";
import AdminDocPopup from "./AdminDocPopup";
import Loading from "../loading";
import supabaseService from "../../service/supabaseService";
import ConfirmCard from "../confirmCard";
const AdminDoc = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uniqueTypes, setUq] = useState([]);
  const [data, setData] = useState([]);
  const supabase = supabaseService.getClient();
  const [currentfolder, setCurrentfolder] = useState(null);
  const [isConfirmOpen,setConfirmopen] = useState(false);
  const [currentfile,setCurrentfile] = useState(null);
  useEffect(() => {
    const fetchingFolder = async () => {
      const { data, error } = await supabase
        .from("doclist")
        .select("filename,filestorage,type");
      if (error) {
        console.log(error);
      } else {
        const uniqueTypes = [...new Set(data?.map((item) => item.type))];
        console.log(uniqueTypes);
        setUq(uniqueTypes);
        console.log(data);
        setData(data);
      }
    };
    fetchingFolder();
  }, []);
  const handleopen = (text) => {
    setCurrentfolder(text);
    setShowPopup(true);
  };
  const handleDelete = (item)=>{
    console.log(item);
    setCurrentfile(item);
    setConfirmopen(true);
  }
  const deleteFile = async (filePath) => {
    const url = filePath.filestorage;
    const filename = url.split("/").pop()
    const { error } = await supabase
        .storage
        .from('docklist')  // 🛑 เปลี่ยนเป็นชื่อ bucket ของคุณ
        .remove([filename]);  // 📌 ลบไฟล์ตาม path ที่กำหนด

    if (error) {
        console.error("Error deleting file:", error);
    } else {
        console.log("File deleted successfully");
    }
    const{ Eerror } = await supabase
    .from('doclist')
    .delete()
    .eq('filestorage',filePath.filestorage);
    if (Eerror) {
        console.error("Error deleting file:", error);
    } else {
        console.log("File deleted successfully");
    }
};
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      {showPopup && (
        <AdminDocPopup
          onClose={() => setShowPopup(false)}
          filetype={currentfolder}
        />
      )}
      <div onClick={(e) => e.stopPropagation()} className="z-51 absolute">
        <ConfirmCard
          isOpen={isConfirmOpen}
          onClose={() => setConfirmopen(false)}
          type={'deleteFile'}
          onConfirm={()=>deleteFile(currentfile)}
          onSecondConfirm={()=>window.location.reload()}
        />
        </div>
      <Container className="p-6 mt-24 min-h-[77vh] flex flex-col justify-center">
        <div className="flex max-w-6xl w-full">
          <div className=" w-full h-fit flex">
            <h1 className="text-4xl font-bold my-auto ">เอกสาร</h1>
          </div>
        </div>

        <div className="flex justify-between gap-10 h-[calc(100vh-184px)]">
          <AdmindatabaseBox />
          <TableContainer>
            <div className="h-full pt-10 ml-10">
              {uniqueTypes.map((type, index) => (
                <div key={index} className="mb-3">
                  <h1 className="flex">
                    <Folder className="mr-2" />
                    {type}
                  </h1>
                  <ul className="pl-10">
                    {data
                      .filter((item) => item.type === type)
                      .map((item, i) => (
                        <li key={i} className="flex mt-2 ">
                          <div className="hover:text-[#FF7E69] flex cursor-pointer"
                          onClick={()=>handleDelete(item)}
                          >
                            <Trash2 className=" " />
                            ลบ
                          </div>
                          <div
                            className="ml-4 flex cursor-pointer hover:text-[#FF7E69]"
                            onClick={() =>
                              window.open(`${item.filestorage}`, "_blank")
                            }
                          >
                            <File className="mr-2" />
                            {item.filename}
                          </div>
                        </li>
                      ))}
                    <li
                      className="flex mt-4 text-[#1a1a1a5d] hover:text-[#FF7E69] cursor-pointer"
                      onClick={() => handleopen(type)}
                    >
                      <FileInput className="mr-2 " />
                      เพิ่มไฟล์ในโฟล์เดอร์นี้ +
                    </li>
                  </ul>
                </div>
              ))}
              <div
                className="flex gap-2 hover:text-[#FF7E69] select-none cursor-pointer"
                onClick={() => handleopen(null)}
              >
                <FolderInput />
                <h1>เพิ่มโฟลเดอร์ใหม่ +</h1>
              </div>
            </div>
          </TableContainer>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default AdminDoc;
