import LazyLoader from "@/components/loading-skelton/LazyLoader";
import { useCompanyCountry } from "@/hooks/useCompanyCountry";
import { Building2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProtectedPage({ userId }: { userId: string }) {
  const { data: countryData, isLoading } = useCompanyCountry(userId)

  if (isLoading) {
    return <LazyLoader />;
  }

  let isIndia = countryData?.result === "India";

  return (
    <section className="flex justify-center items-center min-h-screen py-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-6xl p-4">
        {/* Company Registration Card */}
        <div className="w-full max-w-[500px] p-6 bg-white rounded-xl flex flex-col h-full">
          <div className="relative w-20 h-20 rounded-full bg-yellow flex-center mx-auto">
            <Building2 size={45} className="text-white" />
          </div>

          <div className="flex flex-col mt-4 text-center gap-y-4 flex-1">
            <div>
              <h2 className="text-2xl font-bold">
                {isIndia
                  ? "Register as a company"
                  : "Register your company now!"}
              </h2>
              {isIndia && (
                <p className="text-gray-500">
                  (Company with multiple vehicles to rent)
                </p>
              )}
            </div>
            <div>
              <p>
                Your account has been created. Register your company to add your
                vehicles and get access for this page!
              </p>
              <p>
                Click the button below to{" "}
                <span className="font-semibold text-yellow">
                  add your company
                </span>{" "}
                <br /> in just{" "}
                <span className="font-semibold text-yellow">one step!</span>
              </p>

              <Link
                to={`/register/company-details`}
                className="flex items-center justify-center w-full p-3 mt-2 font-semibold text-white bg-yellow hover:bg-yellow rounded-xl"
              >
                ADD YOUR COMPANY{" "}
                <Plus size={20} strokeWidth={3} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Individual Registration Card */}
        {isIndia && (
          <div className="w-full max-w-[500px] p-6 bg-white rounded-xl flex flex-col h-full">
            <div className="relative w-20 h-20 rounded-full bg-yellow flex-center mx-auto">
              <Building2 size={45} className="text-white" />
            </div>

            <div className="flex flex-col mt-4 text-center gap-y-4 flex-1">
              <div>
                <h2 className="text-2xl font-bold">
                  Register as an individual
                </h2>
                <p className="text-gray-500">
                  (Sole owner with one vehicle to rent)
                </p>
              </div>

              <div className="mt-auto pt-4">
                <Link
                  to="/register/individual-details"
                  className="flex items-center justify-center w-full p-3 font-semibold text-white bg-yellow hover:bg-yellow rounded-xl"
                >
                  LIST AS AN INDIVIDUAL{" "}
                  <Plus size={20} strokeWidth={3} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
