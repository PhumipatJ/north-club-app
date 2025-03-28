import { MapPinned } from "lucide-react";
import { Clock3 } from "lucide-react";

const ActivityList = () => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-4 flex gap-4 ">
        {/* รูปกิจกรรม */}
        <img src="/assets/image 31.webp" alt="กิจกรรม" className="w-48 h-64 rounded-lg object-cover" />


        {/ รายละเอียดกิจกรรม /}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold">ประกวดเทพสวนปาล์ม</h2>
            <p className="text-gray-500">KMUTNB Photo Club</p>
          </div>

          {/ สถานที่และเวลา /}
          <div className="text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                    <MapPinned size={24} color="black" />
                    <span>สถานที่จัดกิจกรรม : หอประชุมเบญจรัตน์</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <Clock3 size={24} color="black" />
                    <p> เวลา : 1 กุมภาพันธ์ 2025 16:00 - 18:30 น.</p>
                </div>
          </div>

          {/ ปุ่ม */}
          <div className="flex gap-2 justify-end">
            <button className="bg-[#7CE9BF] text-white px-4 py-2 rounded-lg">สนใจ</button>
            <button className="bg-[#FF7E69] text-white px-4 py-2 rounded-lg">รายละเอียด</button>
          </div>
        </div>
      </div>
    );
  };

  export default ActivityList;