import { useState } from "react";
import ListedVehicles from "@/components/ListedVehicles";
import Pagination from "@/components/Pagination";
import VehicleFilters from "@/components/VehicleFilters";
import { ApprovalStatusTypes } from "@/types/types";
import Search from "@/components/Search";
import { useCompany } from "@/hooks/useCompany";
import { useVehicles } from "./ListingPage.hooks";
import { Link } from "react-router-dom";

export default function ListingsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<{
    approvalStatus: ApprovalStatusTypes;
  }>({
    approvalStatus: "ALL",
  });

  // accessing userId, companyId, and isCompanyLoading from useCompany hook
  const { userId, isCompanyLoading } = useCompany();

  // Fetch vehicles if userId is present
  const { data, isLoading, isRefetching } = useVehicles({
    page,
    filter: filters.approvalStatus,
    limit: 15,
    userId,
  });

  const vehicles = data?.result.list || [];

  const totalNumberOfPages = data?.result.totalNumberOfPages || 0;

  return (
    <section className="p-3 pt-8 h-auto min-h-screen lg:p-6">
      <div className="flex mb-10 max-md:mb-6 max-md:flex-col flex-between">
        <div className="flex flex-col justify-center items-start">
          <h2 className="fixed top-[4.8rem] left-0 pl-10 lg:pl-64 bg-white/20 backdrop-blur-lg  z-30   text-2xl lg:text-3xl font-bold w-full h-14 flex items-center">
            Your Listed Vehicles
          </h2>
        </div>
      </div>

      <div className="flex justify-between gap-2 items-start ">
        {/* search vehicle */}
        <Search
          search={search}
          setSearch={setSearch}
          placeholder="Search model..."
        />
        {vehicles.length > 0 && (
          <Link
            to={`/listings/add/${userId}`}
            className="max-sm:hidden md:mr-4 lg:mr-8 flex-center bg-yellow text-white py-2 whitespace-nowrap w-32 min-w-32 font-semibold rounded-2xl hover:scale-[1.02] transition-all"
          >
            List Vehicle +
          </Link>
        )}
      </div>

      {/* filters */}
      <VehicleFilters filters={filters} setFilters={setFilters} />

      {/* Listed Vehicles */}
      <ListedVehicles
        vehicles={vehicles || []}
        isLoading={isLoading || isCompanyLoading || isRefetching}
        search={search}
        userId={userId as string}
      />

      {totalNumberOfPages > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalNumberOfPages}
        />
      )}

      {/* mobile floating add vehicle button */}
      <Link
        to={`/listings/add/${userId}`}
        className="sm:hidden fixed bottom-12 right-8 flex-center bg-yellow z-30 text-white py-2 whitespace-nowrap w-32 min-w-32 font-semibold rounded-2xl hover:scale-[1.02] transition-all shadow-lg"
      >
        List Vehicle +
      </Link>
    </section>
  );
}
