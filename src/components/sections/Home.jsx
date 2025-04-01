import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import Calendar from "../Calendar";
import supabase from "../../../supabaseClient";
import Loading from "../loading";
import dayjs from "dayjs";
const Home = () => {
  const navigate = useNavigate();
  const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
  const [carouselEventImg, setEventimg] = useState([]);
  const [loading, setLoading] = useState(true);
  const [EventList, setEventlist] = useState();
  const [currentSlide, setCurrent] = useState(0);
  const dotShapes = ["triangle", "square", "circle"];
  const loadedImages = useRef([]);
  const [allLoaded, setAllLoaded] = useState(false);
  const [day, setDay] = useState([]);
  const [allEvent,setAllevnt] = useState([]);
  const getDotShapeClass = (shape) => {
    switch (shape) {
      case "triangle":
        return "rounded-br-[3px] rounded-bl-[3px] rounded-tr-[10px] rounded-tl-[10px]";
      case "square":
        return "rounded-[2px]";
      case "circle":
        return "rounded-full";
      default:
        return "bg-black";
    }
  };
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const NextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="bg-gradient-to-r from-transparent to-black/20 absolute right-0 top-1/2 z-10 flex h-[98.75%] -mt-1 w-10 -translate-y-1/2 items-center justify-center text-white hover:to-black/30 cursor-pointer"
    >
      ❯
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      className="bg-gradient-to-l from-transparent to-black/20 absolute left-0 top-1/2 z-10 flex h-[98.75%] -mt-1 w-10 -translate-y-1/2 items-center justify-center text-white hover:to-black/30 cursor-pointer"
    >
      ❮
    </div>
  );
  const carouselSettings = {
    dots: true,
    customPaging: (i) => {
      const shape = dotShapes[i % dotShapes.length];
      return (
        <div
          className={`w-2 h-2 ${
            i === currentSlide ? "bg-[#7CE9BF]" : "bg-[#FF7E69]"
          } ${getDotShapeClass(shape)} hover:bg-[#7CE9BF] mt-[5px]`}
        ></div>
      );
    },
    afterChange: (i) => setCurrent(i),
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  async function sendEmail() {
    const SUPABASE_URL =
      "https://jemnlthnuwwxtumrdili.supabase.co/functions/v1/hello-world";
    const SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbW5sdGhudXd3eHR1bXJkaWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNzkzMTUsImV4cCI6MjA1NDk1NTMxNX0.LXIxRSc59MnKtZ-II9XLbW0DshX1EXBN9Ex9Fc1xT8E";

    const response = await fetch(`${SUPABASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        to: "shotapoi1412@gmail.com",
        subject: "ทดสอบส่งอีเมลผ่าน Gmail API",
        html: "<h1>ทดสอบ</h1><p>นี่คือการทดสอบส่งอีเมลผ่าน Gmail API จาก Supabase Edge Function</p>",
      }),
    });

    const data = await response.json();
    console.log(data);
  }
  useEffect(() => {
    let componentsload = 0;
    const fetchEventimg = async () => {
      const { data: Eventlist, error: eError } = await supabase
        .from("event")
        .select("poster")
        .order("created_at", { ascending: false }) // หรือใช้ "id" ถ้าไม่มี created_at
        .eq("approval_status", true)
        .limit(9);
      if (eError) {
        console.error(eError);
      } else {
        const eventImgUrls = Eventlist.map((item) => {
          const { publicUrl } = supabase.storage
            .from("club-avatars")
            .getPublicUrl(item.poster).data;
          return publicUrl;
        });
        //console.log(eventImgUrls);
        setEventimg(eventImgUrls); // set URL ของรูปภาพเข้า state
        componentsload++;
      }
    };
    const fetchEventlist = async () => {
        const today = new Date();
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(today.getDate() + 64);
    
        const { data: Eventlist, error: elError } = await supabase
          .from("event")
          .select("*, clubs ( club_avatar ,club_name)")
          .order("created_at", { ascending: true });
    
        if (elError) {
          console.error("Error fetching events:", elError);
          return;
        }
        else{
          setAllevnt(Eventlist);
            //console.log(Eventlist);
            const upcomingEvents = Eventlist
            .map(event => {
              const [dd, mm, yyyy] = event.start_date.split("/");
              const eventDate = new Date(`${yyyy}-${mm}-${dd}`);
              return { ...event, eventDate };
            })
            .filter(event =>
              event.eventDate >= today &&
              event.eventDate <= twoWeeksLater
            );
          //console.log(upcomingEvents);
          setEventlist(upcomingEvents);
        }
        
      };
    fetchEventimg();
    fetchEventlist();
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  const formatDateThai = (dateStr) => {
    const [dd, mm, yyyy] = dateStr.split("/");

    const monthNames = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    // ลบเลข 0 ข้างหน้า ถ้ามี เช่น "01" → 1
    const day = parseInt(dd, 10);
    const monthIndex = parseInt(mm, 10) - 1;

    return `${day} ${monthNames[monthIndex]} ${yyyy}`;
  };
  useEffect(() => {
    const preloadImages = async () => {
      const promises = carouselEventImg.map((src, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve({ src, index });
          img.onerror = () => resolve({ src: null, index }); // กัน error
          //console.log(src);
        });
      });

      const results = await Promise.all(promises);
      loadedImages.current = results
        .filter((img) => img.src !== null)
        .map((img) => img.src);
      setTimeout(() => {
        setAllLoaded(true);
      }, 1000);
    };

    preloadImages();
  }, [carouselEventImg]);
  const handleDayselect = (value) =>{
    const dayweek = ['อาทิตย์','จันทร์','อังคาร','พุธ','พฤหัสบดี','ศุกร์','เสาร์']
    const thisday = dayweek.indexOf(value[3]);
    const startdate = new Date(value[2], value[1] - 1, value[0]);
    const newDays = [];
    let currentDate = new Date(startdate);
    for(let i =0;i<5;i++){
        const dayOfWeek = currentDate.getDay();
        const dayText = dayweek[dayOfWeek];
        //console.log(dayText,dayOfWeek);
        //console.log(i,currentDate.getDay(),currentDate.getMonth()+1,currentDate.getFullYear(),dayText)
        newDays.push({
            day:currentDate.getDate(),
            month:currentDate.getMonth()+1,
            year:currentDate.getFullYear(),
            daytext:dayText,
        })
        currentDate.setDate(currentDate.getDate()+1);
    }
    setDay(newDays);
  }
  if (loading || !allLoaded) {
    return (
      <>
        <Loading />
        <div className="h-[100vh]"></div>
      </>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 bg-white font-prompt scroll-smooth">
      {/* Header Text */}
      <div className="pt-8 text-center md:text-right">
        <h2 className="text-lg font-semibold text-gray-600">
          More Creativity Better Community
        </h2>
        <h1 className="text-5xl md:text-8xl font-bold text-[#7CE9BF] mb-6">
          NORTH’S CLUB
        </h1>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-4 md:px-0">
        {/* Left Section */}
        <div className="text-center md:text-left max-w-xs mb-0 md:mb-32 pl-8">
          <h3 className="text-xl font-bold text-gray-800">สำรวจกิจกรรม!</h3>
          <p className="text-xl text-gray-600">
            ติดตามทุกกิจกรรม รอบรั้วมหาลัย
          </p>
          <a
            href="#section1"
            className="mt-4 inline-block bg-[#FF7E69] text-white py-2 px-4 rounded-lg shadow-md hover:shadow-[0px_0px_5px_2px_#FF7E697D] transition-shadow ease-in-out duration-200"
          >
            ตารางกิจกรรม
          </a>
        </div>

        {/* Illustration */}
        <div className="relative flex justify-center items-end w-64 h-64 md:w-120 md:h-96 pb-5">
          <div className="absolute w-60 h-60 md:w-84 md:h-84 bg-[#FF7E69] rounded-full"></div>
          <img
            src="/assets/Group.svg"
            alt="Illustration"
            className="relative w-64 md:w-[140%] -mb-7"
          />
        </div>

        {/* Right Section */}
        <div className="text-center md:text-right max-w-xs mt-0 md:mt-32 pr-8">
          <h3 className="text-xl font-bold text-gray-800" onClick={sendEmail}>
            ชมรมไหนเจ๋ง!
          </h3>
          <p className="text-xl text-gray-600">
            จะแนววิชาการ กีฬาหรือ <br />
            ความคิดสร้างสรรค์ก็มีหมด
          </p>
          <a
            onClick={() => navigate("/clubs")}
            className="mt-4 inline-block bg-[#FF7E69] text-white py-2 px-4 rounded-lg cursor-pointer shadow-md hover:shadow-[0px_0px_5px_2px_#FF7E697D] transition-shadow ease-in-out duration-200"
          >
            รายชื่อชมรม
          </a>
        </div>
      </div>

      <div className="pt-16 text-center ">
        <h1 className="text-3xl md:text-4xl font-semibold ">กิจกรรมสุดเจ๋ง</h1>
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-600">
          ทุกกิจกรรมสร้างสรรค์ล่าสุด รอบรั้วมหาลัย
        </h2>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl md:px-0 mt-16 ">
        {/*Background Character*/}
        <img
          src="/assets/Astro.svg"
          alt="Astro"
          className="absolute w-120 h-120 -left-20 md:top-200"
        />

        {/*Vertical Text*/}
        <div className="max-w-md md:max-w-none w-full md:w-auto mb-4 md:mb-0 px-4 md:h-[100%]">
          {" "}
          {/* Added responsive width and margin */}
          <h1 className="text-3xl text-[#FF7E69] px-2 md:px-0 text-center text-[25px] font-bold md:text-left">
            {" "}
            {/* Centered text on smaller screens */}
            <span className="inline md:block text-center">กิ</span>
            <span className="inline md:block text-center">จ</span>
            <span className="inline md:block text-center">ก</span>
            <span className="inline md:block text-center">ร</span>
            <span className="inline md:block text-center">ร</span>
            <span className="inline md:block text-center">ม</span>
            <span className="inline md:block text-center">ล่</span>
            <span className="inline md:block text-center">า</span>
            <span className="inline md:block text-center">สุ</span>
            <span className="inline md:block text-center">ด</span>
          </h1>
        </div>

        {/* Left: Carousel */}
        <div className="max-w-xs md:max-w-2xs mr-0 md:mr-16 ">
          <Slider {...carouselSettings}>
            {loadedImages?.current.map((img, index) => (
              <div key={index} className="flex justify-center">
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="w-80 h-100 rounded-lg shadow-md aspect-[4/5]"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Right: "Today's Activity" Section */}
        <div ref={sectionRef} className="w-full mt-10 md:mt-0 ">
          
          <h2 className="text-2xl font-bold text-[#FF7E69]">
            กิจกรรมที่จะมาถึงใน 2 อาทิตย์
          </h2>
          <div className="rounded-lg text-[14px]">
            <table className="w-full text-left border-collapse  rounded-xl">
              <thead>
                <tr className="text-center text-[#7CE9BF]">
                  <th className="p-2">ชมรม</th>
                  <th className="p-2">กิจกรรม</th>
                  <th className="p-2">วันที่จัด</th>
                  <th className="p-2">เวลา</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {EventList?.sort((a, b) => {
                  const [ddA, mmA, yyyyA] = a.start_date.split("/");
                  const eventDateA = new Date(`${yyyyA}-${mmA}-${ddA}`);

                  const [ddB, mmB, yyyyB] = b.start_date.split("/");
                  const eventDateB = new Date(`${yyyyB}-${mmB}-${ddB}`);

                  return eventDateA - eventDateB; // เรียงจากวันที่ใกล้สุดไปไกลสุด
                })
                  .slice(0, 7)
                  .map((item, index) => (
                    <tr key={index} className="hover:bg-[#FF7E69] duration-300">
                      <td className="p-2 justify-center flex select-none">
                        <img
                          src={
                            supabase.storage
                              .from("club-avatars")
                              .getPublicUrl(item.clubs?.club_avatar || "").data
                              .publicUrl
                          }
                          alt=""
                          className="w-7 rounded-full"
                        />
                      </td>
                      <td className="p-2 text-center select-none">
                        {item.title}
                      </td>
                      <td className="p-2 text-center select-none">
                        {formatDateThai(item.start_date)}
                      </td>
                      <td className="p-2 text-center select-none">
                        {item.start_time} - {item.end_time}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-10 w-full px-20 flex flex-col  h-fit">
      <img
          src="/assets/Pacheco.svg"
          alt="Astro"
          className="absolute w-120 h-120 right-[16vw]"
        />
        <h2 className="text-3xl font-bold text-[#7CE9BF] mb-1 w-full text-center">
          ปฎิทินกิจกรรม
        </h2>
        <div className="flex">
          <Calendar daySelect={handleDayselect}></Calendar>
          <div className="w-full flex flex-wrap mt-10">
            {day.map((item, index1) => (
              <div key={index1} className="w-[20%]  ">
                <div className="border-b-2 pb-5 border-[#FF7E69] text-center">
                  <h1 className="font-[600] text-[15px] text-[#FF7E69]">
                    {item.day}/{item.month}
                  </h1>
                  <h1 className="font-semibold text-[18px] text-[#FF7E69]">
                    {item.daytext}
                  </h1>
                </div>
                <div>
                  <div>
                    {allEvent.filter((item2) => {
                    if (!item2.start_date || !item.year || !item.month || !item.day) return false;
                      const [ddB, mmB, yyyyB] = item2.start_date.split("/");
                      const eventDateB = dayjs(`${yyyyB}-${mmB}-${ddB}`);
                      const cur = dayjs(
                        `${item.year}-${item.month}-${item.day}`
                      );
                      return (
                        eventDateB.isSame(cur, "day")
                      );
                    }).map((itm, index) => (
                      <div className="border-2 border-[#7CE9BF] rounded-[5px] mt-2 mx-1 text-[10px] p-2 " key={index}>
                        <h1 className="text-[11px] font-bold text-[#FF7E69]">{itm?.title}</h1>
                        <div className="flex text-[10px]">
                          <p className="mr-1 font-semibold text-[#FF7E69]">สถานที่:</p>
                          <p className="w-27">{itm.status === 'Online'?'Online':itm?.location}</p>
                        </div>
                        <div className="flex text-[10px]">
                          <p className="text-[10px] mr-1 font-semibold text-[#FF7E69]">เวลา:</p>{itm?.start_time} - {itm?.end_time} น.
                        </div>
                        <p className="font-semibold">{itm?.clubs?.club_name??"ไม่ระบุ"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
