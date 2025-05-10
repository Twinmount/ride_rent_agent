import Social from "./Social";

export default function Footer() {
  return (
    <footer className="bg-black text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="md:w-[75%] w-full">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-yellow">
              COUNTRIES
            </h2>
            <p className="text-white">United Arab Emirates | India</p>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2 text-yellow">HELP</h2>
            <div className="flex flex-wrap gap-10 text-white justify-center md:justify-start">
              <a href="#" className="hover:text-gray-300">
                About Ride.Rent
              </a>
              <a href="#" className="hover:text-gray-300">
                List Vehicles
              </a>
              <a href="#" className="hover:text-gray-300">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-300">
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-gray-300">
                Ride Advisor
              </a>
              <a href="#" className="hover:text-gray-300">
                FAQ
              </a>
            </div>
          </div>
          <div className="w-full pt-4 md:pt-0  items-center justify-center md:hidden">
            <Social />
          </div>
          <div className="mb-2 pt-6 max-md:flex max-md:items-center max-md:flex-col">
            <div className="mr-2">
              <figure>
                <img
                  src="/assets/logo/header/agent_white_logo.webp"
                  className="w-48"
                  alt="Ride Rent Logo"
                />
              </figure>
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
