import { CheckCheck, Files, MoreVertical, Eye, Download } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@tanstack/react-query";
import { getCompany } from "@/api/company";
import { load, StorageKeys } from "@/utils/storage";
import { DecodedRefreshToken } from "@/layout/ProtectedRoutes";
import { jwtDecode } from "jwt-decode";
import { getUser } from "@/api/user";
import LazyLoader from "@/components/loading-skelton/LazyLoader";
import SupportModal from "@/components/modal/SupportModal";
import PreviewImageComponent from "@/components/form/PreviewImageComponent";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { downloadFileFromStream } from "@/helpers/form";
import ImagePreviewModal from "@/components/modal/ImagePreviewModal";
import NeedHelpToolTip from "@/components/common/NeedHelpToolTip";

export default function ProfilePage() {
  const [isCopied, setIsCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  // Handle image download using the helper function
  const handleDownloadImage = async (filePath: string) => {
    try {
      await downloadFileFromStream(filePath, "Registration Card");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Unable to download the image. Please try again.",
      });
      console.error("Error downloading image:", error);
    }
  };

  // Handle image preview
  const handlePreviewImage = (filePath: string) => {
    setPreviewImage(filePath);
  };

  return (
    <section className="py-10 min-h-screen text-base flex-center">
      <dl className="flex flex-col gap-y-6 p-3 max-w-lg  w-full text-lg max-sm:w-[95%] bg-white rounded-xl shadow-md md:text-xl lg:px-10 lg:py-10">
        {/* agent id */}
        <div className="flex gap-y-2 justify-start items-start w-full">
          <dt className="flex justify-between items-start w-64 text-gray-800">
            Agent ID <span className="font-bold">:</span>
          </dt>
          <dd className="flex gap-x-3 items-center px-2 ml-4 w-full rounded-lg bg-slate-50">
            <span className="font-bold">{profileData.agentId}</span>
            <button
              className="px-2 h-6 text-base rounded-lg border-none outline-none flex-center text-yellow"
              onClick={() => copyToClipboard(profileData.agentId)}
            >
              {isCopied ? <CheckCheck size={18} /> : <Files size={18} />}
            </button>
          </dd>
        </div>

        {/* company logo */}
        <div className="flex gap-y-2 justify-start items-start w-full">
          <dt className="flex justify-between items-start w-64 text-gray-800">
            Company Logo <span className="font-bold">:</span>
          </dt>
          <dd className="flex gap-x-3 items-center ml-4 w-full rounded-lg">
            <div className="overflow-hidden relative w-16 h-16 rounded-2xl border-2 border-yellow">
              <PreviewImageComponent imagePath={profileData.companyLogo} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="absolute top-1 right-1 p-1 bg-white rounded-full border-none ring-0 shadow-md outline-none h-fit">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-28">
                  <DropdownMenuItem
                    onClick={() => handlePreviewImage(profileData.companyLogo)}
                  >
                    <Eye className="mr-2 w-5 h-5 text-blue-600" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDownloadImage(profileData.companyLogo)}
                  >
                    <Download className="mr-2 w-5 h-5 text-green-600" />
                    Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </dd>
        </div>

        {/* company name */}
        <div className="flex gap-y-2 justify-start items-start w-full">
          <dt className="flex justify-between items-start w-64 text-gray-800">
            Company Name <span className="font-bold">:</span>
          </dt>
          <dd className="flex flex-col gap-x-3 items-start px-2 ml-4 w-full rounded-lg bg-slate-50">
            <span className="line-clamp-1">{profileData.companyName}</span>
            <NeedHelpToolTip content="Contact Support to Change Company Name" />
          </dd>
        </div>

        {/* Company Registration Card */}
        <div className="flex gap-y-2 justify-start items-start w-full">
          <dt className="flex justify-between items-start w-64 text-gray-800">
            Registration Card <span className="font-bold">:</span>
          </dt>
          <dd className="flex gap-x-3 items-center ml-4 w-full rounded-lg">
            <div className="overflow-hidden relative w-16 h-16 rounded-2xl border-2 border-yellow">
              <PreviewImageComponent
                imagePath={profileData.commercialLicense}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="absolute top-1 right-1 p-1 bg-white rounded-full border-none ring-0 shadow-md outline-none h-fit">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-28">
                  <DropdownMenuItem
                    onClick={() =>
                      handlePreviewImage(profileData.commercialLicense)
                    }
                  >
                    <Eye className="mr-2 w-5 h-5 text-blue-600" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleDownloadImage(profileData.commercialLicense)
                    }
                  >
                    <Download className="mr-2 w-5 h-5 text-green-600" />
                    Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <NeedHelpToolTip content="Contact Support to Change Company Registration Card" />
          </dd>
        </div>

        {/* expiry date */}
        <div className="flex gap-y-2 justify-start items-start w-full">
          <dt className="flex justify-between items-start w-64 text-gray-800">
            Expiry Date <span className="font-bold">:</span>
          </dt>
          <dd className="flex gap-x-3 items-center px-2 ml-4 w-full rounded-lg bg-slate-50">
            {new Date(profileData.expireDate).toLocaleDateString()}
          </dd>
        </div>

        {/* email */}
        <div className="flex gap-y-2 justify-start items-start w-full max-w-full">
          <dt className="flex justify-between items-start w-64 text-gray-800">
            Email <span className="font-bold">:</span>
          </dt>
          <dd className="flex flex-col gap-x-3 items-start px-2 ml-4 w-full rounded-lg bg-slate-50">
            <span className="w-full max-w-full text-base line-clamp-1">
              {userData?.emailId}
            </span>
            <NeedHelpToolTip content="Contact Support to Change Company Email" />
          </dd>
        </div>

        {/* phone number */}
        <div className="flex gap-y-2 justify-start items-start w-full">
          <dt className="flex justify-between items-start w-64 text-gray-800">
            Phone Number <span className="font-bold">:</span>
          </dt>
          <dd className="flex gap-x-3 items-center px-2 ml-4 w-full rounded-lg bg-slate-50">
            <span className="text-base">
              +{userData?.countryCode} {userData?.phoneNumber}
            </span>
          </dd>
        </div>

        {/* registration number */}
        <div className="flex gap-y-2 justify-start items-start w-full">
          <dt className="flex justify-between items-start w-64 text-gray-800">
            Registration Number
            <span className="font-bold">:</span>
          </dt>
          <dd className="flex gap-x-3 items-center px-2 ml-4 w-full text-base rounded-lg bg-slate-50">
            {profileData.regNumber}
          </dd>
        </div>

        {/* registration number */}
        <div className="flex gap-y-2 justify-start items-start w-full">
          <dt className="flex justify-between items-start w-64 text-gray-800">
            Company Address
            <span className="font-bold">:</span>
          </dt>
          <dd className="flex gap-x-3 items-center px-2 ml-4 w-full text-base rounded-lg bg-slate-50">
            {profileData.companyAddress || "N/A"}
          </dd>
        </div>
        {/* registration number */}
        <div className="flex gap-y-2 justify-start items-start w-full">
          <dt className="flex justify-between items-start w-64 text-gray-800">
            Languages
            <span className="font-bold">:</span>
          </dt>
          <dd className="flex gap-x-3 items-center px-2 ml-4 w-full text-base rounded-lg bg-slate-50">
            {profileData.companyLanguages.length === 0
              ? "N/A"
              : profileData.companyLanguages.join(", ")}
          </dd>
        </div>

        {/* password */}
        <div className="flex gap-y-2 justify-start items-start w-full">
          <dt className="flex justify-between items-start w-64 text-gray-800">
            Password <span className="font-bold">:</span>
          </dt>
          <dd className="flex flex-col gap-x-3 items-start px-2 ml-4 w-full rounded-lg bg-slate-50">
            <span className="font-bold">{"**********"}</span>
            <Link
              to={"/reset-password"}
              className="ml-auto text-base text-blue-600 w-fit"
            >
              Reset password?
            </Link>
          </dd>
        </div>

        <div className="mt-3 flex-between">
          <div className="gap-x-4 mr-6 flex-center">
            <SupportModal classes="text-blue-500 w-fit flex-center gap-x-2" />
          </div>
        </div>
      </dl>

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          imagePath={previewImage}
          setSelectedImage={setPreviewImage} // Close modal function
        />
      )}
    </section>
  );
}
