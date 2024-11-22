import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronUp, LucideProps } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface SRMLink {
  label: string;
  link: string;
}

interface SRMSidebarProps {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

const SRMSidebar = ({ icon }: SRMSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const srmLinks: SRMLink[] = [
    { label: "SRM Overview", link: "/srm" },
    { label: "SRM Reports", link: "/srm/a" },
    { label: "SRM Settings", link: "/srm" },
  ];

  const toggleDropdown = () => {
    setIsExpanded((prev) => !prev);
  };

  const SRMIcon = icon;

  // Check if any of the srmLinks is active
  const isAnyLinkActive = srmLinks.some((link) =>
    location.pathname.startsWith(link.link)
  );

  return (
    <div className="w-[95%] mx-auto">
      {/* SRM Header */}
      <div
        className={`flex gap-2 justify-between items-center px-4 py-2 h-12 rounded-lg transition-all cursor-pointer ${
          isAnyLinkActive ? "text-white bg-yellow" : "hover:bg-slate-100"
        }`}
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && toggleDropdown()}
      >
        <div className="flex gap-2 items-center">
          <SRMIcon />
          <span className="font-medium">SRM</span>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {/* Dropdown Content */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="flex flex-col mt-2">
          {srmLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.link);
            return (
              <div
                key={link.link}
                className={`flex gap-2 items-center px-4 py-1 h-10 text-sm rounded-lg cursor-pointer ${
                  isActive ? "font-semibold text-yellow" : "hover:bg-slate-100"
                }`}
                onClick={() => navigate(link.link)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(link.link)}
              >
                <span>{link.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SRMSidebar;
