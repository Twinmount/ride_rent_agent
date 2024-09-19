import Navbar from '@/components/general/Navbar'
import Sidebar from '@/components/general/Sidebar'
import MainWrapper from '@/components/general/MainWrapper'
import { Navigate, Outlet } from 'react-router-dom'
import { getCompany } from '@/api/company'
import { useQuery } from '@tanstack/react-query'
import { load, remove, StorageKeys } from '@/utils/storage'
import { DecodedRefreshToken } from './ProtectedRoutes'
import { jwtDecode } from 'jwt-decode'
import LazyLoader from '@/components/loading-skelton/LazyLoader'
import ProtectedPage from '@/pages/general/ProtectedPage'
import ApprovalStatusPage from '@/pages/general/ApprovalStatusPage'
import ScrollToTop from '@/helpers/ScrollToTop'

export default function Layout() {
  const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN)

  if (!refreshToken) {
    remove(StorageKeys.ACCESS_TOKEN)
    remove(StorageKeys.REFRESH_TOKEN)
    return <Navigate to={'/login'} replace />
  }

  const decodedData = jwtDecode<DecodedRefreshToken>(refreshToken as string)

  const { data, isLoading } = useQuery({
    queryKey: ['company'],
    queryFn: () => getCompany(decodedData.userId),
  })

  return (
    <>
      <Navbar />
      <Sidebar />
      <MainWrapper>
        <ScrollToTop />
        {isLoading ? (
          <LazyLoader />
        ) : !data?.result ? (
          <ProtectedPage />
        ) : data.result.approvalStatus === 'REJECTED' ? (
          <ApprovalStatusPage
            status="REJECTED"
            rejectionReason={data?.result.rejectionReason}
          />
        ) : (
          <Outlet />
        )}
      </MainWrapper>
    </>
  )
}
