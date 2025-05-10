import { Building2, Car, UserPlus } from "lucide-react";
import { MotionH2 } from "../framer-motion/MotionElm";
import MotionSection from "../framer-motion/MotionSection";

export default function RegisterPageOnBoardingCards() {
  return (
    <MotionSection>
      <MotionH2
        className="text-3xl  max-lg:text-xl max-lg:text-center mt-20 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span className="font-bold">Fast Onboarding, Smarter Operations.</span>
      </MotionH2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {/* Card 1 */}
        <div className="p-6 rounded-2xl hover:shadow-md max-w-md border hover:scale-105 duration-300  transition">
          <div className="p-4 border rounded-lg w-fit mb-4">
            <UserPlus className="w-10 h-10 " />
          </div>
          <h3 className="text-3xl mb-4">Sign up</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <span className="text-lg">
                Create your free Ride.Rent account and start your rental journey
              </span>
            </li>
          </ul>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl hover:shadow-md max-w-md border hover:scale-105 duration-300  transition">
          <div className="p-4 border rounded-lg w-fit mb-4">
            <Building2 className="w-10 h-10" />
          </div>
          <h3 className="text-3xl mb-4">Register Company</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <span className="text-lg">
                Add your company* profile to unlock direct bookings and fleet
                management tools.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl hover:shadow-md max-w-md border hover:scale-105 duration-300  transition">
          <div className="p-4 border rounded-lg w-fit mb-4">
            <Car className="w-10 h-10" />
          </div>
          <h3 className="text-3xl mb-4">List your Vehicle</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <span className="text-lg">
                Easily upload your vehicle details and start earning with zero
                commission.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </MotionSection>
  );
}
