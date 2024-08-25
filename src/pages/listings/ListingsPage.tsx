import { useState } from 'react'
import ListedVehicles from '@/components/common/ListedVehicles'
import { useQuery } from '@tanstack/react-query'
import Pagination from '@/components/Pagination'
import { load, StorageKeys } from '@/utils/storage'
import { jwtDecode } from 'jwt-decode'
import { DecodedRefreshToken } from '@/layout/ProtectedRoutes'
import { fetchAllVehicles } from '@/api/vehicle'
import { getApprovalStatusDescription } from '@/helpers'
import ApprovalStatusDropdown from '@/components/ApprovalStatusDropdown'

type ApprovalStatusType = 'APPROVED' | 'UNDER_REVIEW' | 'REJECTED' | 'PENDING'

export default function ListingsPage() {
  const [page, setPage] = useState(1)
  const [approvalStatus, setApprovalStatus] =
    useState<ApprovalStatusType>('APPROVED')

  let limit: 10 | 15 | 20 | 30 | 50 = 10
  let sortOrder: 'ASC' | 'DESC' = 'ASC'

  // Accessing refresh token to get the userId
  const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN)
  const decodedRefreshToken = jwtDecode<DecodedRefreshToken>(
    refreshToken as string
  )
  const { userId } = decodedRefreshToken

  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', page, limit, sortOrder, approvalStatus],
    queryFn: () =>
      fetchAllVehicles({
        page,
        limit,
        sortOrder,
        userId,
        isModified: false,
        approvalStatus,
      }),
  })

  return (
    <section className="h-auto min-h-screen p-3 pt-8 lg:p-6">
      <div className="flex mb-5 max-md:flex-col flex-between">
        <div className="flex flex-col items-start justify-center">
          <h2 className="text-3xl font-bold ">Your Listed Vehicles</h2>
          <div className="px-1 mb-4 text-sm text-gray-500 text-start md:pr-10">
            {getApprovalStatusDescription(approvalStatus)}
          </div>
        </div>

        {/* Approval Status Dropdown */}
        <div className="flex justify-center mb-4 mr-5 max-md:justify-end max-md:ml-auto">
          <ApprovalStatusDropdown
            approvalStatus={approvalStatus}
            onStatusChange={setApprovalStatus}
          />
        </div>
      </div>

      {/* Descriptive Message */}

      {/* Listed Vehicles */}
      <ListedVehicles
        vehicles={data?.result.list || []}
        isLoading={isLoading}
      />

      {(data?.result.totalNumberOfPages as number) > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={data?.result.totalNumberOfPages as number}
        />
      )}
    </section>
  )
}
