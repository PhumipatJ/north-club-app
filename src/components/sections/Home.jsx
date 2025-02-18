import React from 'react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 bg-white font-prompt">
            {/* Header Text */}
            <div className="pt-8 text-center md:text-right">
                <h2 className="text-lg font-semibold text-gray-600">More creativity Better Community</h2>
                <h1 className="text-5xl md:text-8xl font-bold text-[#7CE9BF] mb-6">NORTH’S CLUB</h1>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-4 md:px-0">
                {/* Left Section */}
                <div className="text-center md:text-left max-w-xs mb-0 md:mb-32">
                    <h3 className="text-xl font-bold text-gray-800">สำรวจกิจกรรม!</h3>
                    <p className="text-xl text-gray-600">ติดตามทุกกิจกรรม รอบรั้วมหาลัย</p>
                    <a href="#" className="mt-4 inline-block bg-[#FF7E69] text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-500">ตารางกิจกรรม</a>
                </div>
                
                {/* Illustration */}
                <div className="relative flex justify-center items-center w-64 h-64 md:w-96 md:h-96 my-8 md:my-0">
                    <div className="absolute w-60 h-60 md:w-84 md:h-84 bg-[#FF7E69] rounded-full"></div>
                    <img src="src/assets/Group.svg" alt="Illustration" className="relative w-64 md:w-96 h-auto" />
                </div>
                
                {/* Right Section */}
                <div className="text-center md:text-right max-w-xs mt-0 md:mt-32">
                    <h3 className="text-xl font-bold text-gray-800">ชมรมไหนเจ๋ง!</h3>
                    <p className="text-xl text-gray-600">จะแนววิชาการ กีฬาหรือ <br/>ความคิดสร้างสรรค์ก็มีหมด</p>
                    <a href="#" className="mt-4 inline-block bg-[#FF7E69] text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-500">รายชื่อชมรม</a>
                </div>
            </div>
        </div>
    );
};

export default Home;
