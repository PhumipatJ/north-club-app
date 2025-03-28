import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConfirmCardConfig } from "./confirmCardConfig";

const ConfirmCard = ({ isOpen, onClose, type, onConfirm, text, onSecondConfirm }) => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const config = getConfirmCardConfig(type);

  useEffect(() => {
    setIsSubmitted(false);
  }, [type]);

  const handleConfirm = () => {
    if (type === "login") {
      navigate("/login");
    } else {
      setIsSubmitted(true);
      onConfirm && onConfirm();
    }
  };

  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-99">
      <div className="max-w-lg w-full rounded-xl shadow-lg bg-white">
        {isSubmitted ? (
          <div className="flex flex-row text-center bg-white items-center rounded-lg overflow-hidden">
            <img 
              src="/assets/Comfirmed.svg" 
              alt="Illustration" 
              className="flex w-2/5 object-cover" />
            <div className="flexbox pl-15">
              <h2 className="text-3xl font-bold text-[#7CE9BF] mb-3">{config.confirmedTitle}</h2>
              <p className="text-gray-600">{config.confirmedDescription}</p>
              <button
                className="mt-4 bg-[#FF7E69] hover:bg-[#FF5135] text-white px-6 py-2 rounded-md"
                onClick={onSecondConfirm || onClose}
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
              className="flex w-2/5 object-cover" />
            <div className="mx-6">
              <h2 className="text-2xl font-bold text-[#FF5135] mb-3">{config.title}</h2>
              <p className="text-gray-600 mb-4">{config.description}</p>
              <div className="flex justify-center gap-4">
                {config.cancelText && (
                  <button className="px-6 py-2 border rounded-md hover:bg-gray-200" onClick={onClose}>
                    {config.cancelText}
                  </button>
                )}
                {config.confirmText && (
                  <button className="px-6 py-2 border-white rounded-md bg-[#7CE9BF] hover:shadow-[0px_0px_3px_rgba(124,233,191,1)] cursor-pointer" onClick={handleConfirm}>
                    {config.confirmText}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmCard;
