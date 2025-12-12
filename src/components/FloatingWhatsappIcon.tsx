import { useState, useEffect, useRef } from "react";
import { MessageCircleQuestion, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const FloatingWhatsAppButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasAutoCollapsed, setHasAutoCollapsed] = useState(false);
  const [userClosedManually, setUserClosedManually] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  // Extract country from URL path
  const country = location.pathname.startsWith("/in") ? "in" : "ae";

  // Dynamic WhatsApp links based on country
  const whatsappLinks = {
    in: "https://api.whatsapp.com/send?phone=919686443261&text=Hi%2C%20I%E2%80%99d%20like%20to%20connect%20with%20Ride.Rent%20Support%20for%20assistance",
    ae: "https://api.whatsapp.com/send?phone=971502972335&text=Hi%2C%20I%E2%80%99d%20like%20to%20connect%20with%20Ride.Rent%20Support%20for%20assistance",
  };

  const whatsappLink = whatsappLinks[country as keyof typeof whatsappLinks];

  // Auto-collapse after 2 seconds on initial load
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      setIsExpanded(false);
      setHasAutoCollapsed(true);
    }, 2000);

    return () => clearTimeout(initialTimeout);
  }, []);

  //  Expand on scroll, then collapse 2 seconds after scrolling stops
  useEffect(() => {
    if (!hasAutoCollapsed || userClosedManually) return;

    const handleScroll = () => {
      // Expand immediately on scroll
      setIsExpanded(true);

      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 2000);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [hasAutoCollapsed, userClosedManually]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
    setUserClosedManually(true);
  };

  return (
    <div
      className={`fixed bottom-24 right-0 z-10 h-14 flex items-center rounded-l-full bg-green-500 transition-all duration-300 shadow-lg hover:shadow-xl ${
        isExpanded ? "w-52" : "w-12"
      }`}
    >
      <div
        className="flex justify-center items-center ml-3 h-full text-white cursor-pointer w-fit"
        onClick={handleToggle}
        aria-label="Toggle WhatsApp help"
      >
        <MessageCircleQuestion
          className={`${!isExpanded && "animate-bounce"} scale-125`}
        />
      </div>

      {isExpanded && (
        <div className="flex justify-between items-center px-4 h-full w-full text-sm text-white bg-green-500 rounded-r-full">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex-1"
          >
            <div className="font-semibold">Need help?</div>
            <div className="text-[0.65rem] leading-4 whitespace-nowrap">
              Click to chat on WhatsApp
            </div>
          </a>

          <button
            onClick={handleClose}
            className="ml-2 hover:bg-green-600 rounded-full p-1 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingWhatsAppButton;
