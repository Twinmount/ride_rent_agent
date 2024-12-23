import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { CustomerListTable } from "@/components/table/CustomerListTable";
import { Link, useNavigate } from "react-router-dom";
import { fetchCustomerList } from "@/api/srm/trips";
import { CustomerListColumns } from "@/components/table/columns/CustomerListColumn";
import BannedUserPopup from "@/components/modal/srm-modal/BannedUserPopup";
import { SortDropdown } from "@/components/SortDropdown";
import { Plus } from "lucide-react";
import Search from "@/components/Search";

export default function CustomerListPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState<10 | 15 | 20 | 30>(10);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["customerList", page, limit, search, sortOrder],
    queryFn: () =>
      fetchCustomerList({
        page,
        limit,
        sortOrder,
        search,
      }),
    staleTime: 0,
  });

  const handleViewDetails = (userId: string) => {
    navigate(`/customerDetails/${userId}`);
  };

  const customerData = data?.result?.list || [];

  const totalNumberOfPages = data?.result?.totalNumberOfPages || 0;

  return (
    <section className="container py-5 mx-auto min-h-screen md:py-7">
      <h1 className="text-center h3-bold max-sm:text-xl sm:text-left">
        Customer List
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
              <b>brand, registration number, customer name</b>
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

      <BannedUserPopup
        isOpen={false}
        onClose={() => {}}
        customerName="John Doe"
        passportNumber="A12345678"
        drivingLicenseNumber="DL987654321"
        phoneNumber="+1234567890"
        customerStatus="Blacklisted"
      />

      <CustomerListTable
        columns={CustomerListColumns(handleViewDetails)}
        data={customerData}
        loading={isLoading}
      />

      {totalNumberOfPages > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalNumberOfPages}
        />
      )}
    </section>
  );
}
