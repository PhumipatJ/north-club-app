import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search, Info, ChevronDown } from "lucide-react";
import supabaseService from "../../service/supabaseService";
import Loading from "../loading";

let clubs = [];
const tags = ["วิชาการ","กีฬา","ศิลปะและวัฒนธรรม","อาสาและบำเพ็ญประโยชน์"];

const Clublist = () => {
  const supabase = supabaseService.getClient();
  const [search, setSearch] = useState("");
  const [hoveredClub, setHoveredClub] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeClubs, setActiveClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedTags.length === 0 || 
      (Array.isArray(club.type) ? club.type.some(t => selectedTags.includes(t)) : selectedTags.includes(club.type)))
  );
  
  useEffect(() => {
    const fetchActiveClubs = async () => {
      const { data: clubsData, error: clubsError } = await supabase
        .from("clubs")
        .select("*, member_count:clubMembers(count)")
        .eq("club_approval", true);
  
      const { data: presidentsData, error: presidentsError } = await supabase
        .from("clubMembers")
        .select("club_id, email")
        .eq("position", "club_president");
  
      if (clubsError) console.error("Error fetching clubs:", clubsError);
      if (presidentsError) console.error("Error fetching presidents:", presidentsError);
  
      // Fetch user names for the presidents
      let presidentsWithNames = [];
      if (presidentsData?.length) {
        const emails = presidentsData.map(p => p.email);
  
        const { data: usersData, error: usersError } = await supabase
          .from("user")
          .select("email, name")
          .in("email", emails);
  
        if (usersError) console.error("Error fetching user names:", usersError);
  
        presidentsWithNames = presidentsData.map(president => {
          const user = usersData?.find(user => user.email === president.email);
          return { ...president, name: user ? user.name : "Unknown" };
        });
      }
  
      // Set active clubs with president names
      if (clubsData) {
        setActiveClubs(
          clubsData.map(club => {
            const president = presidentsWithNames.find(p => p.club_id === club.club_id);
            return {
              ...club,
              member_count: club.member_count[0]?.count || 0,
              founded_date: new Date(club.approve_date)
                .toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" }),
              president: president ? president.name : "Unknown"
            };
          })
        );
      }
    };
    setTimeout(() => {
      setLoading(false);
    }, 500);
    fetchActiveClubs();
  }, []);
  
  
  clubs = activeClubs.map(club => ({
    clubID: club.club_id,
    name: club.club_name,
    image: `${supabase.storage.from("club-avatars").getPublicUrl(club.club_avatar).data.publicUrl}`,
    tag: club.club_description,
    members: club.member_count,
    founded: club.founded_date,
    quote: club.club_quote,
    president: club.president, 
    type: club.club_type
  }));
  
  if(loading){
    return <>
    <Loading/>
    <div className="h-[100dvh]"></div>
    </>
  }
  return (
    <div className="max-w-4xl mx-auto p-4 mt-24 min-h-[77.8vh]">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold mb-4">ชมรมทั้งหมด</h1>
        
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="text-gray-500" size={20} />
          </div>
          <input
            type="text"
            placeholder="ค้นหาชมรม"
            className="w-full border rounded-lg p-2 pl-10 focus:ring-2 focus:ring-[#FF7E69] pl-10 
                      border-none outline-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-[#333] h-10 rounded-[20px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2 mb-4 items-end justify-end">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`px-4 py-2 rounded-full border border-[#7CE9BF] duration-100 ${
            selectedTags.includes(tag) ? "bg-[#7CE9BF] text-white " : "bg-none"}`}
            onClick={() => handleTagChange(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
          
      <div className="grid grid-cols-3 gap-6 mt-6">
      {filteredClubs.map((club, index) => (
          <div
            key={index}
            className="relative bg-white p-4 rounded-lg shadow-lg h-75 flex flex-col justify-between text-center"
          >
            <div className="absolute top-2 right-2">
              <Info 
                size={24} 
                className="cursor-pointer text-white fill-[#7CE9BF] hover:fill-emerald-400"
                onClick={() => setHoveredClub(index)}
              />
            </div>
            <img src={club.image} alt={club.name} className="w-32 h-32 mx-auto rounded-full" />
            <p className={`mt-2 font-medium ${club.name.length > 20 ? "text-sm" : "text-lg"}`}>{club.name}</p>
            <p className="mt-2 font-medium text-sm">"{club.quote}"</p>
            <button  
              className="w-full mt-4 bg-[#FF7E69] hover:bg-[#d66857] duration-300 text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => navigate(`/clubs/${club.clubID}`)} // Navigate on click
            >
              รายละเอียด
            </button>

            {hoveredClub === index && (
              <div className={`absolute top-0 bg-gray-50 shadow-lg p-4 rounded-lg w-96 text-black z-10 
                  ${index % 3 === 2 ? "right-0" : "left-0 translate-x-2/3"}`}
                  onMouseLeave={() => setHoveredClub(null)}
                >
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-12">
                    <img src={club.image} alt={club.name} className="w-16 h-16 rounded-full" />
                    <div>
                      <h3 className="font-bold text-2xl">{club.name}</h3>
                      <p className="text-sm">สมาชิก: {club.members} คน</p>
                      <p className="text-sm">วันก่อตั้ง: {club.founded}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4 items-center justify-center">
                    {club.tag.map((tag, i) => (
                      <span key={i} className="text-gray-700 px-2 py-1 rounded-full text-xs border-2 border-[#7CE9BF]">
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clublist;