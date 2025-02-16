import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-neutral-200 opacity-80 shadow-md fixed top-0 left-0 w-full transition-all duration-300 z-10 h-18 font-prompt">
      <div className="bg-white shadow-md max-w-6xl mx-auto px-6 flex justify-between items-center h-14 my-2 rounded-full">
        {/* LOGO */}
        <h1 className="text-xl text-[#FF7E69] font-bold">North's Club</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-[#FF7E69]">
          <a href="#" className="hover:underline hover:text-[#7CE9BF]">หน้าหลัก</a>
          <a href="#" className="hover:underline hover:text-[#7CE9BF]">ชมรม</a>
          <a href="#" className="hover:underline hover:text-[#7CE9BF]">เอกสาร</a>
          <a href="#" className="hover:underline hover:text-[#7CE9BF]">สถิติ</a>
          <button className="bg-[#7CE9BF] text-black font-bold px-4 py-1 rounded-full hover:bg-emerald-400">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
