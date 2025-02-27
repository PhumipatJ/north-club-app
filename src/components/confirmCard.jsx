import { useState } from "react";

const ConfirmCard = ({ isOpen, onClose, type, onConfirm  }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleConfirm = () => {
    setIsSubmitted(true);
    if (onConfirm) {
      onConfirm();
    }
  };
    const getTitle = () => {
    switch (type) {
        case "login":
            return "กรุณาเข้าสู่ระบบ?";
        case "logout":
            return "ออกจากระบบ?";
        case "createClub":
            return "ยืนยันการส่งคำขอ?";
        case "event":
            return "ยืนยันการสร้าง";
        case "profile":
            return "ยืนยันการเปลี่ยน?";
        default:
            return "ตรวจสอบอีกครั้ง";
        }
    };

    const getConfirm = () => {
        switch (type) {
            case "login":
                return "เข้าสู่ระบบ";
            case "logout":
                return "ออกจากระบบ";
            case "createClub":
                return "ส่งคำขอ";
            default:
                return "ยืนยัน";
        }
    };

    const getCancel = () => {
        switch (type) {
            case "createClub":
                return "ตรวจเช็คอีกครั้ง";
            default:
                return "ยกเลิก";
        }
    };

    const getDescription = () => {
        switch (type) {
            case "login":
                return "กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ";
            case "logout":
                return " ";
            default:
                return "กรุณาตรวจเช็คข้อมูลให้ครบถ้วนก่อนยืนยัน";
        }
    };

    const getConfirmedTitle = () => {
        switch (type) {
            case "createClub":
                return "ส่งคำขอเรียบร้อย";
            case "profile":
                return "ตั้งค่าเรียบร้อย";
            default:
                return "เรียบร้อย";
        }
    };

    const getConfirmedDeescription = () => {
        switch (type) {
            case "createClub":
                return "รอการตอบกลับทางอีเมลได้เลย!";
            default:
                return " ";
        }
    };

  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25">
      <div className="max-w-lg w-full rounded-xl shadow-lg bg-white">
        {isSubmitted ? (
          <div className="flex flex-row text-center bg-white items-center rounded-lg overflow-hidden">
            <img
              src="/assets/Comfirmed.svg"
              alt="Illustration"
              className="flex w-2/5 translate-y-5 object-cover"
            />
            <div>
                <h2 className="text-3xl font-bold text-[#7CE9BF] mb-3">{getConfirmedTitle()}</h2>
                <p className="text-gray-600">{getConfirmedDeescription()}</p>
                <button
                    className="mt-4 bg-[#FF7E69] hover:bg-[#FF5135] text-white px-6 py-2 rounded-md"
                    onClick={onClose}
                >
                    ตกลง
                </button>
            </div>
        </div>        
        ) : (
          <div className="flex flex-row text-center bg-white items-center rounded-lg overflow-hidden">
            <img
              src="/assets/Confirmcard.svg"
              alt="Illustration"
              className="flex w-2/5 object-cover"
            />
            <div>
            <h2 className="text-2xl font-bold text-[#FF5135] mb-3">{getTitle()}</h2>
            <p className="text-gray-600 mb-4">{getDescription()}</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 border rounded-md hover:bg-gray-200"
                onClick={onClose}
              >
                {getCancel()}
              </button>
              <button
                className="px-6 py-2 bg-[#7CE9BF] hover:bg-emerald-400 rounded-md"
                onClick={handleConfirm}
              >
                {getConfirm()}
              </button>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfirmCard;