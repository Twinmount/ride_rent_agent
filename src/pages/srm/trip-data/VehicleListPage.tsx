import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { SortDropdown } from "@/components/SortDropdown";
import { LimitDropdown } from "@/components/LimitDropdown";
import { fetchVehicleList } from "@/api/srm/trips";
import { VehicleListTable } from "@/components/table/VehicleListTable";
import { VehicleListColumns } from "@/components/table/columns/VehicleListColumns";

export default function VehicleListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  const { data, isLoading } = useQuery({
    queryKey: ["vehicleList", page, limit],
    queryFn: () =>
      fetchVehicleList({
        page,
        limit,
        sortOrder,
      }),
    staleTime: 0,
  });

  return (
    <section className="container py-5 mx-auto min-h-screen md:py-7">
      <h1 className="text-center h3-bold max-sm:text-xl sm:text-left">
        Vehicle List
      </h1>
      <div className="flex gap-x-2 justify-end mb-4 w-full max-sm:mt-3">
        <SortDropdown
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
        <LimitDropdown
          limit={limit}
          setLimit={setLimit}
          isLoading={isLoading}
        />
      </div>

      <VehicleListTable
        columns={VehicleListColumns}
        data={data?.result?.list || []}
        loading={isLoading}
      />

      {data?.result && data?.result.totalNumberOfPages > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages}
        />
      )}
    </section>
  );
}
