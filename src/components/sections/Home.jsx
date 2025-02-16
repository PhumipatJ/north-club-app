import React from 'react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 bg-white">
            {/* Header Text */}
            <div className="pt-8">
                <h2 className="text-lg text-right font-semibold text-gray-600 ">More creativity Better Community</h2>
                <h1 className="text-8xl font-bold text-[#7CE9BF] mb-6">NORTH’S CLUB</h1>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                {/* Left Section */}
                <div className="text-center md:text-left max-w-xs">
                    <h3 className="text-lg font-bold text-gray-800">สำรวจกิจกรรม!</h3>
                    <p className="text-gray-600">ติดตามทุกกิจกรรม รอบร่วมทำเลย</p>
                    <a href="#" className="mt-4 inline-block bg-red-400 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-500">ตารางกิจกรรม</a>
                </div>
                
                {/* Illustration */}
                <img src="src/assets/Group.svg" alt="Illustration" className="w-80 h-auto" />
                
                {/* Right Section */}
                <div className="text-center md:text-left max-w-xs">
                    <h3 className="text-lg font-bold text-gray-800">ชมรมไหนเจ๋ง!</h3>
                    <p className="text-gray-600">ชวนเพื่อนมาร่วมกิจกรรม กีฬาหรือความคิดสร้างสรรค์ก็มีหมด</p>
                    <a href="#" className="mt-4 inline-block bg-red-400 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-500">รายชื่อชมรม</a>
                </div>
            </div>
        </div>
    );
};

export default Home;