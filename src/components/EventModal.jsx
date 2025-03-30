import { useEffect, useState } from "react";
import { Upload, RefreshCw } from "lucide-react";
import ConfirmCard from "../components/confirmCard";
import { FileUp, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import supabase from "../../supabaseClient";

const EventModal = ({ isOpen, onClose, clubId ,userId}) => {
  const [eventText, setEventText] = useState("กิจกรรม");
  const [eventTextColor, setEventTextColor] = useState("");
  const [eventColor, setEventColor] = useState("bg-[#7CE9BF]");
  const [isSpinning1, setIsSpinning1] = useState(false);

  const [statusText, setStatusText] = useState("Online");
  const [statusTextColor, setStatusTextColor] = useState("");
  const [statusColor, setStatusColor] = useState("bg-[#7CE9BF]");
  const [isSpinning2, setIsSpinning2] = useState(false);
  const [locationPlace,setPlace] = useState("สถานที่จัด")
  const [location, setLocation] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [clubPoster, setClubPoster] = useState("");
  const [clubPosterName, setClubPosterName] = useState(
    "Upload Poster\nClick Here"
  );
  const [clubPosterPreview, setClubPosterPreview] = useState(null);
  const [applicationDocument, setApplicationDocument] = useState("");
  const [fileName, setFileName] = useState("using (.pdf)");
  const [opentype,setOpentype] = useState("");

  const [eventTitle, setEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDescription, setAnnouncementDescription] = useState("");

  if (!isOpen) return null;
  const handleRefreshEventClick = () => {
    setIsSpinning1(true);
    setTimeout(() => setIsSpinning1(false), 500); // Spin for 0.5s

    if (eventText === "กิจกรรม") {
      setEventText("ประกาศ");
      setEventTextColor("text-white");
      setEventColor("bg-[#FF7E69]");
    } else {
      setEventText("กิจกรรม");
      setEventTextColor("text-black");
      setEventColor("bg-[#7CE9BF]");
    }
  };

  const handleRefreshStatusClick = (event) => {
    event.preventDefault();
    setIsSpinning2(true);
    setTimeout(() => setIsSpinning2(false), 500); // Spin for 0.5s

    if (statusText === "Online") {
      setStatusText("Offline");
      setStatusTextColor("text-white");
      setStatusColor("bg-[#FF7E69]");
      setPlace("สถานที่จัด")
    } else {
      setStatusText("Online");
      setStatusTextColor("text-black");
      setStatusColor("bg-[#7CE9BF]");
      setPlace("URL สำหรับเข้าร่วม")
    }
  };

  const handlePosterFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const fileType = file.type;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];   
        if (allowedTypes.includes(fileType)) {
          setClubPosterPreview(URL.createObjectURL(file));
          setClubPosterName(file.name || "Upload Poster\nClick Here");
          setClubPoster(file);
        } else {
            setIsConfirmOpen(true);
            setOpentype('errorUpload');
        }
      }
  };

  const handleDocumentFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(e.target.files[0]?.name || "using (png, jpg)");
      setApplicationDocument(e.target.files[0]);
    }
  };

  const handleStartTimeChange = (e) => {
    if (e?.target?.value) {
      setStartTime(e.target.value);
    }
  };

  const handleEndTimeChange = (e) => {
    if (e?.target?.value) {
      setEndTime(e.target.value);
    }
  };

  const uploadFile = async (file, bucket) => {
    console.log(file);
    if (!file) return "";
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType: file.type,
      });

    if (error) {
      console.error(`Upload error (${bucket}):`, error);
      return "";
    }
    return data.path;
  };

  const isFormValid = () => {
    const errors = [];
    if (eventText === "กิจกรรม") {
      if (!eventTitle.trim()) {
        setOpentype("errorEmpty")
        errors.push("Event title is required.");
      }
        
      if (!selectedDate) {
        setOpentype("errorEmpty")
        errors.push("Selected date is required.");
      } else {
        const selectedDateObj = new Date(selectedDate); // Convert string to Date
        const today = new Date();
        const thirtyDaysAhead = new Date();
        thirtyDaysAhead.setDate(today.getDate() + 30);
        //console.log(selectedDateObj);
        //console.log(today);
        //console.log(thirtyDaysAhead);

        if (selectedDateObj < thirtyDaysAhead) {
          errors.push("Selected date must be more than " + thirtyDaysAhead);
        }
      }

      if (!startTime || !endTime) {
          errors.push("Start time and end time are required.");
      }
        
      if(!location.trim()) {
        setOpentype("errorEmpty")
      }else {
        if (statusText === "Online") {
          const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}.*$/;
          if (!urlPattern.test(location.trim())) {
            setOpentype("errorURL");
            errors.push("Location must be a valid URL for Online status.");
          }
        } else if (statusText === "Offline") {
          setOpentype("errorEmpty");
          errors.push("Location is required for Offline status.");
        }
      }
      
      if (!eventDescription.trim()) {
        errors.push("eventDescription is required.");
      }
        
    }

    if (eventText === "ประกาศ") {
      if (!announcementTitle) {
        setOpentype("errorEmpty")
        errors.push("announcementTitle is required.");
      }
                 
      if (!announcementDescription) {
        errors.push("announcementDescription is required.");
        setOpentype("errorEmpty")
      }
        
    }

    //console.log(clubPoster)
    //console.log(applicationDocument)
    if (!clubPoster) {
      setOpentype("errorUpload")
      errors.push("clubPoster is required.");
    }
      
    if (!applicationDocument) {
      setOpentype("errorEmpty")
      errors.push("applicationDocument is required.");
    }

    if (errors.length > 0) {
      console.log("Form validation failed:", errors);
      return false;
    }

    return true;
  };

  const handleConfirmEvent = async () => {
    if (!isFormValid()) {
      setIsConfirmOpen(true)
      return;
    }
    const posterUrl = await uploadFile(clubPoster, "club-avatars");
    const docUrl = await uploadFile(applicationDocument, "club-documents");

    //console.log(eventText)
    if (eventText === "กิจกรรม") {
      const formattedDate = selectedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const { data: data, error: error } = await supabase.from("event").insert([
        {
          club_id: clubId,
          title: eventTitle,
          type: "event",
          start_date: formattedDate,
          start_time: startTime,
          end_time: endTime,
          status: statusText,
          location: location,
          description: eventDescription,
          poster: posterUrl,
          document: docUrl,
          approval_status: false,
          postby:userId,
        },
      ]);

      if (error) {
        console.error("insert error", error);
        return;
      }
    } else if (eventText === "ประกาศ") {
      const { data: data, error: error } = await supabase
        .from("announcement")
        .insert([
          {
            club_id: clubId,
            title: announcementTitle,
            type: "announcement",
            description: announcementDescription,
            poster: posterUrl,
            document: docUrl,
            approval_status: false,
            postby:userId,
          },
        ]);

      if (error) {
        console.error("insert error", error);
        return;
      }
    }

    window.location.reload();

    /*

        const formattedDate = selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        //if eventText == 'กิจกรรม'
        console.log(eventText)
        console.log(eventTitle);
        console.log(selectedDate);
        console.log(formattedDate);
        console.log(startTime +"to"+ endTime);
        console.log(statusText)
        console.log(place + " or " + url)
        console.log(eventDescription);
        console.log(eventTitle);

        //if eventText == 'ประกาศ'
        console.log(announcementTitle);
        console.log(announcementDescription);
        console.log(clubPoster)
        console.log(applicationDocument)
        */
  };
  const handelonclose = () => {
    console.log(applicationDocument);
    onClose();
    setClubPoster("");
    setClubPosterName("Upload Poster\nClick Here");
    setClubPosterPreview("");
    setFileName("using (.pdf)");
    setApplicationDocument('');
  };
  return (
    <div
      className="fixed flex inset-0 items-center justify-center bg-black/25 z-50 h-[100dvh]"
      onClick={handelonclose}
    >
      <div
        className="flex flex-col bg-white rounded-lg p-6 max-w-3xl w-full relative min-h-[70%] max-h-[100%]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Event and Announce Button */}
        <div className="flex flex-row items-center w-full gap-3 mb-4 justify-between ">
          <div className="flex flex-row gap-3 items-center w-[30%]">
            <h2 className="text-2xl font-bold ">สร้าง</h2>

            <h2
              className={`${eventColor} rounded-lg ${eventTextColor} py-2 px-4 text-center w-[100px] select-none hover:cursor-pointer`}
              onClick={handleRefreshEventClick}
            >
              {eventText}
            </h2>
            <button
              className="rounded-2xl flex items-center"
              onClick={handleRefreshEventClick}
              style={{
                cursor: "pointer",
              }}
            >
              <RefreshCw
                className={`w-5 h-5 rotate-45 ${
                    isSpinning1 ? "animate-spin" : ""
                  }`}
              />
            </button>
          </div>
                  <div className="text-gray-400">
                  *กรุณาประกาศก่อนล่วงหน้า 1 เดือน
                  </div>
          <div
            className="h-[100%] w-fit  flex items-center px-2 cursor-pointer"
            onClick={() => handelonclose()}
          >
            <X />
          </div>
        </div>
        <div className="flex flex-row w-full min-h-100 justify-between ">
          {eventText === "กิจกรรม" ? (
            <div className="w-4/6 flex ">
              <div className="flex flex-col ">
                <form className="flex flex-col">
                  {/* Event Name */}
                  <div className="mb-4">
                    <label
                      className="block font-semibold mb-1"
                      htmlFor="eventName"
                    >
                      ชื่อกิจกรรม :
                    </label>
                    <input
                      type="text"
                      id="eventName"
                      placeholder="Enter Event Name"
                      className="w-full border border-[#FF7E69] rounded px-3 py-2"
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                  </div>

                  {/* Date & Time */}
                  <div className="mb-4 flex space-x-4">
                    <div className="flex-1">
                      <label
                        className="block font-semibold mb-1"
                        htmlFor="date"
                      >
                        วันที่:
                      </label>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="วว/ดด/ปป"
                        className="w-full border border-[#FF7E69] rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        className="block font-semibold mb-1"
                        htmlFor="time"
                      >
                        เวลา:
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          id="startTime"
                          placeholder="00.00"
                          className="w-23 border border-[#FF7E69] rounded px-2 py-1"
                          onChange={handleStartTimeChange}
                        />
                        <span>ถึง</span>
                        <input
                          type="time"
                          id="endTime"
                          placeholder="00.00"
                          className="w-23 border border-[#FF7E69] rounded px-2 py-1"
                          onChange={handleEndTimeChange}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Status & Place */}
                  <div className="mb-4 flex space-x-4">
                    <div className="flex-1">
                      <div className="flex flex-row gap-2 items-center">
                        <h2
                          className="block font-semibold mb-1"
                          htmlFor="status"
                        >
                          แบบ:
                        </h2>
                        <h2
                          className={`${statusColor} rounded-lg ${statusTextColor} py-2 px-4 shadow-md cursor-pointer`}
                          onClick={handleRefreshStatusClick}
                        >
                          {statusText}
                        </h2>
                        <button
                          className="rounded-2xl py-2 px-4 flex items-center gap-2 cursor-pointer"
                          onClick={handleRefreshStatusClick}
                        >
                          <RefreshCw
                            className={`w-5 h-5 duration-50 rotate-45 ${
                              isSpinning2 ? "animate-spin" : ""
                            }`}
                          />
                        </button>
                        <label
                          className="block font-semibold mb-1"
                          htmlFor="place"
                        >
                          {statusText === "Online" ? "URL:" : "Place:"}
                        </label>
                        <input
                          type="location"
                          id="location"
                          placeholder={locationPlace}
                          className="w-full border border-[#FF7E69] rounded px-3 py-2"
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className="block font-semibold mb-1"
                      htmlFor="description"
                    >
                      คำอธิบาย:
                    </label>
                    <textarea
                      id="description"
                      placeholder="Enter Event Details"
                      className="w-full border border-[#FF7E69] rounded px-3 pt-2 h-32 max-h-[50vh]"
                      onChange={(e) => setEventDescription(e.target.value)}
                    />
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-4/6">
              <h2 className="text-xl font-bold mb-2">หัวข้อ</h2>
              <textarea
                id="Annoucement"
                placeholder="Enter Announcement Details"
                className="w-full border border-[#FF7E69] rounded px-3 py-2 max-h-[20vh] min-h-[45px]"
                onChange={(e) => setAnnouncementTitle(e.target.value)}
              />
              {/* Description */}
              <div className="mb-4">
                <label
                  className="block font-semibold mb-1"
                  htmlFor="description"
                >
                  คำอธิบาย:
                </label>
                <textarea
                  id="description"
                  placeholder="Enter Event Details"
                  className="w-full border border-[#FF7E69] rounded px-3 py-2 h-35 max-h-[54vh] min-h-[45px]"
                  onChange={(e) => setAnnouncementDescription(e.target.value)}
                />
              </div>
            </div>
          )}
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

              {/*Document Upload Section */}
              <div className="flex flex-col my-2 w-[100%]">
                <p className="text-left text-[#1A1A1A] text-sm">ไฟล์เอกสาร</p>
                <div className="flex flex-row ">
                  <label className="cursor-pointer flex items-center gap-2">
                    <FileUp size={40} className="text-white fill-[#7CE9BF]" />
                    <span className="text-gray-300 text-sm" style={{
                        color:applicationDocument===''?'#99a1af':"#1A1A1A"
                    }}>{fileName}</span>
                    <input
                      type="file"
                      onChange={handleDocumentFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
                <p className="text-left text-gray-400 text-sm"></p>
              </div>

            <div className="flex items-end">
              <button
                className="bg-[#7CE9BF] hover:bg-emerald-400 active:bg-emerald-500 px-6 py-2 rounded shadow "
                type="button"
                onClick={() => {setOpentype('event');
                    setIsConfirmOpen(true)}}
              >
                ยื่นคำขอ
              </button>
            </div>
          </div>
        </div>

        {/* ConfirmCard Modal */}
        <ConfirmCard
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          type={opentype}
          onConfirm={handleConfirmEvent}
        />
      </div>
    </div>
  );
};

export default EventModal;
