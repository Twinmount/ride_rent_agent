import { sidebarContent } from "@/constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAgentContext } from "@/context/AgentContext";
import LogoutModal from "../modal/LogoutModal";
import SRMSidebar from "./SRMSidebar";

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar, isSmallScreen } = useAgentContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (link: string) => {
    navigate(link);
    toggleSidebar();
  };

  return (
    <aside
      className={`fixed top-0 bottom-0  h-full bg-white w-56  transition-all duration-300 ease-in-out z-[101]   ${
        isSidebarOpen ? "left-0" : "-left-56"
      } ${!isSmallScreen && "!left-0"}`}
    >
      <div className="flex items-center justify-between p-0  h-[4.84rem] border-b border-b-slate-100 px-[0.6rem]">
        <Link to={"/"} className="p-0 text-sm text-right text-gray-600">
          <figure className="ml-2">
            <img
              src={"/assets/logo/header/agent_logo.webp"}
              className="w-32"
              alt="Ride Rent Logo"
            />
          </figure>
        </Link>

        {isSmallScreen && (
          <button
            aria-label="Sidebar Toggle"
            className="inline-flex justify-center items-center p-0 mb-1 bg-transparent border-none cursor-pointer outline-none group"
            onClick={toggleSidebar}
          >
            <X
              strokeWidth={2.5}
              className="w-8 h-8 transition-colors group-hover:text-yellow"
            />
          </button>
        )}
      </div>

      <div
        className={`flex flex-col gap-y-1 items-center px-[0.6rem] h-full p-2 mt-2 ${
          !isSmallScreen && "shadow-md"
        }`}
      >
        {sidebarContent.map((item) => {
          if (item.label === "SRM") {
            return <SRMSidebar key={item.link} icon={item.icon} />;
          }

          const Icon = item.icon;
          const isActive =
            item.link === "/"
              ? location.pathname === item.link
              : location.pathname.startsWith(item.link);

          return (
            <div
              key={item.link}
              onClick={() => handleClick(item.link)}
              className={`w-[95%] mx-auto flex items-center gap-2 h-12 py-2 px-4 rounded-lg transition-all duration-100 ease-out ${
                isActive
                  ? "bg-yellow text-white hover:text-white"
                  : "hover:text-yellow hover:bg-slate-100"
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleClick(item.link)}
            >
              <Icon className="text-xl" size={20} strokeWidth={3} />
              <span className="font-medium">{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="absolute w-[92%] ml-[0.4rem] bottom-0 pb-3 bg-white z-10 pt-2">
        {/* logout modal */}
        <LogoutModal />
      </div>
    </aside>
  );
};

export default Sidebar;
