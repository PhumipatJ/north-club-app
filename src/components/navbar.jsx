import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  UserCircle,
  SquareArrowOutUpRight,
  SquarePlus,
  SquarePen,
  User,
  ChevronDown,
} from "lucide-react";
import authService from "../service/AuthService";
import supabase from "../../supabaseClient";
import { Box,Avatar } from "@mui/material";

const Navbar = ({sendUserinfo}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null); // Reference for detecting outside clicks
  const [showClubCard, setShowClubCard] = useState(false);
  const clubCardRef = useRef(null);
  const navigate = useNavigate();

  const [userClub, setUserClub] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  const [userClubPosition, setUserClubPosition] = useState([]);

  useEffect(() => {
    if (session && userInfo) {
      sendUserinfo(userInfo);  // เรียกใช้ฟังก์ชันจาก parent
    }
  }, [session, userInfo]);
  

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
      console.log(sessionData);
      setSession(sessionData);
      if(session === null){
        console.log("now log out")
      }
      else{
        console.log("am in")
      }

      if (sessionData) {
        const role = await authService.getUserRole(sessionData.user.id);
        setUserRole(role);
        const clubPosition = await authService.getUserClubPosition(sessionData.user.email);
        //console.log(clubPosition)
        setUserClubPosition(clubPosition)
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
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
      if (clubCardRef.current && !clubCardRef.current.contains(event.target)) {
        setShowClubCard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getPersonalInfo = async () => {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      }
      setUserInfo(data);

      const { data: clubData, error: clubError } = await supabase
        .from("clubMembers")
        .select("club_id, position, clubs!inner(club_name, club_avatar)")
        .eq("email", data?.email)
        .eq("clubs.club_approval", true);

      if (clubError) {
        console.error("Error fetching club data:", clubError);
      }
      setUserClub(clubData);
    };

    if (session?.user?.id) {
      getPersonalInfo();
    }
  }, [session]);
  const handleLogout =()=>{
    
  }
  return (
    <nav
      className={`fixed top-0 left-0 w-full transition-all duration-300 z-10 font-prompt ${
        isScrolled ? "opacity-95" : "p-3"
      }`}
    >
      <div className="bg-white shadow-md max-w-6xl mx-auto px-6 flex justify-between items-center h-14 my-2 rounded-full">
        {/* LOGO */}
        <h1
          className="text-xl text-[#FF7E69] font-bold pt-2 cursor-pointer hover:text-[#7CE9BF] "
          onClick={() =>
            location.pathname === "/"
              ? document.documentElement.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              : navigate("/")
          }
        >
          North's Club{" "}
        </h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#FF7E69] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-[#FF7E69]">
          {location.pathname === "/" ? (
            <Link
              to="/"
              className="hover:underline hover:text-[#7CE9BF] text-[#7CE9BF] pt-1.5"
            >
              หน้าหลัก
            </Link>
          ) : (
            <Link
              to="/"
              className="hover:underline hover:text-[#7CE9BF] pt-1.5"
            >
              หน้าหลัก
            </Link>
          )}
          {location.pathname === "/clubs" ? (
            <Link
              to="/clubs"
              className="hover:underline hover:text-[#7CE9BF] text-[#7CE9BF] pt-1.5"
            >
              ชมรม
            </Link>
          ) : (
            <Link
              to="/clubs"
              className="hover:underline hover:text-[#7CE9BF] pt-1.5"
            >
              ชมรม
            </Link>
          )}

          {location.pathname === "/docs" ? (
            <Link
              to="/docs"
              className="hover:underline hover:text-[#7CE9BF] pt-1.5 text-[#7CE9BF]"
            >
              เอกสาร
            </Link>
          ) : (
            <Link
              to="/docs"
              className="hover:underline hover:text-[#7CE9BF] pt-1.5"
            >
              เอกสาร
            </Link>
          )}
          {location.pathname === "/stats" ? (
            <Link
              to="/stats"
              className="hover:underline hover:text-[#7CE9BF] pt-1.5 text-[#7CE9BF]"
            >
              สถิติ
            </Link>
          ) : (
            <Link
              to="/stats"
              className="hover:underline hover:text-[#7CE9BF] pt-1.5"
            >
              สถิติ
            </Link>
          )}
          {/* Conditional Rendering Based on Role */}

          {userRole === "admin" &&
            (location.pathname === "/database" ||
            location.pathname === "/database/adminRespond" ||
            location.pathname === "/database/approvalHistory" ? (
              <Link
                to="/database"
                className="hover:underline hover:text-[#7CE9BF] pt-1.5 text-[#7CE9BF]"
              >
                ฐานข้อมูล
              </Link>
            ) : (
              <Link
                to="/database"
                className="hover:underline hover:text-[#7CE9BF] pt-1.5"
              >
                ฐานข้อมูล
              </Link>
            ))}
          {userRole === "club" && (
            <div className="relative" ref={clubCardRef}>
              <button
                onClick={() => setShowClubCard(!showClubCard)}
                className="hover:underline hover:text-[#7CE9BF] pt-1.5 "
                style={{
                  cursor: "pointer",
                }}
              >
                จัดการชมรม
              </button>
              {showClubCard && (
                <div className="absolute right-0 mt-6 w-72 bg-white shadow-lg rounded-lg p-4 z-20 cursor-pointer">
                  <p className="text-gray-500 text-sm">ชมรมที่สังกัด</p>

                  <Box
                    sx={{
                      maxHeight: "10rem",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "5px",
                        height: "2px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#FF7E69",
                        borderRadius: "10px",
                        transition: "background-color 1s ease",
                      },
                    }}
                  >
                    {" "}
                    {/* Scrollable container */}
                    {userClub
                      .filter((club) => club?.position !== "สมาชิกชมรม")
                      .map((club, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 border border-gray-200 hover:bg-gray-100 rounded-md mb-1"
                        >
                          <img
                            src={`${
                              supabase.storage
                                .from("club-avatars")
                                .getPublicUrl(club?.clubs.club_avatar).data
                                .publicUrl
                            }`}
                            alt={club.club_id}
                            className="w-8 h-8 rounded-full"
                          />
                          <div
                            className="flex justify-between items-center w-full"
                            onClick={() =>{
                              setShowClubCard(false);
                              navigate(`/clubmanage/${club.club_id}`);
                            }
                              
                            }
                          >
                            <p className="text-sm">
                              {club?.clubs.club_name} <br /> ({club.position})
                            </p>
                            <SquareArrowOutUpRight
                              size={20}
                              className="text-gray-400"
                            />
                          </div>
                        </div>
                      ))}
                  </Box>
                </div>
              )}
            </div>
          )}

          {session ? (
            <div className="relative" ref={profileMenuRef}>
              {/* Profile Icon - Click to Show Dropdown */}
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="focus:outline-none cursor-pointer"
              >
                <div className="flex items-center gap-1">
                <ChevronDown className="text-[#7CE9BF] "/>
                <Avatar src="/assets/Maskgroup.png" alt="profile" sx={{cursor:'pointer',
                transition:'ease-in',
                transitionDuration:'0.05s',
                  '&:hover':{boxShadow:'0px 0px 3px 1px #1A1A1A30'}
                }}/>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-80 bg-white shadow-lg rounded-lg p-4 font-[Prompt] ">
                  <div className="flex flex-row items-center justify-between gap-3 border-b pb-2">
                    <img
                      src="/assets/Maskgroup.png"
                      alt="Profile"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className=" text-lg font-semibold">
                        {userInfo?.gender === "M" ? "นาย" : "นาง"}{" "}
                        {userInfo?.name}
                      </p>
                      <div className="flex flex-row">
                        <User className="text-[#7CE9BF] fill-[#7CE9BF]" />
                        <p className="text-gray-500 text-sm">
                          {userInfo?.role === "student" ? "นักศึกษา" : userInfo?.role === "club" || userInfo?.role === "clubMember" ? "นักศึกษาสังกัดชมรม" : "กองกิจการนักศึกษา"}
                        </p>
                      </div>
                    </div>
                    <SquarePen
                      size={20}
                      className="text-gray-400 hover:text-gray-500 cursor-pointer"
                      onClick={() =>{
                        setShowProfileMenu(false);
                        navigate("/userprofile", { state: { userInfo } })}
                      }
                    />
                  </div>

                  {userInfo?.role !== "admin" && (
                    <>
                      {userClub?.length > 0 && (
                        <div className="mt-3 border-b pb-2">
                          <p className="text-gray-500 text-sm">ชมรมที่สังกัด</p>
                          <Box
                            sx={{
                              maxHeight: "10rem",
                              overflowY: "auto",
                              "&::-webkit-scrollbar": {
                                width: "5px",
                                height: "2px",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#FF7E69",
                                borderRadius: "10px",
                                transition: "background-color 1s ease",
                              },
                            }}
                          >
                            {" "}
                            {/* Scrollable container */}
                            {userClub.map((club, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 border border-gray-200 hover:bg-gray-100 rounded-md cursor-pointer"
                              >
                                <img
                                  src={`${
                                    supabase.storage
                                      .from("club-avatars")
                                      .getPublicUrl(club?.clubs.club_avatar)
                                      .data.publicUrl
                                  }`}
                                  alt={club.club_id}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div
                                  className="flex justify-between items-center w-full"
                                  onClick={() =>{
                                    setShowProfileMenu(false);
                                    navigate(`/clubs/${club.club_id}`)
                                  }
                                  }
                                >
                                  <div>
                                    <p className="text-sm">
                                      {club?.clubs.club_name} <br />{" "}
                                    </p>
                                    <p className="text-[12px] text-[#1A1a1a]">
                                      ({club.position})
                                    </p>
                                  </div>

                                  <SquareArrowOutUpRight
                                    size={20}
                                    className="text-gray-400"
                                  />
                                </div>
                              </div>
                            ))}
                          </Box>
                        </div>
                      )}

                      <Link
                        to="/clubApplication"
                        onClick={()=>setShowProfileMenu(false)}
                        className="flex flex-row items-center justify-between mt-3 p-2 border border-gray-200 hover:bg-gray-100 rounded-md"
                      >
                        <div>
                          <p className="text-[#7CE9BF] text-sm font-semibold">
                            ไอเดียใหม่ ชมรมใหม่!
                          </p>
                          <p className="text-xs text-gray-500">
                            ยื่นคำขอสร้างชมรมใหม่เลย
                          </p>
                        </div>
                        <SquarePlus className="text-gray-400" />
                      </Link>
                    </>
                  )}

                  <button
                    className="w-full mt-3 bg-[#FF7E69] text-white py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0px_0px_5px_2px_#FF7E697D] transition-shadow ease-in-out duration-200"
                    onClick={async () => {
                      setShowProfileMenu(false);
                      await authService.logout();
                    }}
                  >
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#7CE9BF] text-black font-bold px-4 py-1 rounded-full hover:bg-emerald-400"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md rounded-lg p-4 flex flex-col space-y-4 text-[#FF7E69] text-center mt-2 mx-4">
          <Link
            to="/"
            className="hover:underline hover:text-[#7CE9BF]"
            onClick={() => setIsOpen(false)}
          >
            หน้าหลัก
          </Link>
          <Link
            to="/clubs"
            className="hover:underline hover:text-[#7CE9BF]"
            onClick={() => setIsOpen(false)}
          >
            ชมรม
          </Link>
          <Link
            to="/docs"
            className="hover:underline hover:text-[#7CE9BF]"
            onClick={() => setIsOpen(false)}
          >
            เอกสาร
          </Link>
          <Link
            to="/stats"
            className="hover:underline hover:text-[#7CE9BF]"
            onClick={() => setIsOpen(false)}
          >
            สถิติ
          </Link>

          {userRole === "admin" && (
            <Link
              to={"/database"}
              className="hover:underline hover:text-[#7CE9BF]"
              onClick={() => setIsOpen(false)}
            >
              ฐานข้อมูล
            </Link>
          )}
          {userRole === "club" && (
            <div className="flex flex-col items-center space-y-2">
              <UserCircle size={40} className="text-[#7CE9BF]" />
              <Link to="/profile" className="hover:underline text-gray-700">
                Profile
              </Link>
              <button
                onClick={async () => {
                  await authService.logout();
                }}
                className="bg-red-500 text-white font-bold px-4 py-1 rounded-full hover:bg-red-400"
              >
                Logout
              </button>
            </div>
          )}

          {session ? (
            <div className="flex flex-col items-center space-y-2">
              <UserCircle size={40} className="text-[#7CE9BF]" />
              <Link to="/profile" className="hover:underline text-gray-700">
                Profile
              </Link>
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
            <Link
              to="/login"
              className="bg-[#7CE9BF] text-black font-bold px-4 py-1 rounded-full hover:bg-emerald-400"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
