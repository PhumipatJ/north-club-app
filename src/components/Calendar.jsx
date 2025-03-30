import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";

const Calendar = ({daySelect}) => {
  const today = dayjs();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today.date());

  const daysInMonth = currentDate.daysInMonth();
  const startDay = currentDate.startOf("month").day();
  const prevMonthDays = currentDate.subtract(1, "month").daysInMonth();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const nextMonthDays = 42 - (startDay + daysInMonth);

  const handleMonthChange = (increment) => {
    setCurrentDate(currentDate.add(increment, "month"));
  };
  useEffect(()=>{
    daySelect(`${selectedDay}/${selectedMonth}/${selectedYear}`);
  },[selectedDate])
  const selectedFullDate = currentDate.date(selectedDate);
  const selectedDay = selectedFullDate.date(); // Day of the month
  const selectedMonth = selectedFullDate.month() + 1; // Month (0-based, so add 1)
  const selectedYear = selectedFullDate.year(); // Year

  // console.log(selectedDay);
  // console.log(selectedMonth);
  // console.log(selectedYear);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-4 scale-80 min-h-[430px]">
      <div className="flex justify-between items-center mb-4">
        <ChevronLeft onClick={() => handleMonthChange(-1)} className="text-lg font-bold cursor-pointer" />
        <h2 className="text-xl font-semibold text-center text-gray-900">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <ChevronRight onClick={() => handleMonthChange(1)} className="text-lg font-bold cursor-pointer"/>
      </div>
      <p className="text-center text-sm text-gray-400">Today: {today.format("DD MMMM YYYY")}</p>
      <div className="grid grid-cols-7 gap-2 mt-4 text-center text-gray-600">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} className="font-semibold">{day}</div>
        ))}
        {[...Array(startDay)].map((_, i) => (
          <div key={"prev-" + i} className="text-gray-400 pt-2 select-none">
            {prevMonthDays - startDay + i + 1}
          </div>
        ))}
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDate(day)}
            className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition ${
              selectedDate === day  ? "bg-[#FF7E69] text-white" : "hover:bg-gray-200"
            } ${today.isSame(currentDate, "month") && today.date() === day ? "border-2 border-[#7CE9BF]" : ""}`}
          >
            {day}
          </button>
        ))}
        {[...Array(nextMonthDays)].map((_, i) => (
          <div key={"next-" + i} className="text-gray-400 pr-2 pt-2 select-none">{i + 1}</div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
