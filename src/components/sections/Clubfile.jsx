import { useEffect, useState } from "react";
import { Folder, FileText, ChevronLeft } from "lucide-react";
import supabaseService from "../../service/supabaseService";
import Loading from "../loading";
const Clubfile = () => {
  const [openFolder, setOpenFolder] = useState(null);
  const supabase = supabaseService.getClient();
  const [folders, setFolders] = useState([]);
  const [uniqueTypes, setUq] = useState([]);
  const [loading ,setLoading] = useState(true);
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
        setFolders(
          uniqueTypes.map((type) => ({
            name: type,
            files: data
              .filter((item) => item.type === type)
              .map((item) => ({ name: item.filename, url: item.filestorage })),
          }))
        );
        setLoading(false);
      }
    };
    fetchingFolder();
  }, []);
  if(loading){
    return(
      <div>
      <Loading/>
      <div className="h-[100vh]"></div>
      </div>
    )
  }
  return (
    <div className="p-6 mt-24 min-h-[82.2vh] flex justify-center ">
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
                  <Folder className="w-16 h-16 text-[#7CE9BF] fill-[#7CE9BF] cursor-pointer" />
                </button>

                <span className="mt-2 text-center cursor-pointer" onClick={() => setOpenFolder(index)}>{folder.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setOpenFolder(null)}
              className="flex items-center mb-4  hover:underline cursor-pointer"
            >
              <Folder className="w-16 h-16 text-[#7CE9BF] fill-[#7CE9BF] mr-2" />
              <ChevronLeft />
              <h2 className="text-xl mt-4 font-semibold mb-4">
                {folders[openFolder].name}
              </h2>
            </button>
            <div className="grid grid-cols-4 gap-6">
              {folders[openFolder].files.map((file, fileIndex) => (
                <a
                  key={fileIndex}
                  href={file.url}
                  target="_blank"
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
