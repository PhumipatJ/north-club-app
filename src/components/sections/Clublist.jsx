import { useState } from "react";
import { Filter, Search, Info, ChevronDown } from "lucide-react";

const clubs = [
  { name: "KMUTNB Esport", image: "/assets/esport.png", tag:["กีฬา","ศิลปะและวัฒนธรรม"], members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด" },
  { name: "KMUTNB Boxing Club", image: "/assets/boxing.png", tag: ["วิชา","กีฬา","ศิลปะและวัฒนธรรม"], members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "KMUTNB Photo Club", image: "/assets/photo.png", tag: ["ศิลปะและวัฒนธรรม","อาสาและบำเพ็ญประโยชน์"], members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "ชมรมชีวิตและสุขภาพ", image: "/assets/health.png", tag: ["ศิลปะและวัฒนธรรม"], members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "ชมรมเทควันโดพระจอมเกล้าพระนครเหนือ", image: "/assets/taekwondo.png", tag: ["วิชา","กีฬา","ศิลปะและวัฒนธรรม"], members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "Esan Club KMUTNB", image: "/assets/esan.png", tag: ["วิชา","กีฬา","ศิลปะและวัฒนธรรม","อาสาและบำเพ็ญประโยชน์"], members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "ชมรมดนตรีไทย บางอุดม", image: "/assets/thaimusic.png", tag: ["วิชา","ศิลปะและวัฒนธรรม"], members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "KMUTNB Running", image: "/assets/running.png", tag: ["กีฬา","ศิลปะและวัฒนธรรม","อาสาและบำเพ็ญประโยชน์"], members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "ชมรมชาวเหนือ", image: "/assets/north.png", tag: ["ศิลปะและวัฒนธรรม"], members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "KMUTNB Shooting Club", image: "/assets/shooting.png", tag: ["กีฬา"], members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "KMUTNB Cycling Club", image: "/assets/cycling.png", tag: ["กีฬา"], members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "KMUTNB Media Club", image: "/assets/media.png", tag:["อาสาและบำเพ็ญประโยชน์"], members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
];

const tags = ["วิชา","กีฬา","ศิลปะและวัฒนธรรม","อาสาและบำเพ็ญประโยชน์"];

const Clublist = () => {
  const [search, setSearch] = useState("");
  const [hoveredClub, setHoveredClub] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleTagChange = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedTags.length === 0 || club.tag.some((t) => selectedTags.includes(t)))
  );

  return (
    <div className="max-w-4xl mx-auto p-4 mt-24 ">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold mb-4">Club list</h1>

        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="text-gray-500" size={20} />
          </div>
          <input
            type="text"
            placeholder="Enter Club Name"
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
            className="text-center relative bg-white p-4 rounded-lg shadow-lg"
          >
            <div className="absolute top-2 right-2">
              <Info 
                size={24} 
                className="cursor-pointer text-white fill-[#7CE9BF] "
                onMouseEnter={() => setHoveredClub(index)}
                onMouseLeave={() => setHoveredClub(null)}
              />
            </div>
            <img src={club.image} alt={club.name} className="w-32 h-32 mx-auto rounded-full" />
            <p className={`mt-2 font-medium ${club.name.length > 20 ? "text-sm" : "text-lg"}`}>{club.name}</p>
            <button className="w-full mt-4 bg-[#FF7E69] hover:bg-[#d66857] duration-300 text-white px-4 py-2 rounded-lg">
              รายละเอียด
            </button>

            {hoveredClub === index && (
              <div className="absolute top-0 left-0 transform translate-x-2/3 bg-gray-50 shadow-lg p-4 rounded-lg w-96 text-black z-10">
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
                  <p className="text-sm mt-4">ประธานชมรม: {club.president}</p>
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
