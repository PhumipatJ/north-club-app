import { useState } from "react";
import { Filter, Search } from "lucide-react";

const clubs = [
  { name: "KMUTNB Esport", image: "/assets/esport.png", description: "เพราะความท้าทายไม่ได้มีแค่ในสนามกีฬาเท่านั้น", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด" },
  { name: "KMUTNB Boxing Club", image: "/assets/boxing.png", description: "ชมรมมวยสากลสมัครเล่น", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "KMUTNB Photo Club", image: "/assets/photo.png", description: "ชมรมถ่ายภาพและสื่อสร้างสรรค์", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "ชมรมชีวิตและสุขภาพ", image: "/assets/health.png", description: "ชมรมส่งเสริมสุขภาพและคุณภาพชีวิต", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "ชมรมเทควันโดพระจอมเกล้าพระนครเหนือ", image: "/assets/taekwondo.png", description: "ชมรมกีฬาการต่อสู้เทควันโด", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "Esan Club KMUTNB", image: "/assets/esan.png", description: "ชมรมวัฒนธรรมอีสาน", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "ชมรมดนตรีไทย บางอุดม", image: "/assets/thaimusic.png", description: "ชมรมอนุรักษ์และส่งเสริมดนตรีไทย", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "KMUTNB Running", image: "/assets/running.png", description: "ชมรมวิ่งเพื่อสุขภาพ", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "ชมรมชาวเหนือ", image: "/assets/north.png", description: "ชมรมแลกเปลี่ยนวัฒนธรรมภาคเหนือ", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "KMUTNB Shooting Club", image: "/assets/shooting.png", description: "ชมรมกีฬายิงปืน", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "KMUTNB Cycling Club", image: "/assets/cycling.png", description: "ชมรมจักรยาน KMUTNB", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
  { name: "KMUTNB Media Club", image: "/assets/media.png", description: "ชมรมสื่อสารมวลชนและวิดีโอโปรดักชั่น", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"  },
];

const Clublist = () => {
  const [search, setSearch] = useState("");
  const [hoveredClub, setHoveredClub] = useState(null);

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 mt-24">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-4xl font-bold mb-4">Club list</h1>
        <div className="relative mb-6">
          {/* Search bar */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Filter className="text-gray-500" size={20} />
          </div>
          <input
            type="text"
            placeholder="Enter Club Name"
            className="w-full border rounded-lg p-2 pl-10 focus:ring-2 focus:ring-[#FF7E69] pl-10 
                      border-none outline-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-[#333] h-10 rounded-[20px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <Search className="text-gray-500" size={20} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-6">
        {filteredClubs.map((club, index) => (
          <div
            key={index}
            className="text-center relative"
            onMouseEnter={() => setHoveredClub(index)}
            onMouseLeave={() => setHoveredClub(null)}
          >
            {/* Clubs */}
            <img src={club.image} alt={club.name} className="w-32 h-32 mx-auto rounded-full" />
            <p className="mt-2 text-lg font-medium">{club.name}</p>

            {/* Hover Card */}
            {hoveredClub === index && (
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-4 rounded-lg w-96 text-black z-10
                              transition-opacity duration-200 opacity-0 hover:opacity-100">
                
                <div className="flex flex-col">
                  <div> 
                    <h3 className="font-bold text-xl">{club.name}</h3>
                  </div>
                    
                  <div className="flex flex-row items-center gap-8">
                    <div className="p-4">
                      <img src={club.image} alt={club.name} className="w-16 h-16 mx-auto rounded-full" />
                    </div>
                    <div className="pr-4">
                      <p className="text-sm italic font-bold">{club.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                      <div className="items-start text-left">
                        {club.members && <p className="text-sm">สมาชิก: {club.members} คน</p>}
                        </div>
                      <div className="items-start text-left"> 
                        {club.founded && <p className="text-sm">วันก่อตั้ง: {club.founded}</p>}
                      </div>
                    </div>
                    
                    <div className="items-center">
                      {club.president && <p className="text-sm">ประธานชมรม: {club.president}</p>}
                    </div>
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
