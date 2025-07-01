import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { fetchCustomerList } from "@/api/srm/trips";
import { CustomerListColumns } from "@/components/table/columns/CustomerListColumn";
import { SortDropdown } from "@/components/SortDropdown";
import Search from "@/components/Search";
import { GenericTable } from "@/components/table/GenericTable";
import LinkButton from "@/components/common/LinkButton";
import PageWrapper from "@/components/PageWrapper";
import ExcelDownloadDialog from "@/components/ExcelDownloadDialog";
import { Slug } from "@/api/Api-Endpoints";

export default function ManageSRMCustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");

  const LIMIT = 8;

  const { data, isLoading } = useQuery({
    queryKey: ["customerList", page, search, sortOrder],
    queryFn: () =>
      fetchCustomerList({
        page,
        limit: LIMIT,
        sortOrder,
        search,
      }),
    staleTime: 0,
  });

  const customerData = data?.result?.list || [];

  const totalNumberOfPages = data?.result?.totalNumberOfPages || 0;

  return (
    <PageWrapper heading="Customer List">
      <div className="flex flex-wrap gap-x-2 justify-start items-start mt-3 mb-4 w-full max-sm:mt-3">
        {/* search vehicle */}
        <Search
          search={search}
          setSearch={setSearch}
          placeholder="Search Trip..."
          description={
            <p className=" italic text-gray-600">
              You can search with{" "}
              <b>customer name, phone, passport and driving license</b>
            </p>
          }
        />

        <LinkButton label="New Trip" link="/srm/trips/new" />

        <ExcelDownloadDialog
          label="Download Customers"
          slug={Slug.GET_SRM_CUSTOMERS_EXCEL}
          fileName="customers.xlsx"
          filters={{ dateRange: true, sortOrder: true }}
          variant="icon"
        />

        <SortDropdown
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          isLoading={isLoading}
        />
      </div>

      <GenericTable
        columns={CustomerListColumns()}
        data={customerData}
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
