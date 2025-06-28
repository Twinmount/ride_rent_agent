import SRMCustomerDetailsForm from "@/components/form/srm-form/CustomerDetailsForm";

export default function PublicCustomerDetailsPage() {
  return (
    <div className="container py-6 pb-10 h-auto min-h-screen bg-slate-50">
      <div className="gap-x-4 mb-5 ml-2 flex flex-col items-start w-fit">
        <h1 className="text-center h3-bold sm:text-left">Customer Details</h1>
        <h2 className="font-medium text-gray-600">
          (Form is valid only for 2 hours)
        </h2>
      </div>
      <SRMCustomerDetailsForm type="Add" isPublic={true} />
    </div>
  );
}
