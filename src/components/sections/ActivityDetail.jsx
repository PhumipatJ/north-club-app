import { Calendar, MapPin } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";

const ActivityDetail = () => {
    return (
        <div className="max-w-4xl mx-auto p-12 shadow-lg rounded-xl border border-gray-200 bg-white mt-24 mb-8  ">
            <div className="flex flex-col w-full">
                <div className="flex flex-wrap md:flex-nowrap gap-4">
                    <div className="flex items-center justify-center relative overflow-hidden rounded-lg w-full md:w-1/2 aspect-[4/5]">
                        <img
                            src="/assets/image 31.webp"
                            alt="KMUTNB Alumni Talk Season 2"
                            className="w-fit h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1 px-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="bg-[#FF7E69] text-white px-3 py-1 rounded-md text-sm font-semibold">
                                1/1/2025
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#FF7E69]">ศิษย์เก่าเล่าเรื่อง SEASON 2</h2>
                        <p className="text-gray-600 text-sm">Organized by KMUTNB Photo Club</p>
                        <div className="mt-2 space-y-2 text-gray-700 text-sm">
                            <div>
                                <h2 className="text-xl font-semibold text-[#FF7E69]">สถานที่จัดกิจกรรม</h2>
                                <div className="flex items-center gap-2 pl-4">
                                    <MapPin size={16} />
                                    <span>หอประชุมบุญรัตน์</span>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-[#FF7E69]">เวลากิจกรรม</h2>
                                <div className="flex items-center gap-2 pl-4">
                                    <Calendar size={16} />
                                    <span>16.00 - 18.30 น.</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-2 mt-4">
                            <button className="w-full md:w-1/3 bg-[#7CE9BF] hover:bg-emerald-400 active:bg-emerald-500 text-white py-2 rounded-md">
                                สนใจ
                            </button>
                            <p className="text-gray-500 text-xs text-center md:text-left">
                                *แจ้งเตือนผ่านอีเมลเมื่อใกล้ถึงวันเวลา
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-3xl font-semibold">รายละเอียดกิจกรรม</h3>
                    <p className="text-sm text-gray-700 mt-1">
                        งานศิษย์เก่าเล่าเรื่อง KMUTNB Alumni Talk season 2
                        วันที่ 30 มกราคม 2568 ณ หอประชุมเบญจรัตน์ อาคารนวมินทรราชินี
                        โดยกลุ่มงานแนะแนว การศึกษาและอาชีพ มจพ.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-2">
                        <p className="text-sm text-gray-700">รับชมภาพเพิ่มเติมได้ที่</p>
                        <a
                            href="https://north-club-app.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 text-sm"
                        >
                            north-club-app.vercel.app
                        </a>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-6">
                    <h2 className="text-xl font-semibold text-[#FF7E69]">สอบถามเพิ่มเติม</h2>
                    <div className="flex gap-4 mt-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                            <FaFacebook className="w-5 h-5 text-[#7CE9BF]" />
                            <p>KMUTNB PHOTO CLUB</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaSquareInstagram className="w-5 h-5 text-[#7CE9BF]" />
                            <p>kmutnbphotoclub</p>
                        </div>
                        <div className="flex items-center gap-2 ">
                            <CiMail className="w-5 h-5 text-[#7CE9BF]" />
                            <p className="">kmutnbphotoclub.bkk@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetail;
