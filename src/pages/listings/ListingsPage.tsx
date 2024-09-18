import { useState } from 'react'
import ListedVehicles from '@/components/common/ListedVehicles'
import { useQuery } from '@tanstack/react-query'
import Pagination from '@/components/Pagination'
import { load, StorageKeys } from '@/utils/storage'
import { jwtDecode } from 'jwt-decode'
import { DecodedRefreshToken } from '@/layout/ProtectedRoutes'
import { fetchAllVehicles } from '@/api/vehicle'
import { getCompany } from '@/api/company'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'

export default function ListingsPage() {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  let limit: 10 | 15 | 20 | 30 | 50 = 10
  let sortOrder: 'ASC' | 'DESC' = 'ASC'

  let userId = load<string>(StorageKeys.USER_ID)

  // If not found, decode from refresh token
  if (!userId) {
    const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN)
    if (refreshToken) {
      try {
        const decodedRefreshToken = jwtDecode<DecodedRefreshToken>(
          refreshToken as string
        )
        userId = decodedRefreshToken?.userId
      } catch (error) {
        console.error('Error decoding the refresh token', error)
        toast({
          variant: 'destructive',
          title: 'Invalid token! Login to continue',
        })
        navigate('/login', { replace: true })
        return null
      }
    }
  }

  // Fetch company data based on userId
  const { data: companyData, isLoading: isCompanyLoading } = useQuery({
    queryKey: ['company'],
    queryFn: () => getCompany(userId as string),
    enabled: !!userId,
  })

  const companyId = companyData?.result?.companyId

  // Fetch vehicles if userId is present
  const { data, isLoading } = useQuery({
    queryKey: ['vehicles', page, limit, sortOrder],
    queryFn: () =>
      fetchAllVehicles({
        page,
        limit,
        sortOrder,
        userId: userId as string,
      }),
    enabled: !!userId,
    refetchOnWindowFocus: 'always',
  })

  // Redirect to login page if userId or companyId is not available
  if (!userId || !companyId) {
    toast({
      variant: 'destructive',
      title: 'Unauthorized! Login to continue',
    })
    navigate('/login', { replace: true })
    return null
  }

  return (
    <section className="h-auto min-h-screen p-3 pt-8 lg:p-6">
      <div className="flex mb-5 max-md:flex-col flex-between">
        <div className="flex flex-col items-start justify-center">
          <h2 className="text-3xl font-bold ">Your Listed Vehicles</h2>
        </div>
      </div>

      {/* Listed Vehicles */}
      <ListedVehicles
        vehicles={data?.result.list || []}
        isLoading={isLoading || isCompanyLoading}
        userId={userId}
        companyId={companyId as string}
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
