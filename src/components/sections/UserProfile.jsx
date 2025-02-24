import { Mail, Settings, User, SquarePen } from "lucide-react";

const UserProfile = () => {
  return (
    <div className="flex flex-col items-center p-6 max-w-5xl w-full">
      {/* Profile Section */}
      <div className="relative flex flex-col items-center">
        <img
          src="/assets/Maskgroup.png"
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white shadow-md"
        />
        <h2 className="text-2xl font-bold text-[#FF7E69] mt-2">นาย จิรายุ ภักดี</h2>
        <div className="flex items-center text-gray-600 mt-1">
          <Mail className="w-4 h-4 mr-2" />
          <span>s66010154987@email.kmutnb.ac.th</span>
        </div>
        <div className="flex flex-row mt-2 px-3 py-1 items-center rounded-md text-sm">
            <User className="text-[#7CE9BF] fill-[#7CE9BF]" />
            นักศึกษา
        </div>
        <Settings className="absolute top-0 right-0 w-6 h-6 text-gray-500 cursor-pointer" />
      </div>

      <div className="flex flex-row justify-between w-3/4 ">
        {/* Personal Information */}
        <div className="flex flex-col mt-6 w-full">
            <h3 className="text-lg font-semibold mb-2">ข้อมูลส่วนตัว</h3>
            
            <div className="flex flex-row p-4 gap-8 rounded-lg">
                <div className="flex flex-col ">
                    <p className="mb-6"><strong>ชื่อ:</strong> นายจิรายุ ภักดี</p>
                    <p className="mb-6"><strong>Name:</strong> Jirayu Pakdee</p>
                    <p className="mb-6"><strong>คณะ:</strong> วิทยาศาสตร์ประยุกต์</p>
                </div>
                <div className="flex flex-col justify-end">
                    <p className="mb-6"><strong>ชั้นปี:</strong> 2</p>
                    <p className="mb-6"><strong>สาขา:</strong> วิทยาการคอมพิวเตอร์</p>
                </div>
            </div>
        </div>

        {/* Clubs */}
        <div className="mt-6 w-1/2">
            <h3 className="text-lg font-semibold mb-2">ชมรมที่สังกัด</h3>
            <div className="mb-2 p-4 bg-white shadow-md rounded-lg flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/assets/esport.png" alt="KMUTNB Esport" className="w-10 h-10 rounded-md mr-3" />
                    <div>
                        <p className="font-bold">KMUTNB Esport</p>
                        <p className="text-gray-500 text-sm">Admin</p>
                    </div>
                </div>
            <SquarePen classname="text-gray-300" />
            </div>
            <div className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center">
                <div className="flex items-center">
                    <img src="/assets/boxing.png" alt="KMUTNB Boxing" className="w-10 h-10 rounded-md mr-3" />
                    <div>
                        <p className="font-bold">KMUTNB Esport</p>
                        <p className="text-gray-500 text-sm">Admin</p>
                    </div>
                </div>
                <SquarePen classname="text-gray-300" />
            </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;