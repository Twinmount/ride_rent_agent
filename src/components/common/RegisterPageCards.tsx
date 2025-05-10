import { CheckCircle, FileText, ShieldCheck, TrendingUp } from "lucide-react";
import { MotionH1, MotionH2 } from "../framer-motion/MotionElm";
import MotionSection from "../framer-motion/MotionSection";

export default function RegisterPageCards() {
  return (
    <MotionSection>
      <MotionH1
        className="mb-3 text-5xl font-bold max-lg:text-4xl max-lg:text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        More Power to you!
      </MotionH1>
      <MotionH2
        className="mb-4 text-3xl  max-lg:text-xl max-lg:text-center mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Simplify Fleet Operations with Ride.Rent’s All-in-One Platform
      </MotionH2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {/* Card 1 */}
        <div className="p-6 rounded-2xl hover:shadow-md max-w-md border hover:scale-105 duration-300  transition ">
          <div className="p-4 border rounded-lg w-fit mb-4 ">
            <TrendingUp className="w-10 h-10 " />
          </div>
          <h3 className="text-xl font-bold mb-2">
            More Profits, Zero Commission
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span>
                <span className="font-semibold">
                  Get complete global visibility
                </span>{" "}
                for your fleet across highdemand markets
              </span>
            </li>
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span>
                No middlemen, no commission -{" "}
                <span className="font-semibold">
                  keep 100% of your booking price.
                </span>
              </span>
            </li>
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span>
                <span className="font-semibold">Promote experiences</span> with
                custom advertising packages.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl hover:shadow-md max-w-md border hover:scale-105 duration-300  transition">
          <div className="p-4 border rounded-lg w-fit mb-4">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">Safe & Secure Rentals</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span>
                <span className="font-semibold">Manage, track, and update</span>{" "}
                your fleet in real-time. Get all fleet updates at one place.
              </span>
            </li>
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span>
                <span className="font-semibold">Receive direct bookings</span>{" "}
                from users with full transparency.
              </span>
            </li>
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span>
                <span className="font-semibold">Free fraud detection</span>{" "}
                features for safe rentals across all markets.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl hover:shadow-md max-w-md border hover:scale-105 duration-300  transition">
          <div className="p-4 border rounded-lg w-fit mb-4">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold mb-2">Cloud Contracts & Billing</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span>
                Create and manage{" "}
                <span className="font-semibold">
                  comprehensive digital rental contracts
                </span>{" "}
                with just a few clicks.
              </span>
            </li>
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span>
                Access a{" "}
                <span className="font-semibold">
                  cloud-based billing dashboard
                </span>{" "}
                for all your needs, anytime, anywhere.
              </span>
            </li>
            <li className="flex items-center">
              <div>
                <CheckCircle className="w-5 h-5 text-black me-2" />
              </div>
              <span>
                Ensure compliance with{" "}
                <span className="font-semibold">GST-friendly invoicing</span>{" "}
                built for India.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </MotionSection>
  );
}
