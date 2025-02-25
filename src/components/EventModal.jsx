import { useState } from "react";
import { Upload, RefreshCw } from "lucide-react";
import ConfirmCard from "../components/confirmCard"

const EventModal = ({ isOpen, onClose }) => {
    const [eventText, setEventText] = useState("กิจกรรม");
    const [eventTextColor, setEventTextColor] = useState("");
    const [eventColor, setEventColor] = useState("bg-[#7CE9BF]");
    const [isSpinning1, setIsSpinning1] = useState(false);

    const [statusText, setStatusText] = useState("Online");
    const [statusTextColor, setStatusTextColor] = useState("");
    const [statusColor, setStatusColor] = useState("bg-[#7CE9BF]");
    const [isSpinning2, setIsSpinning2] = useState(false);

    const [place, setPlace] = useState("");
    const [url, setUrl] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [imageName, setImageName] = useState("Upload Poster\nClick Here");

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

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageName(file.name); // Update the text to the file name
        }
    };

    return (
        <div className="fixed flex inset-0 items-center justify-center bg-black/25 z-50" onClick={onClose}>
            <div className="flex flex-col justify-between bg-white rounded-lg p-6 max-w-2xl w-full relative" onClick={(e) => e.stopPropagation()}>
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
                                        />
                                    </div>

                                    {/* Date & Time */}
                                    <div className="mb-4 flex space-x-4">
                                        <div className="flex-1">
                                            <label className="block font-semibold mb-1" htmlFor="date">
                                                Date:
                                            </label>
                                            <input
                                                type="text"
                                                id="date"
                                                placeholder="วว/ดด/ปป"
                                                className="w-full border border-[#FF7E69] rounded px-3 py-2"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block font-semibold mb-1" htmlFor="time">
                                                Time:
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    id="startTime"
                                                    placeholder="00.00"
                                                    className="w-16 border border-[#FF7E69] rounded px-2 py-1"
                                                />
                                                <span>to</span>
                                                <input
                                                    type="text"
                                                    id="endTime"
                                                    placeholder="00.00"
                                                    className="w-16 border border-[#FF7E69] rounded px-2 py-1"
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
                                                {statusText === "Online" ? (
                                                    <input
                                                        type="url"
                                                        id="url"
                                                        placeholder="Enter URL"
                                                        className="w-full border border-[#FF7E69] rounded px-3 py-2"
                                                        value={place}
                                                        onChange={(e) => setPlace(e.target.value)}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        id="place"
                                                        placeholder="Enter Place"
                                                        className="w-full border border-[#FF7E69] rounded px-3 py-2"
                                                        value={url}
                                                        onChange={(e) => setUrl(e.target.value)}
                                                    />
                                                )}
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
                                            className="w-full border border-[#FF7E69] rounded px-3 py-2"
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
                            className="w-full border border-[#FF7E69] rounded px-3 py-2"
                        />
                        {/* Description */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1" htmlFor="description">
                                Description:
                            </label>
                            <textarea
                                id="description"
                                placeholder="Enter Event Details"
                                className="w-full border border-[#FF7E69] rounded px-3 py-2"
                            />
                        </div>
                    </div>
                )}
                {/* Upload & Submit */}
                <div className="flex flex-col space-x-4 justify-between items-center">
                    {/* Image Upload Section */}
                    <label htmlFor="file-upload" className="cursor-pointer h-50 w-full">
                        <div className="border-2 border-gray-300 rounded-2xl flex flex-col items-center justify-center p-4 mb-8 w-full h-full hover:bg-gray-100">
                            <Upload className="w-10 h-10 text-[#FF7E69]" />
                            <p className="text-gray-400 text-center whitespace-pre-line">{imageName}</p>
                        </div>
                    </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    <div className="flex items-end">
                    <button
                            className="bg-[#7CE9BF] hover:bg-emerald-400 active:bg-emerald-500 px-6 py-2 rounded shadow"
                            type="button"
                            onClick={() => setIsConfirmOpen(true)}
                            >
                            สร้างกิจกรรม
                        </button>
                    </div>
                </div>
                </div>
                {/* ConfirmCard Modal */}
                <ConfirmCard isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} type="event" />
            </div>
        </div>
    );
};

export default EventModal;