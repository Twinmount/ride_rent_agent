import { Check } from "lucide-react";

const SignUpFeatures = ({ country }: { country: string }) => {
  return (
    <div className="w-[93%] lg:w-3/4 max-lg:mb-4 max-lg:mt-16">
      <h1 className="mb-3 text-4xl font-extrabold text-white max-lg:text-3xl max-lg:text-center">
        All-in-One Platform to List, Manage & Scale Your Fleet
      </h1>
      <ul className="flex flex-col gap-1 text-lg font-semibold text-white w-fit max-lg:mx-auto">
        <li className="flex gap-x-1 items-center my-1">
          <Check className="mb-auto text-yellow" /> Get More Bookings with
          Global Visibility
        </li>
        <li className="flex relative gap-x-1 items-center max-sm:w-[95%] my-1">
          <Check className="mb-auto text-yellow" /> List Your Vehicles and Grow
          Faster
          {/* <span className="absolute -top-1 -right-7 px-1 text-[0.6rem] leading-[1rem] text-black rounded-lg bg-[linear-gradient(110deg,#b78628,35%,#ffd700,45%,#fffacd,55%,#b78628)] bg-[length:200%_100%] animate-shimmer">
            New
          </span> */}
        </li>

        <li className="flex gap-x-1 items-center my-1">
          <Check className="mb-auto text-yellow" />
          Quicker Contracts Creation & Cloud Storage.
        </li>
        <li className="flex gap-x-1 items-center my-1">
          <Check className="mb-auto text-yellow" /> Manage Billing with
          {country === "ae" ? " VAT" : " GST"}-Compliant Cloud Software
        </li>
      </ul>
    </div>
  );
};
export default SignUpFeatures;
