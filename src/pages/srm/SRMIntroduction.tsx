import { SRMIntroFeatures } from "@/constants";
import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const SRMIntroduction: React.FC = () => {
  return (
    <div className="flex justify-center bg-white items-center py-8">
      <div className="p-8 w-full max-w-4xl">
        <div className="flex flex-col justify-end  items-center">
          {/* Logo */}
          <div className="flex items-start mb-6">
            <div className="w-16 h-16 max-md:w-14 max-md:h-14 min-w-14">
              <img src="/assets/icons/SRM_icon.svg" alt="srm logo" />
            </div>

            <div className="flex flex-col justify-center items-start my-auto ml-3">
              <h2 className="text-lg font-bold text-gray-800 lg:text-xl">
                The Simple Rental Manager (SRM) by Ride.Rent
              </h2>

              <p className="text-sm text-left md:max-w-[70%] text-gray-600">
                Securely upload & manage customer details, with built-in fraud
                detector to identify & prevent fraudulent rentals.
              </p>
            </div>
          </div>
          <div className="space-y-4 ml-2 md:ml-6 lg:ml-12 mr-auto">
            {/* Mapping over the array to generate feature items */}
            {SRMIntroFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start">
                  <div className="mr-2">
                    <Icon className="text-yellow" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {feature.label}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            to={"/srm/tax-info"}
            className="px-6 group py-2 mt-8 text-xl lg:text-2xl font-semibold rounded-xl  hover:shadow-lg bg-slate-900 gap-x-2 text-yellow hover:bg-slate-800 transition-colors flex-center w-full h-16 max-w-80 "
          >
            START FOR FREE
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SRMIntroduction;
