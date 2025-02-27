import { Upload } from "lucide-react";
const Clubprofile = () => {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full mt-12">
      {/* Profile Picture */}
      <div className="relative flex flex-row items-center justify-end">
        <img
          src="/assets/Maskgroup.png"
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white shadow-md "
        />
        <Upload/>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-3xl">
        {/* Quote */}
        <div className="w-full">
          <label className="block text-gray-700">แก้ไข Quote</label>
          <textarea
            className="w-full p-3 border border-red-400 rounded-md focus:outline-none focus:border-red-500"
            rows="5"
          >
            เพราะความท้าทาย ไม่ได้มีแค่ในสนามกีฬาเท่านั้น
          </textarea>
        </div>

        {/* Tags */}
        <div className="w-full">
          <label className="block text-gray-700">Tags</label>
          <textarea
            className="w-full p-3 border border-red-400 rounded-md focus:outline-none focus:border-red-500"
            rows="5"
          >
            กีฬา,การแข่งขัน,ความท้าทาย,ความตื่นเต้น,ชมรมเกม
          </textarea>
        </div>
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-3xl">
        {/* Instagram URL */}
        <div className="w-full">
          <label className="block text-gray-700">Instagram</label>
          <input
            type="text"
            className="w-full p-3 border border-red-400 rounded-md focus:outline-none focus:border-red-500"
            defaultValue="IG.com"
          />
        </div>

        {/* Facebook URL */}
        <div className="w-full">
          <label className="block text-gray-700">Facebook</label>
          <input
            type="text"
            className="w-full p-3 border border-red-400 rounded-md focus:outline-none focus:border-red-500"
            defaultValue="facebook.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full max-w-3xl">
        {/* Email Input */}
            <div className="w-full">
                <label className="block text-gray-700">Email</label>
                <input
                    type="email"
                    placeholder="example@email.com"
                    className="w-full p-3 border border-red-400 rounded-md focus:outline-none focus:border-red-500"
                />
            </div>

        {/* Buttons */}
            <div className="flex justify-end items-center gap-4">
            <button className="text-gray-700">Cancel</button>
            <button className="bg-[#7CE9BF] text-white px-4 py-2 rounded-md">Confirm</button>
            </div>
        </div>

    </div>   
    );
};

export default Clubprofile;