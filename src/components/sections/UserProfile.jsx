import { Mail, Settings, User, SquarePen } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";

const UserProfile = () => {
  const location = useLocation();
  const userInfo = location.state?.userInfo || {}; 
  const [userClub, setUserClub] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const { data: clubData, error: clubError } = await supabase
          .from("clubMembers")
          .select("club_id, position, clubs!inner(club_name, club_avatar)")
          .eq("email", userInfo?.email)
          .eq("clubs.club_approval",true);

        if (clubError) {
          console.error("Error fetching club data:", clubError);
          return;
        }

        setUserClub(clubData || []); 
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchClubData();
  }, [userInfo?.email]); 
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full">
      {/* Profile Section */}

      <div className="relative flex flex-col items-center">
        <img
          src="/assets/Maskgroup.png"
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white shadow-md"
        />
        <h2 className="text-2xl font-bold text-[#FF7E69] mt-2">{userInfo?.gender === "M" ? "นาย" : "นาง"} {userInfo?.name}</h2>
        <div className="flex items-center text-gray-600 mt-1">
          <Mail className="w-4 h-4 mr-2" />
          <span>{userInfo?.email}</span>
        </div>
        <div className="flex flex-row mt-2 px-3 py-1 items-center rounded-md text-sm">
          <User className="text-[#7CE9BF] fill-[#7CE9BF]" />
          {userInfo?.role === "student"
                          ? "นักศึกษา"
                          : userInfo?.role === "club"
                          ? "กรรมการชมรม"
                          : "กองกิจการนักศึกษา"}
        </div>
        <Settings className="absolute top-0 right-0 w-6 h-6 text-gray-500 cursor-pointer" />
      </div>

      <div className="flex flex-row justify-between w-3/5 mt-6">
        {/* Personal Information */}
        <div className="flex flex-col w-full">
          <h3 className="text-lg font-semibold mb-2">ข้อมูลส่วนตัว</h3>
          
          <div className="flex flex-row p-4 gap-8 rounded-lg">
            <div className="flex flex-col">
              <p className="mb-6"><strong>ชื่อ:</strong> {userInfo?.gender === "M" ? "นาย" : "นาง"} {userInfo?.name}</p>
              <p className="mb-6"><strong>คณะ:</strong> {userInfo?.faculty}</p>
            </div>
            <div className="flex flex-col justify-end">
              <p className="mb-6"><strong>ชั้นปี:</strong> {new Date().getFullYear() + 543 - userInfo?.admission_year}</p>
              <p className="mb-6"><strong>สาขา:</strong> {userInfo?.department}</p>
            </div>
          </div>
        </div>

        {/* Clubs */}
        <div className="w-1/2">
          <h3 className="text-lg font-semibold mb-2">ชมรมที่สังกัด</h3>
            <div className="max-h-40 overflow-y-auto">
              {userClub.map((club, index) => (
                <div
                key={index}
                className="flex items-center gap-2 p-2 border border-gray-200 hover:bg-gray-100 rounded-md"
                >
                  <img
                    src={`${supabase.storage.from("club-avatars").getPublicUrl(club?.clubs.club_avatar).data.publicUrl}`}
                    alt={club.club_id}
                    className="w-8 h-8 rounded-full"
                  />

                  <div className="flex justify-between items-center w-full" onClick={() => navigate(`/clubs/${club.club_id}`)}>
                    <p className="text-sm">{club?.clubs.club_name} <br/> ({club.position})</p>
                    <SquarePen size={20} className="text-gray-400" />
                </div>

                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default UserProfile;