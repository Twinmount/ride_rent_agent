import { fetchCustomerDetails } from "@/api/srm/trips";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function CustomerDetailsSection() {
  const { customerId } = useParams<{ customerId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["srm-customer-details", customerId],
    queryFn: () => fetchCustomerDetails(customerId as string),
    enabled: !!customerId,
  });

  const customer = data?.result;

  if (isLoading) {
    return (
      <div className="h-56 w-full flex-center text-lg italic text-gray-600">
        Fetching Customer Information...
      </div>
    );
  }

  if (!data || !customer) {
    return (
      <div className="h-screen pt-56 w-full bg-white flex justify-center text-lg italic text-gray-600">
        No Customer Found!
      </div>
    );
  }

  return (
    <div className="w-[95%] md:w-[88%] lg:w-[80%] mx-auto flex flex-col  lg:flex-row justify-center gap-6 bg-white  p-6 rounded-md border-b ">
      {/* Left Section */}
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left border-r border-gray-200 pr-6">
        {/* Customer Profile Picture */}
        <div className="mb-4">
          <img
            src={
              customer?.customerProfilePic || "/assets/img/user-profile.webp"
            }
            alt="Customer Profile"
            className="w-32 h-32 rounded-full object-cover shadow"
          />
        </div>

        {/* Customer Name */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {customer?.customerName || "N/A"}
        </h2>

        {/* Customer Phone Number */}
        <p className="text-gray-600">
          <span className="font-medium">Phone:</span>{" "}
          <a
            href={`tel:${customer?.countryCode}${customer?.phoneNumber}`}
            className="text-gray-600 hover:underline"
          >
            {customer?.countryCode} {customer?.phoneNumber || "N/A"}
          </a>
        </p>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center gap-4 w-fit">
        {/* Nationality */}
        <div>
          <p className="text-gray-600">
            <span className="font-medium">Nationality:</span>{" "}
            {customer?.nationality || "N/A"}
          </p>
        </div>

        {/* Passport Number */}
        <div>
          <p className="text-gray-600">
            <span className="font-medium">Passport Number:</span>{" "}
            {customer?.passportNumber || "N/A"}
          </p>
        </div>

        {/* Driving License Number */}
        <div>
          <p className="text-gray-600">
            <span className="font-medium">Driving License:</span>{" "}
            {customer?.drivingLicenseNumber || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
