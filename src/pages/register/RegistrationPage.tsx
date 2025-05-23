import FAQ from "@/components/common/Faq";
import WhyJoin from "@/components/common/WhyJoin";
import WhyOpt from "@/components/common/WhyOpt";
import SignUpFeatures from "@/components/common/SignUpFeatures";
import { features, featuresIndia, FAQ_Data } from "@/constants/data/data";
import MotionDiv from "@/components/framer-motion/MotionDiv";
import RegistrationForm from "@/components/form/main-form/RegistrationForm";
import Footer from "@/components/footer/Footer";
import { Helmet } from "react-helmet-async";
import FloatingWhatsAppButton from "@/components/FloatingWhatsappIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link, useLocation } from "react-router-dom";
import RegisterCountryDropdown from "@/components/RegisterCountryDropdown";
import { useEffect } from "react";
import { useAgentContext } from "@/context/AgentContext";

export default function RegistrationPage({
  country = "uae",
}: {
  country?: string;
}) {
  const location = useLocation();
  const { updateAppCountry } = useAgentContext();

  // Check if the current pathname is "/register"
  const isRegisterPage =
    location.pathname === "/register" ||
    location.pathname === "/uae/register" ||
    location.pathname === "/in/register";

  useEffect(() => {
    updateAppCountry(country === "india" ? "in" : "uae");
  }, []);

  return (
    <>
      <section className="pb-10 bg-white">
        <Helmet>
          <title>
            Register Your Vehicle for Free on Ride.Rent- Advertise Cars, Boats,
            Yachts, Helicopters, and Private Jets!
          </title>
          <meta
            name="description"
            content=" Maximize your earnings with zero upfront costs! Ride.Rent connects vehicle owners with
            thousands of renters seeking high-quality, well-maintained vehicles for short-term or long-term
            use. Whether you own a luxury yacht, a powerful sports bike, or a private jet, this is the perfect
            opportunity to showcase your vehicle and start earning. We believe in providing a seamless
            experience for both vehicle owners and renters. Our user-friendly platform allows owners
            (agents) to easily list their vehicles and manage bookings, while renters can effortlessly browse
            and book the perfect vehicle for their needs"
          />
        </Helmet>

        {/* form section */}
        <div
          className="h-auto min-h-[88vh] max-lg:py-6 relative"
          style={{
            backgroundImage: `url('/assets/img/bg/register-banner.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Navbar */}
          <nav className="flex justify-between items-center px-4 lg:px-20 py-4 bg-transparent">
            <div className="flex items-center gap-4">
              {isRegisterPage ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-32 md:w-40 lg:w-44 border-none ring-0 cursor-pointer outline-none focus:ring-0">
                    <img
                      src="/assets/logo/header/agent_white_logo.webp"
                      alt="riderent logo"
                      className="object-contain w-full h-full"
                    />
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
                        Stay on Registration
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="text-sm font-bold text-gray-300 transition-colors cursor-pointer hover:text-yellow"
                      >
                        <a
                          href={`https://ride.rent/${
                            country === "india" ? "in" : "uae"
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
              ) : (
                <Link to="/" className="w-32 md:w-40 lg:w-44">
                  <img
                    src="/assets/logo/header/agent_white_logo.webp"
                    alt="riderent logo"
                    className="object-contain w-full h-full"
                  />
                </Link>
              )}
            </div>

            <div className="flex items-center gap-4">
              <RegisterCountryDropdown country={country} type="register" />
              <h4 className="text-white ms-4 hidden md:block">
                Already an Agent?
              </h4>
              <Link
                to={`${country === "india" ? "/in" : "/uae"}/login`}
                className="font-semibold text-yellow"
              >
                <button className="px-4 py-2 border border-white text-white bg-transparent hover:bg-white hover:text-black hover:border-black transition duration-200 rounded">
                  Login
                </button>
              </Link>
            </div>
          </nav>

          {/* Main Content */}
          <MotionDiv className="flex z-10 flex-col items-center justify-center gap-4 mx-auto mb-12 lg:flex-row w-[95%] lg:w-[85%]">
            <SignUpFeatures country={country} />
            <RegistrationForm country={country} />
          </MotionDiv>
        </div>

        {/* Why Join Us */}
        <WhyJoin
          country={country}
          data={country === "uae" ? features : featuresIndia}
        />

        {/* FAQ */}
        <FAQ data={FAQ_Data} />

        {/* why opt */}
        <WhyOpt country={country} />
      </section>
      <Footer />

      {/* whatsapp floating button */}
      <FloatingWhatsAppButton />
    </>
  );
}
