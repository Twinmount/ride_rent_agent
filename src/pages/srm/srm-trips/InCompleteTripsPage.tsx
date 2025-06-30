import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { SortDropdown } from "@/components/SortDropdown";

import { InCompleteTripsColumn } from "@/components/table/columns/InCompleteTripsColumn";
import { fetchSRMBookings } from "@/api/srm/trips";
import Search from "@/components/Search";
import { BookingStatus } from "@/types/srm-types";
import { useCompany } from "@/hooks/useCompany";
import { GenericTable } from "@/components/table/GenericTable";
import PageWrapper from "@/components/PageWrapper";

export default function InCompletedTripsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState<10 | 15 | 20 | 30>(10);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const { companyId, isCompanyLoading } = useCompany();

  const { data, isLoading } = useQuery({
    queryKey: ["incomplete-trips", page, limit, search, sortOrder],
    queryFn: () =>
      fetchSRMBookings({
        page,
        limit,
        sortOrder,
        search,
        bookingStatus: BookingStatus.INCOMPLETE,
        companyId,
      }),
    staleTime: 0,
    enabled: !!companyId && !isCompanyLoading,
  });

  const tripData = data?.result?.list || [];

  const totalNumberOfPages = data?.result?.totalNumberOfPages || 0;

  return (
    <PageWrapper
      heading="Incomplete Trips"
      subheading="Trips that are incomplete"
    >
      <div className="flex flex-wrap gap-x-2 justify-start items-start mt-3 mb-4 w-full max-sm:mt-3">
        {/* search vehicle */}
        <Search
          search={search}
          setSearch={setSearch}
          placeholder="Search Trip..."
          description={
            <p className=" italic text-gray-600">
              You can search with{" "}
              <b>
                brand, registration number, customer name, passport, license and
                phone number
              </b>
            </p>
          }
        />

        <SortDropdown
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
      </div>

      <GenericTable
        columns={InCompleteTripsColumn()}
        data={tripData}
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
