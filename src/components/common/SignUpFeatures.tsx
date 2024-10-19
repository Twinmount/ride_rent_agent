import { Check } from "lucide-react";

const SignUpFeatures = () => {
  return (
    <div className="w-[93%] lg:w-3/4 max-lg:mb-4 max-lg:mt-16">
      <h1 className="mb-3 text-5xl font-extrabold text-white max-lg:text-4xl max-lg:text-center">
        A FREE SHOWCASE FOR YOUR FLEET
      </h1>
      <h2 className="mb-4 text-3xl font-semibold text-white max-lg:text-xl max-lg:text-center">
        GET FASTER BOOKINGS & MORE PROFITS
      </h2>
      <ul className="flex flex-col gap-1 text-lg font-semibold text-white w-fit max-lg:mx-auto">
        <li className="flex gap-x-1 items-center">
          <Check className="mb-auto text-yellow" /> No Middlemen or Commission
        </li>
        <li className="flex relative gap-x-1 items-center">
          <Check className="mb-auto text-yellow" /> Ai-driven Fraud Detection
          For Secure Rentals
          <span className="absolute -top-1 -right-7 px-1 text-[0.6rem] leading-[1rem] text-black rounded-lg bg-[linear-gradient(110deg,#b78628,35%,#ffd700,45%,#fffacd,55%,#b78628)] bg-[length:200%_100%] animate-shimmer">
            New
          </span>
        </li>

        <li className="flex gap-x-1 items-center">
          <Check className="mb-auto text-yellow" />
          Faster On-boarding
        </li>
        <li className="flex gap-x-1 items-center">
          <Check className="mb-auto text-yellow" /> Get Booking details via
          direct SMS/Email/Call
        </li>
        <li className="flex gap-x-1 items-center">
          <Check className="mb-auto text-yellow" /> Dedicated Profiles
        </li>
        <li className="flex gap-x-1 items-center">
          <Check className="mb-auto text-yellow" /> A Single Platform To Rent
          Your Vehicles
        </li>
      </ul>
    </div>
  );
};
export default SignUpFeatures;
