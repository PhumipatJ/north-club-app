import { useEffect, useState } from "react";
import { Upload, RefreshCw } from "lucide-react";
import ConfirmCard from "../confirmCard";
import { FileUp, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import supabase from "../../../supabaseClient";

const ClubFormManage = ({ isOpen, onClose, clubId, prevform }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isError,setError] = useState(false)

  const [clubPoster, setClubPoster] = useState("");
  const [clubPosterName, setClubPosterName] = useState(
    "Upload Poster\nClick Here"
  );
  const [opentext,setOpentext] = useState("");
  const [clubPosterPreview, setClubPosterPreview] = useState(null);
  const [applicationDocument, setApplicationDocument] = useState("");
  const [opentype, setOpentype] = useState("");
  const [Title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [endTime, setendTime] = useState("");
  const [Description, setDescription] = useState("");
  const [Role, setRole] = useState("");
  if (!isOpen) return null;
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
  const handlePosterFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (allowedTypes.includes(fileType)) {
        setClubPosterPreview(URL.createObjectURL(file));
        setClubPosterName(file.name || "Upload Poster\nClick Here");
        setClubPoster(file);
      }
    }
  };

  const handleStartTimeChange = (e) => {
    if (e?.target?.value) {
      setendTime(e.target.value);
    }
  };

  const isFormValid = () => {
    const errors = [];
    if (!Title.trim()) errors.push("Event title is required.");
    if (!selectedDate) {
      errors.push("Selected date is required.");
    } else {
      const selectedDateObj = new Date(selectedDate); // Convert string to Date
      const today = new Date();
      const thirtyDaysAhead = new Date();
      thirtyDaysAhead.setDate(today.getDate());
      //console.log(selectedDateObj);
      //console.log(today);
      //console.log(thirtyDaysAhead);

      if (selectedDateObj <= thirtyDaysAhead) {
        errors.push("Selected date must be more than " + thirtyDaysAhead);
      }
    }
    if(!endTime.trim()) errors.push("endTime is required");
    if (!Role.trim()) errors.push("Role is required.");
    if (clubPoster==='') errors.push("clubPoster is required.");

    if (errors.length > 0) {
        console.log(...errors);
      setOpentype('error');
      setOpentext(...errors);
      setError(true);
      return false;
    }

    return true;
  };
  const handleConfirm = async () => {
    if (!isFormValid()) {
      return;
    }
    if (prevform === null) {
      const formattedDate =
        selectedDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +" "+ endTime;
        
        const PosterUrl = await uploadFile(clubPoster, "club-avatars");
      const { data: data, error: error } = await supabase
        .from("ClubRegisterForm")
        .insert([
          {
            club_id: clubId,
            form_title: Title,
            form_discrip: Description,
            form_status: true,
            role_available: Role,
            Pic: PosterUrl,
            date_close: formattedDate,
          },
        ]);
      if (error) {
        console.log(error);
        return;
      }
    } else {
      const formattedDate =
        selectedDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) + " "+ endTime;
        const PosterUrl = await uploadFile(clubPoster, "club-avatars");
      const { data: data, error: error } = await supabase
        .from("ClubRegisterForm")
        .update({
          form_title: Title,
          form_discrip: Description,
          form_status: true,
          role_available: Role,
          Pic: PosterUrl,
          date_close: formattedDate,
        })
        .eq("club_id", clubId);
      if (error) {
        console.log(error);
        return;
      }
    }
  };

  const handelonclose = () => {
    onClose();
    setTitle("");
    setSelectedDate("");
    setRole("");
    setendTime("");
    setClubPoster("");
    setClubPosterName("Upload Poster\nClick Here");
    setClubPosterPreview("");
    setApplicationDocument("");
    setIsConfirmOpen(false);
  };
  return (
    <div
      className="fixed flex inset-0 items-center justify-center bg-black/25 z-50 h-[100dvh]"
      onClick={handelonclose}
    >
        <div onClick={(e) => e.stopPropagation()} className="z-51 absolute">
        <ConfirmCard
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          type={opentype}
          text={opentext}
          onConfirm={handleConfirm}
          onsecondConfirm={handelonclose}
        />
        </div>
      <div
        className="flex flex-col bg-white rounded-lg p-6 max-w-3xl w-full relative min-h-[70%] max-h-[100%]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Event and Announce Button */}
        <div className="flex flex-row items-center w-full gap-3 mb-4 justify-between ">
          <div className="flex flex-row gap-3 items-center w-[30%]">
            <h2
              className="text-2xl font-bold "
              onClick={() => {
                console.log(Title);
              }}
            >
              เปิดรับสมัครสมาชิก
            </h2>
          </div>
          <div
            className="h-[100%] w-fit  flex items-center px-2 cursor-pointer"
            onClick={() => handelonclose()}
          >
            <X />
          </div>
        </div>
        <div className="flex flex-row w-full min-h-100 justify-between px-6">
          <div className="w-4/6 flex ">
            <div className="flex flex-col ">
              <form className="flex flex-col">
                {/* Event Name */}
                <div className="mb-4">
                  <label
                    className="block font-semibold mb-1"
                    htmlFor="eventName"
                  >
                    หัวข้อ:
                  </label>
                  <input
                    type="text"
                    id="eventName"
                    placeholder={prevform ? prevform.form_title : "Enter Title"}
                    className="w-full border border-[#FF7E69] rounded px-3 py-2"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Date & Time */}
                <div className="mb-4 flex space-x-4 ">
                  <div className="flex-1 ">
                    <label className="block font-semibold mb-1" htmlFor="date">
                      วัน-เวลา ปิดรับสมัคร
                    </label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="วว/ดด/ปป"
                      className="w-full border border-[#FF7E69] rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex items-end">
                    <label
                      className="block font-semibold mb-1 h-[20%]"
                      htmlFor="time"
                    >
                      &nbsp;
                    </label>
                    <div className="flex items-end space-x-2 h-[41px]">
                      <input
                        type="time"
                        id="startTime"
                        placeholder="00.00"
                        className="h-[100%] border border-[#FF7E69] rounded px-2 py-1"
                        onChange={handleStartTimeChange}
                      />
                    </div>
                  </div>
                </div>
                {/* Role Available */}
                <div>
                  <label
                    className="block font-semibold mb-1"
                    htmlFor="description"
                  >
                    <div className="flex items-end gap-3">
                      ตำแหน่งที่เปิดรับ{" "}
                      <p className="text-[#99a1af] text-[13px] font-medium">
                        กรอก ตำแหน่ง ขั้นด้วย "," เสมอ
                      </p>
                    </div>
                  </label>
                  <textarea
                    id="description"
                    placeholder={
                      prevform ? prevform?.role_available : "Enter Role"
                    }
                    className="w-full border border-[#FF7E69] rounded px-3 pt-2 h-32 max-h-[50vh]"
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Upload & Submit */}
          <div className="flex flex-col justify-between w-[30%] items-end ">
            {/* Image Upload Section */}
            <div className=" w-[100%] ">
              <div className=" max-w-[100%] overflow-clip rounded-[5px]">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer h-50 w-full mt-5"
                >
                  {clubPosterPreview ? (
                    <img src={clubPosterPreview} alt="uploaded poster"></img>
                  ) : (
                    <div className="border-2 border-gray-300 rounded-[5px] flex flex-col items-center justify-center p-4 mb-8 w-full aspect-[4/5] hover:bg-gray-100 overflow-hidden">
                      <Upload className="w-10 h-10 text-[#FF7E69]" />
                      <p className="text-gray-400 text-center whitespace-pre-line">
                        {clubPosterName}
                      </p>
                    </div>
                  )}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePosterFileChange}
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                className="bg-[#7CE9BF] hover:bg-emerald-400 active:bg-emerald-500 px-6 py-2 rounded shadow "
                type="button"
                onClick={()=>{setIsConfirmOpen(true);setOpentype("apply")}}
              >
                เปิดรับสมัครสมาชิก
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ClubFormManage;
