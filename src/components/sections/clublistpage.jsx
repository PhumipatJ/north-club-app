import { useState } from "react";
import { Filter,Search } from "lucide-react";

const clubs = [
  { name: "KMUTNB Esport", image: "/assets/esport.png" },
  { name: "KMUTNB Boxing Club", image: "/assets/boxing.png" },
  { name: "KMUTNB Photo Club", image: "/assets/photo.png" },
  { name: "ชมรมชีวิตและสุขภาพ", image: "/assets/health.png" },
  { name: "ชมรมเทควันโดพระจอมเกล้าพระนครเหนือ", image: "/assets/taekwondo.png" },
  { name: "Esan Club KMUTNB", image: "/assets/esan.png" },
  { name: "ชมรมดนตรีไทย บางอุดม", image: "/assets/thaimusic.png" },
  { name: "KMUTNB Running", image: "/assets/running.png" },
  { name: "ชมรมชาวเหนือ", image: "/assets/north.png" },
  { name: "KMUTNB Shooting Club", image: "/assets/shooting.png" },
  { name: "KMUTNB Cycling Club", image: "/assets/cycling.png" },
  { name: "KMUTNB Media Club", image: "/assets/media.png" },
];

const ClubList = () =>{
  const [search, setSearch] = useState("");

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 mt-24">
      <div className="flex flex-row items-center justify-between">
      <h1 className="text-4xl font-bold mb-4">Club list</h1>
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Filter className="text-gray-500" size={20} />
        </div>
        <input
          type="text"
          placeholder="Enter Club Name"
          className="w-full border rounded-lg p-2 pl-10 focus:ring-2 focus:ring-[#FF7E69]
                     pl-10 border-none outline-none shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                     text-[#333] h-10 rounded-[20px]"
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
          <div key={index} className="text-center">
            <img src={club.image} alt={club.name} className="w-32 h-32 mx-auto rounded-full" />
            <p className="mt-2 text-lg font-medium">{club.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClubList;