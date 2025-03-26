import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { SortDropdown } from "@/components/SortDropdown";
import { fetchVehicleList } from "@/api/srm/trips";

import { VehicleListColumns } from "@/components/table/columns/VehicleListColumns";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import Search from "@/components/Search";
import { GenericTable } from "@/components/table/GenericTable";

export default function VehicleListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const LIMIT = 8;

  const { data, isLoading } = useQuery({
    queryKey: ["vehicleList", page, search, sortOrder],
    queryFn: () =>
      fetchVehicleList({
        page,
        limit: LIMIT,
        sortOrder,
        search,
      }),
    staleTime: 0,
  });

  const vehicleData = data?.result?.list || [];

  const totalNumberOfPages = data?.result?.totalNumberOfPages || 0;

  return (
    <section className="container py-5 mx-auto min-h-screen md:py-7">
      <h1 className="text-center h3-bold max-sm:text-xl sm:text-left">
        Vehicle List
      </h1>
      <div className="flex flex-wrap gap-x-2 justify-start items-start mt-3 mb-4 w-full max-sm:mt-3">
        {/* search vehicle */}
        <Search
          search={search}
          setSearch={setSearch}
          placeholder="Search Trip..."
          description={
            <p className=" italic text-gray-600">
              You can search with <b>brand and registration number</b>
            </p>
          }
        />

        <Link
          to="/srm/trips/new"
          className="group px-3 h-10 bg-white flex gap-x-2 items-center rounded-lg shadow-lg transition-colors duration-300 ease-in-out flex-center text-yellow hover:bg-yellow hover:text-white"
          aria-label="add new record"
        >
          <span className="text-gray-800 transition-colors group-hover:text-white">
            New Trip
          </span>{" "}
          <Plus />
        </Link>

        <SortDropdown
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
      </div>

      <GenericTable
        columns={VehicleListColumns}
        data={vehicleData}
        loading={isLoading}
      />

      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalNumberOfPages}
      />
    </section>
  );
}
