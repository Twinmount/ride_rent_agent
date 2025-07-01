import SRMPublicCustomerDetailsForm from "@/components/form/srm-form/PublicCustomerDetailsForm";
import { SRMPublicCustomerDetailsFormDefaultValues } from "@/constants";
import useGetSearchParams from "@/hooks/useGetSearchParams";
import { jwtDecode } from "jwt-decode";

type DecodedTokenType = {
  agentId: string;
  bookingId: string;
  countryCode: string;
  customerId: string;
  customerName: string;
  email: string;
  exp: number; // Unix timestamp
  iat: number; // Unix timestamp
  phoneNumber: string;
  role: "guest";
  sessionId: string;
};

export default function PublicCustomerDetailsPage() {
  const token = useGetSearchParams("token");

  if (!token) {
    return (
      <div className="h-screen flex-center text-center text-red-500">
        Token not found. You can close this page
      </div>
    );
  }

  const decodedToken = jwtDecode<DecodedTokenType>(token as string);
  console.log("token : ", token);
  console.log("decoded token : ", decodedToken);

  const formattedPhoneNumber = `+${decodedToken.countryCode}${decodedToken.phoneNumber}`;

  const formData = {
    ...SRMPublicCustomerDetailsFormDefaultValues,
    email: decodedToken.email,
    phoneNumber: formattedPhoneNumber,
    customerName: decodedToken.customerName,
  };

  const initialCountryCode = decodedToken.countryCode;

  return (
    <div className="container py-6 pb-10 h-auto min-h-screen bg-slate-50">
      <div className="gap-x-4 mb-5 ml-2 flex flex-col items-start w-fit">
        <h1 className="text-center h3-bold sm:text-left">Customer Details</h1>
        <h2 className="font-medium text-gray-600">
          (Form is valid only for 2 hours)
        </h2>
      </div>

      <SRMPublicCustomerDetailsForm
        token={token}
        formData={formData}
        customerId={decodedToken.customerId}
        initialCountryCode={initialCountryCode}
      />
    </div>
  );
}
