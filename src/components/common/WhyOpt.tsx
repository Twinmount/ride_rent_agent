import { CheckCircle } from "lucide-react";
import MotionSection from "../framer-motion/MotionSection";
import RegisterButtonWithDialog from "./RegisterButtonWithDialog";

const WhyOpt = ({ country }: { country: string }) => {
  return (
    <MotionSection className="wrapper h-auto pb-12 pt-4 bg-white rounded-[1rem]">
      <div className="flex flex-col md:flex-row items-center justify-between  p-10  ">
        <div className="text-3xl md:text-5xl font-bold text-center md:text-left mb-6 md:mb-0">
          <h1>Sign up & start renting your</h1>
          <h1>vehicle today!</h1>
        </div>

        <div className=" p-6 rounded-2xl hover:shadow-md max-w-md border hover:scale-105 duration-300 transitions">
          <h2 className="text-2xl font-semibold mb-4">
            All-in-One Suite for Vehicle Renting
          </h2>
          <ul className="space-y-2 text-gray-700 ">
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span> No Middlemen or Commission</span>
            </li>
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span> AI-driven Fraud Detection For Secure Rentals</span>
            </li>
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span>Faster On-boarding</span>
            </li>
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span> Get Booking details via direct SMS/Email/Call</span>
            </li>
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span> Dedicated Profiles</span>
            </li>
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span> A Single Platform To Rent Your Vehicles</span>
            </li>
          </ul>
          <RegisterButtonWithDialog country={country} />
        </div>
      </div>
    </MotionSection>
  );
};
export default WhyOpt;
