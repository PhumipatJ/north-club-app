import React from "react";

const details = [
    {name: "KMUTNB Esport", image: "/assets/esport.png", description: "เพราะความท้าทายไม่ได้มีแค่ในสนามกีฬาเท่านั้น", members: 46, founded: "1/1/2020", president: "นายเชิดชู ชาบูเชิด"}
];

const Club = () => {
    const club = details[0];
  return (
    <div className="flex flex-col items-center bg-white p-6 max-w-5xl w-full">
      {/* Banner Section */}
      <div className="w-full h-50 bg-[#FF7E69] rounded-lg relative flex justify-center items-center">
        <img src={club.image} alt={club.name} className="relative translate-y-2/3  w-32 h-32 rounded-full border-4 border-[#7CE9BF]" />
      </div>

      {/* Club Info */}
        <div className="flex flex-row max-w-sm w-full items-center justify-between ml-8">
            <div className="text-center mt-4">
                <p className="text-sm">Members : {club.members}</p>
            </div>
            <div className="text-center mt-4">
                <p className="text-sm">Created : {club.founded}</p>
            </div>
        </div>

      <div className="text-center mt-8">
        <h1 className="text-2xl font-bold mt-2">{club.name}</h1>
        <button className="mt-4 bg-[#7CE9BF] px-4 py-2 rounded-lg shadow-md font-bold">Join Club</button>
      </div>

      {/* Members Section */}
      <h2 className="text-xl text-left  font-bold mt-8">Member</h2>
      <div className="flex space-x-4 mt-4">
        {[
          { name: "น.ส.รสิน ภาสิศ", role: "ประธานชมรม" },
          { name: "นายกรี๊ เครื่องงาม", role: "รองประธานชมรม" },
          { name: "น.ส.วิสนุ ฟุงไกล", role: "caster" },
          { name: "น.ส.สมศรี เหินฟ้า", role: "สมาชิกชมรม" },
        ].map((member, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                <p className="text-sm font-bold mt-2">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
          </div>
        ))}

            <div className="w-32 h-32 bg-[#7CE9BF] rounded-full"></div>
      </div>

      {/* Event Calendar */}
      
    </div>
  );
};

export default Club;
