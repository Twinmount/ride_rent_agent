import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { CustomerListTable } from "@/components/table/CustomerListTable";
import { Link } from "react-router-dom";
import { fetchCustomerList } from "@/api/srm/trips";
import { CustomerListColumns } from "@/components/table/columns/CustomerListColumn";
import { SortDropdown } from "@/components/SortDropdown";
import { Plus } from "lucide-react";
import Search from "@/components/Search";

export default function CustomerListPage() {
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
    <section className="container py-5 mx-auto min-h-screen md:py-7">
      <h1 className="text-center h3-bold max-sm:text-xl sm:text-left">
        Customers List
      </h1>

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

      <CustomerListTable
        columns={CustomerListColumns()}
        data={customerData}
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
