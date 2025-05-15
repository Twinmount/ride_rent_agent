import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { SortDropdown } from "@/components/SortDropdown";
import { fetchVehicleList } from "@/api/srm/trips";

import { VehicleListColumns } from "@/components/table/columns/VehicleListColumns";
import Search from "@/components/Search";
import { GenericTable } from "@/components/table/GenericTable";
import LinkButton from "@/components/common/LinkButton";
import PageWrapper from "@/components/PageWrapper";

export default function ManageVehiclePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const LIMIT = 8;

  const { data, isLoading } = useQuery({
    queryKey: ["srm-vehicles", page, search, sortOrder],
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
    <PageWrapper heading="Manage SRM Vehicles">
      <div className="flex flex-wrap gap-x-2 justify-start items-start mt-3 mb-4 w-full max-sm:mt-3">
        {/* search vehicle */}
        <Search
          search={search}
          setSearch={setSearch}
          placeholder="Search Vehicle..."
          description={
            <p className=" italic text-gray-600">
              You can search with <b>brand, model and registration number</b>
            </p>
          }
        />

        <LinkButton label="New Vehicle" link="/srm/manage-vehicles/add" />

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
    </PageWrapper>
  );
}
