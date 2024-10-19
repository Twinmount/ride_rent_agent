import Social from "./Social";

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center items-center py-6 w-full text-center text-white bg-black">
      {/* logo */}
      <div className="mb-6">
        <figure>
          <img
            src={"/assets/logo/header/agent_white_logo.webp"}
            className="w-48"
            alt="Ride Rent Logo"
          />
        </figure>
      </div>

      <div className="mb-4 text-xl font-semibold text-center text-white">
        UAE's LEADING VEHICLE RENTING & LEASING PLATFORM
      </div>

      <Social />
    </footer>
  );
}
