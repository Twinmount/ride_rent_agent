import LazyLoader from "@/components/loading-skelton/LazyLoader";
import { useCompanyCountry } from "@/hooks/useCompanyCountry";
import { Building2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProtectedPage({ userId }: { userId: string }) {
  const { data: countryData, isLoading } = useCompanyCountry(userId);

  if (isLoading) {
    return <LazyLoader />;
  }

  let isIndia = countryData?.result === "India";

  return (
    <section
      className="flex flex-col items-center py-8 px-4 "
      style={{ minHeight: "calc(100vh - 5.3rem" }}
    >
      {/* Heading Section */}
      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Your account has been created.
        </h1>
        <p className="text-gray-600">
          Register your company to add your vehicles and get access for this
          page.
        </p>
      </div>

      {/* Card Section */}
      <div
        className={`grid gap-6 w-full max-w-6xl ${
          isIndia ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* Company Registration Card */}
        <div className="w-full max-w-[500px] p-6 bg-white rounded-xl flex flex-col h-full m-auto">
          <div className="relative w-20 h-20 rounded-full bg-yellow flex items-center justify-center mx-auto">
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

            <Link
              to="/register/company-details"
              className="flex items-center justify-center w-full p-3 mt-2 font-semibold text-white bg-yellow hover:bg-yellow rounded-xl"
            >
              ADD YOUR COMPANY{" "}
              <Plus size={20} strokeWidth={3} className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Individual Registration Card (Only for India) */}
        {isIndia && (
          <div className="w-full max-w-[500px] p-6 bg-white rounded-xl flex flex-col h-full m-auto">
            <div className="relative w-20 h-20 rounded-full bg-yellow flex items-center justify-center mx-auto">
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
