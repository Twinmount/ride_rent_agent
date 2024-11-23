import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "@/components/Pagination";
import { CustomerListTable } from "@/components/table/CustomerListTable";
import { useNavigate } from "react-router-dom";
import { fetchCustomerList } from "@/api/srm/trips";
import { CustomerListColumns } from "@/components/table/columns/CustomerListColumn";

export default function CustomerListPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<10 | 15 | 20 | 30>(10);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["customerList", page, limit],
    queryFn: () =>
      fetchCustomerList({
        page,
        limit,
        sortOrder,
      }),
    staleTime: 0,
  });

  const handleViewDetails = (userId: string) => {
    navigate(`/customerDetails/${userId}`);
  };

  return (
    <section className="container py-5 mx-auto min-h-screen md:py-7">
      <h1 className="text-center h3-bold max-sm:text-xl sm:text-left">
        Customer List
      </h1>

      <CustomerListTable
        columns={CustomerListColumns(handleViewDetails)}
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
