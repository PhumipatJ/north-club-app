import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle, SquareArrowOutUpRight, SquarePlus, SquarePen, User } from "lucide-react";
import authService from "../service/AuthService"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null); // Reference for detecting outside clicks
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getSessionAndRole = async () => {
      const sessionData = await authService.getSession();
      setSession(sessionData);

      if (sessionData) {
        const role = await authService.getUserRole(sessionData.user.id);
        setUserRole(role);
      }
    };

    const { data: authListener } = authService.supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          authService.getUserRole(session.user.id).then(setUserRole);
        }
      }
    );
    
    getSessionAndRole();
    
    console.log(userRole)

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full transition-all duration-300 z-10 font-prompt ${isScrolled ? "opacity-95" : "p-3"}`}>
      <div className="bg-white shadow-md max-w-6xl mx-auto px-6 flex justify-between items-center h-14 my-2 rounded-full">
        {/* LOGO */}
        <h1 className="text-xl text-[#FF7E69] font-bold pt-2">North's Club</h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#FF7E69] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-[#FF7E69]">
          <Link to="/" className="hover:underline hover:text-[#7CE9BF] pt-1.5">หน้าหลัก</Link>
          <Link to="/clubs" className="hover:underline hover:text-[#7CE9BF] pt-1.5">ชมรม</Link>
          <Link to="/docs" className="hover:underline hover:text-[#7CE9BF] pt-1.5">เอกสาร</Link>
          <Link to="/stats" className="hover:underline hover:text-[#7CE9BF] pt-1.5">สถิติ</Link>

          {/* Conditional Rendering Based on Role */}
          {userRole === "admin" && (
            <Link to="/database" className="hover:underline hover:text-[#7CE9BF] pt-1.5">ฐานข้อมูล</Link>
          )}
          {userRole === "club" && (
            <Link to="/clubManage" className="hover:underline hover:text-[#7CE9BF] pt-1.5">จัดการชมรม</Link>
          )}

          {session ? (
            <div className="relative" ref={profileMenuRef}>
              {/* Profile Icon - Click to Show Dropdown */}
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="focus:outline-none"
              >
                <UserCircle size={32} className="text-[#7CE9BF]" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-72 bg-white shadow-lg rounded-lg p-4 font-[Prompt]">
                <div className="flex flex-row items-center justify-between gap-3 border-b pb-2">
                  <img src="/assets/Maskgroup.png" alt="Profile" className="w-12 h-12 rounded-full" />
                  <div>
                    <p className=" text-lg font-semibold">นาย จิรายุ ภักดีโต</p>
                    <div className="flex flex-row">
                      <User className="text-[#7CE9BF] fill-[#7CE9BF]"/>
                      <p className="text-gray-500 text-sm">นักศึกษา</p>
                    </div>
                  </div>
                  <Link to="/user">
                    <SquarePen className="text-gray-400 hover:text-gray-500" />
                  </Link>
                  
                </div>
          
                <div className="mt-3 border-b pb-2">
                  <p className="text-gray-500 text-sm">ชมรมที่สังกัด</p>
                  <div className="flex items-center gap-2 mt-1 p-2 border border-gray-200 hover:bg-gray-100 rounded-md">
                    <img src="/assets/esport.png" alt="KMUTNB Esport" className="w-8 h-8 rounded-full" />
                    <p className="text-sm">KMUTNB Esport (Admin)</p>
                    <SquareArrowOutUpRight className="text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 mt-1 p-2 border border-gray-200 hover:bg-gray-100 rounded-md">
                    <img src="/assets/boxing.png" alt="KMUTNB Esport" className="w-8 h-8 rounded-full" />
                    <p className="text-sm">KMUTNB Esport (Admin)</p>
                    <SquareArrowOutUpRight className="text-gray-400" />
                  </div>
                </div>
          
                <div className="flex flex-row items-center justify-between mt-3 p-2 border border-gray-200 hover:bg-gray-100 rounded-md"
                  onClick={() => navigate("/clubApplication")}>
                  <div>
                    <p className="text-[#7CE9BF] text-sm font-semibold">ไอเดียใหม่ ชมรมใหม่!</p>
                    <p className="text-xs text-gray-500">ยื่นคำขอสร้างชมรมใหม่เลย</p>  
                  </div>
                  <SquarePlus className="text-gray-400" />
                </div>
          
                <button 
                  className="w-full mt-3 bg-[#FF7E69] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-600"
                  onClick={async () => {
                    await authService.logout();
                  }}
                >
                  <span>ออกจากระบบ</span>
                </button>
              </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-[#7CE9BF] text-black font-bold px-4 py-1 rounded-full hover:bg-emerald-400">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md rounded-lg p-4 flex flex-col space-y-4 text-[#FF7E69] text-center mt-2 mx-4">
          <Link to="/" className="hover:underline hover:text-[#7CE9BF]">หน้าหลัก</Link>
          <Link to="/clubs" className="hover:underline hover:text-[#7CE9BF]">ชมรม</Link>
          <Link to="/docs" className="hover:underline hover:text-[#7CE9BF]">เอกสาร</Link>
          <Link to="/stats" className="hover:underline hover:text-[#7CE9BF]">สถิติ</Link>
      
          {userRole === "admin" && (
            <Link to="/database" className="hover:underline hover:text-[#7CE9BF]">ฐานข้อมูล</Link>
          )}
          {userRole === "club" && (
            <Link to="/clubManage" className="hover:underline hover:text-[#7CE9BF]">จัดการชมรม</Link>
          )}

          {session ? (
            <div className="flex flex-col items-center space-y-2">
              <UserCircle size={40} className="text-[#7CE9BF]" />
              <Link to="/profile" className="hover:underline text-gray-700">Profile</Link>
              <button
                onClick={async () => {
                  await authService.logout();
                }}
                className="bg-red-500 text-white font-bold px-4 py-1 rounded-full hover:bg-red-400"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-[#7CE9BF] text-black font-bold px-4 py-1 rounded-full hover:bg-emerald-400">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
