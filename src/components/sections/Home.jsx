import React from 'react';
import Slider from 'react-slick'; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {

    const carouselImages = [
        "/assets/image 30.webp",
        "/assets/image 31.webp",
        "/assets/image 32.webp",
        "/assets/image 33.webp",
        "/assets/image 34.webp"
    ];

    const carouselSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 bg-white font-prompt">
            {/* Header Text */}
            <div className="pt-8 text-center md:text-right">
                <h2 className="text-lg font-semibold text-gray-600">More creativity Better Community</h2>
                <h1 className="text-5xl md:text-8xl font-bold text-[#7CE9BF] mb-6">NORTH’S CLUB</h1>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-4 md:px-0">
                {/* Left Section */}
                <div className="text-center md:text-left max-w-xs mb-0 md:mb-32 pl-8">
                    <h3 className="text-xl font-bold text-gray-800">สำรวจกิจกรรม!</h3>
                    <p className="text-xl text-gray-600">ติดตามทุกกิจกรรม รอบรั้วมหาลัย</p>
                    <a href="#" className="mt-4 inline-block bg-[#FF7E69] text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-500">ตารางกิจกรรม</a>
                </div>
                
                {/* Illustration */}
                <div className="relative flex justify-center items-center w-64 h-64 md:w-96 md:h-96 my-8 md:my-0 pr-8">
                    <div className="absolute w-60 h-60 md:w-84 md:h-84 bg-[#FF7E69] rounded-full"></div>
                    <img src="/assets/Group.svg" alt="Illustration" className="relative w-64 md:w-96 h-auto" />
                </div>
                
                {/* Right Section */}
                <div className="text-center md:text-right max-w-xs mt-0 md:mt-32 pr-8">
                    <h3 className="text-xl font-bold text-gray-800">ชมรมไหนเจ๋ง!</h3>
                    <p className="text-xl text-gray-600">จะแนววิชาการ กีฬาหรือ <br/>ความคิดสร้างสรรค์ก็มีหมด</p>
                    <a href="#" className="mt-4 inline-block bg-[#FF7E69] text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-500">รายชื่อชมรม</a>
                </div>
            </div>

            <div className="pt-16 text-center ">
                <h1 className="text-3xl md:text-4xl font-semibold ">กิจกรรมสุดเจ๋ง</h1>
                <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-600">ทุกกิจกรรมสร้างสรรค์ล่าสุด รอบรั้วมหาลัย</h2>
            </div>

            {/* Main Content Section */}
            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl px-4 md:px-0 mt-16">
                {/*Background Character*/}
                <img src="/assets/Astro.svg" alt="Astro" className=" absolute w-200 h-200 -left-32" />

                {/*Vertical Text*/} 
                <div className="max-w-md md:max-w-none w-full md:w-auto mb-4 md:mb-0 px-4"> {/* Added responsive width and margin */}
                    <h1 className="text-3xl text-[#FF7E69] px-2 md:px-0 text-center font-bold md:text-left"> {/* Centered text on smaller screens */}
                        <span className="inline md:block">กิ</span>
                        <span className="inline md:block">จ</span>
                        <span className="inline md:block">ก</span>
                        <span className="inline md:block">ร</span>
                        <span className="inline md:block">ร</span>
                        <span className="inline md:block">ม</span>
                        <span className="inline md:block">ล่</span>
                        <span className="inline md:block">า</span>
                        <span className="inline md:block">สุ</span>
                        <span className="inline md:block">ด</span>
                    </h1>
                </div>

                {/* Left: Carousel */}
                <div className="max-w-xs md:max-w-2xs mr-0 md:mr-16">
                    <Slider {...carouselSettings}>
                        {carouselImages.map((img, index) => (
                            <div key={index} className="flex justify-center">
                                <img src={img} alt={`Slide ${index + 1}`} className="w-80 h-100 rounded-lg shadow-md " />
                            </div>
                        ))}
                    </Slider>
                </div>

                {/* Right: "Today's Activity" Section */}
                <div className="w-full md:w-1/2 mt-10 md:mt-0">
                    <h2 className="text-2xl font-bold text-[#FF7E69] mb-4">Today's Activity</h2>
                    <div className="rounded-lg p-4">
                        <table className="w-full text-left border-collapse shadow-lg rounded-xl">
                            <thead>
                                <tr className="text-center text-[#FF7E69]">
                                    <th className="p-2">ชมรม</th>
                                    <th className="p-2">กิจกรรม</th>
                                    <th className="p-2">วันที่จัด</th>
                                    <th className="p-2">เวลา</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {[...Array(7)].map((_, index) => (
                                    <tr key={index} className="hover:bg-[#FF7E69] duration-300">
                                        <td className="p-2">🏆</td>
                                        <td className="p-2">ประกวดเทพาสวนปาล์ม</td>
                                        <td className="p-2">2 กุมภาพันธ์ 2025</td>
                                        <td className="p-2">16:00 - 18:00 น.</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
