import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPortfolioStats, fetchEnquiriesStats } from '@/api/dashboard'
import { format, startOfMonth, endOfDay } from 'date-fns'
import DashboardSkelton from '@/components/loading-skelton/DashboardSkelton'

const AgentDashboard: React.FC = () => {
  // Calculate start and end dates for the current month
  const currentDate = new Date()
  const startOfMonthDate = startOfMonth(currentDate)
  const endOfDayDate = endOfDay(currentDate)

  const dateStartRange = format(startOfMonthDate, 'yyyy-MM-dd')
  const dateEndRange = format(endOfDayDate, 'yyyy-MM-dd')

  // Fetch all-time stats
  const { data: portfolioData, isLoading: isPortfolioLoading } = useQuery({
    queryKey: ['portfolioStats'],
    queryFn: () => fetchPortfolioStats(),
  })

  const { data: enquiriesData, isLoading: isEnquiriesLoading } = useQuery({
    queryKey: ['enquiriesStats'],
    queryFn: () => fetchEnquiriesStats(),
  })

  // Fetch current month stats
  const { data: monthlyPortfolioData, isLoading: isMonthlyPortfolioLoading } =
    useQuery({
      queryKey: ['monthlyPortfolioStats', dateStartRange, dateEndRange],
      queryFn: () => fetchPortfolioStats(dateStartRange, dateEndRange),
    })

  const { data: monthlyEnquiriesData, isLoading: isMonthlyEnquiriesLoading } =
    useQuery({
      queryKey: ['monthlyEnquiriesStats', dateStartRange, dateEndRange],
      queryFn: () => fetchEnquiriesStats(dateStartRange, dateEndRange),
    })

  return (
    <section className="h-auto min-h-screen p-6 py-10 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="mb-6 text-2xl font-bold">Agent Dashboard</h2>

        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
          {/* Total Portfolio Views */}
          <div className="p-4 text-center bg-white rounded-lg shadow">
            {isPortfolioLoading ? (
              <DashboardSkelton />
            ) : (
              <>
                <p className="text-lg font-semibold">Total portfolio views</p>
                <p className="text-4xl font-bold text-[#FFB347] mt-2">
                  {portfolioData?.result.count}
                </p>
              </>
            )}
          </div>

          {/* Total Enquiries */}
          <div className="p-4 text-center bg-white rounded-lg shadow">
            {isEnquiriesLoading ? (
              <DashboardSkelton />
            ) : (
              <>
                <p className="text-lg font-semibold">Total enquiries</p>
                <p className="text-4xl font-bold text-[#FFB347] mt-2">
                  {enquiriesData?.result.count}
                </p>
              </>
            )}
          </div>

          {/* Monthly Portfolio Views */}
          <div className="p-4 text-center bg-white rounded-lg shadow">
            {isMonthlyPortfolioLoading ? (
              <DashboardSkelton />
            ) : (
              <>
                <p className="text-lg font-semibold">Monthly portfolio views</p>
                <p className="text-4xl font-bold text-[#FFB347] mt-2">
                  {monthlyPortfolioData?.result.count}
                </p>
              </>
            )}
          </div>

          {/* Monthly Enquiries */}
          <div className="p-4 text-center bg-white rounded-lg shadow">
            {isMonthlyEnquiriesLoading ? (
              <DashboardSkelton />
            ) : (
              <>
                <p className="text-lg font-semibold">Monthly Enquiries</p>
                <p className="text-4xl font-bold text-[#FFB347] mt-2">
                  {monthlyEnquiriesData?.result.count}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="p-4 text-center text-white bg-black rounded-lg shadow">
          <p className="text-lg font-semibold text-yellow">
            Listings are boosted!
          </p>
          <p className="text-sm">
            Your fleet is now receiving more visibility.
          </p>
          <p className="mt-2 text-4xl font-bold text-yellow">
            Your Free Boost is active now
          </p>
        </div>
      </div>
    </section>
  )
}

export default AgentDashboard
