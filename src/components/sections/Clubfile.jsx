import { useState } from "react";
import { Folder,FileText,ChevronLeft } from "lucide-react";

const Clubfile = () => {
  const [openFolder, setOpenFolder] = useState(null);

  const folders = [
    { name: "เอกสารสำหรับสมาชิกชมรม", files: [
        { name: "คำขอการเปิดชมรม.pdf", url: "/downloads/file1.pdf" },
        { name: "คำขอการทำกิจกรรม.pdf", url: "/downloads/file2.pdf" },
        { name: "เอกสารของชมรม.pdf", url: "/downloads/file3.pdf" },
        { name: "ใบอนุญาต.pdf", url: "/downloads/file4.pdf" },
      ], },
    { name: "เอกสารสำหรับสมาชิกชมรม", files: [
        { name: "U.pdf", url: "/downloads/file1.pdf" },
        { name: "II.pdf", url: "/downloads/file2.pdf" },
        { name: "A.pdf", url: "/downloads/file3.pdf" },
      ], },
    { name: "เอกสารสถิติเข้าร่วมชมรม", files: [
        { name: "คำขอการเปิดชมรม.pdf", url: "/downloads/file1.pdf" },
        { name: "คำขอการทำกิจกรรม.pdf", url: "/downloads/file2.pdf" },
        { name: "เอกสารของชมรม.pdf", url: "/downloads/file3.pdf" },
        { name: "ใบทดสอบ.pdf", url: "/downloads/file4.pdf" },
        { name: "ใบทดสอบ.pdf", url: "/downloads/file5.pdf" },
        { name: "ใบทดสอบ.pdf", url: "/downloads/file6.pdf" },
        { name: "ใบทดสอบ.pdf", url: "/downloads/file7.pdf" },
        { name: "ใบทดสอบ.pdf", url: "/downloads/file8.pdf" },
        { name: "ใบทดสอบ.pdf", url: "/downloads/file9.pdf" },
        { name: "ใบทดสอบ.pdf", url: "/downloads/file10.pdf" },
      ], },
    { name: "เอกสารอื่นๆ", files: [
        { name: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.pdf", url: "/downloads/file1.pdf" },
      ], },
  ];

  return (
    <div className="p-6 mt-24 min-h-[77vh] flex justify-center">
        <div className="flex flex-col max-w-5xl w-full">
            <h1 className="text-4xl font-bold mb-4">เอกสาร</h1>
      {openFolder === null ? (
        <div className="grid grid-cols-6 gap-6">
          {folders.map((folder, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => setOpenFolder(index)}
                className="focus:outline-none"
              >
                <Folder className="w-16 h-16 text-[#7CE9BF] fill-[#7CE9BF]"/>
              </button>
              
              <span className="mt-2 text-center">{folder.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setOpenFolder(null)}
            className="flex items-center mb-4 text-blue-500 hover:underline"
          >
            <Folder className="w-16 h-16 text-[#7CE9BF] fill-[#7CE9BF] mr-2" /> 
            <ChevronLeft/>
            <h2 className="text-xl mt-4 font-semibold mb-4">{folders[openFolder].name}</h2>
          </button>
          <div className="grid grid-cols-4 gap-6">
            {folders[openFolder].files.map((file, fileIndex) => (
              <a
                key={fileIndex}
                href={file.url}
                download
                className="flex flex-col items-center"
              >
                <FileText className="w-12 h-12 text-[#FF7E69]" />
                <span className="mt-2 text-center">{file.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
        </div>
      
    </div>
  );
};
export default Clubfile;
