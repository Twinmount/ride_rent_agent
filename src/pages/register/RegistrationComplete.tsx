import { useQuery } from "@tanstack/react-query";
import { getCompany } from "@/api/company";
import { getUser } from "@/api/user";
import { load, StorageKeys } from "@/utils/storage";
import { jwtDecode } from "jwt-decode";
import { DecodedRefreshToken } from "@/layout/ProtectedRoutes";
import { CheckCheck, Files } from "lucide-react";
import { useState } from "react";
import LazyLoader from "@/components/loading-skelton/LazyLoader";

export default function RegistrationComplete() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 3000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN);
  const { userId } = jwtDecode<DecodedRefreshToken>(refreshToken as string);

  // Query to get company data
  const { data: companyData, isLoading: isCompanyLoading } = useQuery({
    queryKey: ["company"],
    queryFn: () => getCompany(userId),
  });

  // Query to get user data
  const { data: agentData, isLoading: isAgentLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUser,
  });

  if (isCompanyLoading || isAgentLoading) {
    return (
      <section className="w-full min-h-screen bg-white flex-center">
        <LazyLoader />
      </section>
    );
  }

  const profileData = companyData?.result;
  const userData = agentData?.result;

  if (!profileData) {
    return (
      <section className="min-h-screen flex-center">
        <p>No company data found.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-center items-center p-4 h-screen bg-gray-100">
      <div className="relative">
        <h1 className="mb-8 text-3xl font-bold">Registration Complete</h1>
      </div>

      <div className="flex overflow-hidden flex-col w-full max-w-4xl bg-white rounded-lg shadow-lg md:flex-row">
        {/* Left */}
        <div className="flex flex-col justify-center items-center p-6 bg-gray-50 md:w-1/2">
          <img
            src={profileData.companyLogo}
            alt="Company Logo"
            className="object-cover mb-4 w-32 h-32 rounded-full"
          />
          <h2 className="text-2xl font-semibold">{profileData.companyName}</h2>
        </div>

        {/* Right */}
        <div className="flex flex-col justify-center p-6 md:w-1/2">
          <div className="flex flex-col mb-4">
            <label className="text-gray-600">Agent Email:</label>
            <a
              href={`mailto:${userData?.emailId}`}
              className="font-bold text-yellow hover:underline"
            >
              {userData?.emailId}
            </a>
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-gray-600">Agent Mobile:</label>
            <span className="text-gray-800">
              {userData?.countryCode} {userData?.phoneNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Agent ID */}
      <div className="mt-6">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Agent ID:</span>
          <span className="font-semibold text-gray-800">
            {profileData.agentId}
          </span>
          <button
            className="px-2 h-6 text-base rounded-lg border-none outline-none flex-center text-yellow"
            onClick={() => copyToClipboard(profileData.agentId)}
          >
            {isCopied ? <CheckCheck size={18} /> : <Files size={18} />}
          </button>
        </div>
      </div>

      {/* Information about registration and approval */}
      <div className="mt-8 text-center">
        <p className="text-lg text-gray-700 md:px-10">
          Your company registration is completed and is currently waiting for
          approval from the admin.
          <br /> You will be notified via{" "}
          <span className="font-semibold text-green-500">WhatsApp</span> once
          the approval process is complete.
        </p>
      </div>
    </section>
  );
}
