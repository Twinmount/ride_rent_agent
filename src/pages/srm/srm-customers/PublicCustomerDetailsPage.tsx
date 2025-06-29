import SRMPublicCustomerDetailsForm from "@/components/form/srm-form/PublicCustomerDetailsForm";
import useGetSearchParams from "@/hooks/useGetSearchParams";

export default function PublicCustomerDetailsPage() {
  const token = useGetSearchParams("token");

  console.log("token : ", token);

  if (!token) {
    return (
      <div className="h-screen flex-center text-center text-red-500">
        Token not found. You can close this page
      </div>
    );
  }

  return (
    <div className="container py-6 pb-10 h-auto min-h-screen bg-slate-50">
      <div className="gap-x-4 mb-5 ml-2 flex flex-col items-start w-fit">
        <h1 className="text-center h3-bold sm:text-left">Customer Details</h1>
        <h2 className="font-medium text-gray-600">
          (Form is valid only for 2 hours)
        </h2>
      </div>

      <SRMPublicCustomerDetailsForm token={token} />
    </div>
  );
}
