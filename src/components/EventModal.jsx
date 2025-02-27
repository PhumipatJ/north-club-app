import { useState } from "react";
import { Upload, RefreshCw } from "lucide-react";
import ConfirmCard from "../components/confirmCard"
import { FileUp } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import supabase from "../../supabaseClient";

const EventModal = ({ isOpen, onClose, clubId }) => {
    const [eventText, setEventText] = useState("กิจกรรม");
    const [eventTextColor, setEventTextColor] = useState("");
    const [eventColor, setEventColor] = useState("bg-[#7CE9BF]");
    const [isSpinning1, setIsSpinning1] = useState(false);

    const [statusText, setStatusText] = useState("Online");
    const [statusTextColor, setStatusTextColor] = useState("");
    const [statusColor, setStatusColor] = useState("bg-[#7CE9BF]");
    const [isSpinning2, setIsSpinning2] = useState(false);

    const [location, setLocation] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    
    const [clubPoster, setClubPoster] = useState("");
    const [clubPosterName, setClubPosterName] = useState("Upload Poster\nClick Here");
    const [clubPosterPreview, setClubPosterPreview] = useState(null);
    
    const [applicationDocument, setApplicationDocument] = useState("");
    const [fileName, setFileName] = useState("using (png, jpg)");

    const [eventTitle, setEventTitle] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementDescription, setAnnouncementDescription] = useState('');

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
        } else {
            setStatusText("Online");
            setStatusTextColor("text-black");
            setStatusColor("bg-[#7CE9BF]");
        }
    };

    const handlePosterFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setClubPosterPreview(URL.createObjectURL(file));
          setClubPosterName(e.target.files[0]?.name || "Upload Poster\nClick Here");
          setClubPoster(e.target.files[0]);
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

    const isFormValid = () => {
        const errors = [];
        if (eventText === "กิจกรรม") {
            if (!eventTitle.trim()) errors.push("Event title is required.");
            if (!selectedDate) {
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
            
            
            if (!startTime || !endTime) errors.push("Start time and end time are required.");
            if (!location.trim()) errors.push("Location is required.");
            if (!eventDescription.trim()) errors.push("eventDescription is required.");
        }
    
        if (eventText === "ประกาศ") {
            if (!announcementTitle) errors.push("announcementTitle is required.");
            if (!announcementDescription) errors.push("announcementDescription is required.");
        }
        
        //console.log(clubPoster)
        //console.log(applicationDocument)
        if (!clubPoster) errors.push("clubPoster is required.");
        if (!applicationDocument) errors.push("applicationDocument is required.");

        if (errors.length > 0) {
            console.log("Form validation failed:", errors);
            return false;
        }
    
        return true;
    };
    
    

    const handleConfirmEvent = async () => {
        if (!isFormValid()) {
            alert("Error input")
            return; 
          }
        const posterUrl = await uploadFile(clubPoster, "club-avatars");
        const docUrl = await uploadFile(applicationDocument, "club-documents");

        //console.log(eventText)
        if(eventText === "กิจกรรม"){
            const formattedDate = selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
                },
              ]);
              
              if (error) {
                console.error("insert error", error);
                return;
              }
        }
        else if(eventText === "ประกาศ"){
            const { data: data, error: error } = await supabase.from("announcement").insert([
                {
                  club_id: clubId,
                  title: announcementTitle, 
                  type: "announcement",
                  description: announcementDescription,
                  poster: posterUrl,
                  document: docUrl,
                  approval_status: false,
                },
              ]);
              
              if (error) {
                console.error("insert error", error);
                return;
              }
        }
        

        alert("Club created successfully");
        
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

    return (
        <div className="fixed flex inset-0 items-center justify-center bg-black/25 z-50 " onClick={onClose}>
            <div className="flex flex-col justify-between bg-white rounded-lg p-6 max-w-3xl w-full relative" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>
                    ✕
                </button>
                {/* Event and Announce Button */}
                <div className="flex flex-row items-center w-full gap-8 mb-4">
                    <h2 className="text-2xl font-bold">สร้าง</h2>
                    <h2 className={`${eventColor} rounded-lg ${eventTextColor} py-2 px-4 shadow-md`}>{eventText}</h2>
                    <button className="rounded-2xl py-2 px-4 flex items-center gap-2" onClick={handleRefreshEventClick}>
                        <RefreshCw className={`w-5 h-5 ${isSpinning1 ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                
                    <div className="flex flex-row w-full min-h-100 justify-between">
                    {eventText === "กิจกรรม" ? (
                        <div className="w-4/6 flex">
                            <div className="flex flex-col">
                                <form className="flex flex-col">
                                    {/* Event Name */}
                                    <div className="mb-4">
                                        <label className="block font-semibold mb-1" htmlFor="eventName">
                                            Event Name:
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
                                            <label className="block font-semibold mb-1" htmlFor="date">
                                                Date:
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
                                            <label className="block font-semibold mb-1" htmlFor="time">
                                                Time:
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="time"
                                                    id="startTime"
                                                    placeholder="00.00"
                                                    className="w-23 border border-[#FF7E69] rounded px-2 py-1"
                                                    onChange={handleStartTimeChange}
                                                />
                                                <span>to</span>
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
                                                <h2 className="block font-semibold mb-1" htmlFor="status">
                                                    Status:
                                                </h2>
                                                <h2 className={`${statusColor} rounded-lg ${statusTextColor} py-2 px-4 shadow-md`}>{statusText}</h2>
                                                <button className="rounded-2xl py-2 px-4 flex items-center gap-2" onClick={handleRefreshStatusClick}>
                                                    <RefreshCw className={`w-5 h-5 ${isSpinning2 ? 'animate-spin' : ''}`} />
                                                </button>
                                                <label className="block font-semibold mb-1" htmlFor="place">
                                                    {statusText === "Online" ? "URL:" : "Place:"}
                                                </label>
                                                    <input
                                                        type="location"
                                                        id="location"
                                                        placeholder="Enter Location"
                                                        className="w-full border border-[#FF7E69] rounded px-3 py-2"
                                                        onChange={(e) => setLocation(e.target.value)}
                                                    />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mb-4">
                                        <label className="block font-semibold mb-1" htmlFor="description">
                                            Description:
                                        </label>
                                        <textarea
                                            id="description"
                                            placeholder="Enter Event Details"
                                            className="w-full border border-[#FF7E69] rounded px-3 py-2 h-32"
                                            onChange={(e) => setEventDescription(e.target.value)}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                ) : (
                    <div className="flex flex-col w-4/6">
                        <h2 className="text-xl font-bold mb-2">Annoucement Title</h2>
                        <textarea
                            id="Annoucement"
                            placeholder="Enter Announcement Details"
                            className="w-full border border-[#FF7E69] rounded px-3 py-2 "
                            onChange={(e) => setAnnouncementTitle(e.target.value)}
                        />
                        {/* Description */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1" htmlFor="description">
                                Description:
                            </label>
                            <textarea
                                id="description"
                                placeholder="Enter Event Details"
                                className="w-full border border-[#FF7E69] rounded px-3 py-2 h-35"
                                onChange={(e) => setAnnouncementDescription(e.target.value)}
                            />
                        </div>
                    </div>
                )}
                {/* Upload & Submit */}
                <div className="flex flex-col space-x-4 justify-between items-center">
                    {/* Image Upload Section */}
                    <label htmlFor="file-upload" className="cursor-pointer h-50 w-full mt-5">
                    <div className="border-2 border-gray-300 rounded-2xl flex flex-col items-center justify-center p-4 mb-8 w-full aspect-[4/5] hover:bg-gray-100 overflow-hidden">
                        <Upload className="w-10 h-10 text-[#FF7E69]" />
                        <p className="text-gray-400 text-center whitespace-pre-line">{clubPosterName}</p>
                    </div>
                    </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePosterFileChange}
                        />

                    {/*Document Upload Section */} 
                        <div className="flex flex-col mt-6">
                        <p className="text-left text-gray-400 text-sm">ไฟล์เอกสาร</p>
                            <div className="flex flex-row items-center">
                                <label className="cursor-pointer flex items-center gap-2">
                                <FileUp size={40} className="text-white fill-[#7CE9BF]" />
                                <span className="text-gray-300 text-sm">{fileName}</span>
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
                            onClick={() => setIsConfirmOpen(true)}
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
                type="event"
                onConfirm={handleConfirmEvent}
                />

            </div>
        </div>
    );
};

export default EventModal;