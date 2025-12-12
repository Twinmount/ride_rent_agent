import Social from "./Social";
import { useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Footer() {
  const location = useLocation();

  // Extract country from URL path
  const country = location.pathname.startsWith("/in") ? "in" : "ae";

  return (
    <footer className="bg-black text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="md:w-[75%] w-full">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-yellow">
              COUNTRIES
            </h2>
            <div className="text-white flex gap-2">
              <a
                href="https://ride.rent/ae/"
                className="hover:text-yellow transition"
              >
                United Arab Emirates
              </a>
              <span>|</span>
              <a
                href="https://ride.rent/in"
                className="hover:text-yellow transition"
              >
                India
              </a>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-yellow">HELP</h2>
            <div className="flex flex-wrap gap-10 text-white justify-center md:justify-start">
              <a
                href="https://ride.rent/about-us"
                className="hover:text-gray-300"
              >
                About Ride.Rent
              </a>

              <a
                href="https://ride.rent/privacy-policy"
                className="hover:text-gray-300"
              >
                Privacy Policy
              </a>
              <a
                href="https://ride.rent/terms-condition"
                className="hover:text-gray-300"
              >
                Terms & Conditions
              </a>
              <a
                href="https://ride.rent/ae/blog"
                className="hover:text-gray-300"
              >
                Ride Advisor
              </a>
            </div>
          </div>
          <div className="w-full pt-4 md:pt-0  items-center justify-center md:hidden">
            <Social />
          </div>
          <div className="mb-2 pt-6 max-md:flex max-md:items-center max-md:flex-col">
            <div className="mr-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-48 border-none ring-0 cursor-pointer outline-none focus:ring-0">
                  <figure>
                    <img
                      src="/assets/logo/header/agent_white_logo.webp"
                      className="w-full"
                      alt="Ride Rent Logo"
                    />
                  </figure>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="z-50 p-4 bg-gray-800 rounded-md border-none shadow-md outline-none"
                  sideOffset={10}
                  align="start"
                >
                  <div className="flex flex-col gap-3">
                    <DropdownMenuItem
                      className="text-sm font-bold text-gray-300 transition-colors cursor-pointer hover:text-yellow"
                      onSelect={() => {}}
                    >
                      Stay on Page
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="text-sm font-bold text-gray-300 transition-colors cursor-pointer hover:text-yellow"
                    >
                      <a
                        href={`https://ride.rent/${
                          country === "in" ? "in" : "ae"
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ride.Rent Booking Portal
                      </a>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mt-8 flex justify-start">
              <span>FleetOrbita Internet Services, ACJ-9769</span>
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ride.Rent ©2025
              </span>
            </div>
          </div>
        </div>

        <div className="md:w-[25%] w-full pt-4 md:pt-0  md:flex items-center justify-center max-md:hidden">
          <div className="md:ml-auto">
            <Social />
          </div>
        </div>
      </div>
    </footer>
  );
}
