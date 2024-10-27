import Cities from "./Locations";
import MotionSection from "../framer-motion/MotionSection";

const WhyOpt = () => {
  return (
    <MotionSection className="wrapper h-auto pb-12 pt-4 bg-white rounded-[1rem]">
      <h2 className="mx-auto my-4 font-bold text-center">
        Why Opt RIDE.RENT When Looking for Cars for Rent
        {/* in {location.label}  */}?
      </h2>

      <div className="w-full m-auto mb-4 md:max-w-[80%]">
        <p className="text-center font-[400]">
          Discover the premier car rental experience with RIDE.RENT, where a
          vast array of vehicles awaits. From timeless classics to the pinnacle
          of modern luxury, our diverse fleet caters to every preference.
          Renting with us is a breeze—simply peruse our extensive selection of
          cars for rent to match your style and budget, and reachout to our
          agents with ease!
          <br />
          <br />
          Seeking a sleek luxury convertible or a cost-effective option for a
          monthly car rental in Dubai? RIDE.RENT has your perfect match on
          standby.
          <br />
          <br />
          Don&apos;t hesitate—secure your ideal car for rent in Dubai with
          RIDE.RENT today!
        </p>
      </div>

      {/* cities */}
      <Cities />
    </MotionSection>
  );
};
export default WhyOpt;
