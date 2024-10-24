import React, { useState, useEffect } from "react";
import { MessageCircleQuestion, X } from "lucide-react"; // Import icons from Lucide
import { Link } from "react-router-dom";

const FloatingWhatsAppButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-collapse after 3 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isExpanded) {
      timeout = setTimeout(() => {
        setIsExpanded(false);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [isExpanded]);

  return (
    <div
      className={`fixed bottom-8 right-0 z-10 h-14 flex items-center rounded-l-full  bg-green-500  transition-all duration-300 ${
        isExpanded ? "w-48" : "w-12"
      }`}
    >
      <div
        className="flex justify-center items-center ml-3 h-full text-white cursor-pointer w-fit"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <MessageCircleQuestion
          className={`${!isExpanded && "animate-bounce"} scale-125`}
        />
      </div>
      {isExpanded && (
        <div className="flex flex-col justify-center items-start px-4 h-full text-sm text-white bg-green-500 rounded-r-full">
          <Link
            to={
              "https://api.whatsapp.com/send?phone=971502972335&text=Hello%2C%0AI would like to list my vehicles with https%3A%2F%2Fagent.ride.rent%2Fregister %26 advertise my fleet for *free*. "
            }
            target="_blank"
            className="hover:underline"
          >
            <div className="font-semibold">Need help?</div>
            <div className="text-[0.65rem] leading-4 whitespace-nowrap">
              Click to chat on Whatsapp
            </div>
          </Link>
          <X
            className="absolute top-2 right-3 w-4 h-4 cursor-pointer"
            onClick={() => setIsExpanded(false)}
          />
        </div>
      )}
    </div>
  );
};

export default FloatingWhatsAppButton;
