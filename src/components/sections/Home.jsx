import React from 'react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 bg-white font-prompt">
            {/* Header Text */}
            <div className="pt-8">
                <h2 className="text-lg text-right font-semibold text-gray-600 ">More creativity Better Community</h2>
                <h1 className="text-8xl font-bold text-[#7CE9BF] mb-6">NORTH’S CLUB</h1>
            </div>
            
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="text-center text-lg md:text-left max-w-3xs">
                    <h3 className="text-lg font-bold text-gray-800">สำรวจกิจกรรม!</h3>
                    <p className="text-gray-600">ติดตามทุกกิจกรรม รอบรั้วมหาลัย</p>
                    <a href="#" className="mt-4 inline-block bg-[#FF7E69] text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-500">ตารางกิจกรรม</a>
                </div>
                
                {/* Illustration */}
                <div className="relative flex justify-center items-center w-96 h-96">
                    <div className="absolute w-72 h-72 bg-[#FF7E69] rounded-full"></div>
                    <img src="src/assets/Group.svg" alt="Illustration" className="relative w-80 h-auto" />
                </div>
                
                {/* Right Section */}
                <div className="text-center text-lg md:text-right max-w-3xs">
                    <h3 className="text-lg font-bold text-gray-800">ชมรมไหนเจ๋ง!</h3>
                    <p className="text-gray-600">จะแนววิชาการ กีฬาหรือความคิดสร้างสรรค์ก็มีหมด</p>
                    <a href="#" className="mt-4 inline-block bg-[#FF7E69] text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-500">รายชื่อชมรม</a>
                </div>
            </div>
        </div>
    );
};

export default Home;