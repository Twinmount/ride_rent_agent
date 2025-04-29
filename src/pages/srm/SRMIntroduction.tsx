import { srmFeatures } from "@/constants";
import React from "react";

const SRMIntroduction: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="p-8 w-full max-w-4xl bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col justify-center items-center">
          {/* Logo */}
          <div className="flex items-start mb-6">
            <div className="w-20 h-20 max-md:w-14 max-md:h-14 min-w-14">
              <img src="/assets/icons/SRM_icon.svg" alt="srm logo" />
            </div>

            <div className="flex flex-col justify-center items-start my-auto ml-3">
              <h2 className="text-xl font-bold text-gray-800 lg:text-2xl">
                The Simple Rental Manager (SRM) by Ride.Rent
              </h2>

              <p className="text-sm text-left md:max-w-[70%] text-gray-600">
                Securely upload & manage customer details, with built-in fraud
                detector to identify & prevent fraudulent rentals.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Mapping over the array to generate feature items */}
            {srmFeatures.map((feature, index) => {
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

          <div className="px-6 py-2 mt-8 text-white rounded-2xl transition hover:shadow-lg bg-yellow">
            Coming soon...
          </div>
        </div>
      </div>
    </div>
  );
};

export default SRMIntroduction;
