import { getUser } from '@/api/user'
import CompanyForm from '@/components/form/main-form/CompanyForm'
import FormSkelton from '@/components/loading-skelton/FormSkelton'
import { useQuery } from '@tanstack/react-query'

export default function CompanyRegistration() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUser,
  })

  const { agentId } = data?.result || {}

  return (
    <section className="py-5 pt-10">
      <h1 className="text-3xl font-bold text-center">Company Details</h1>
      <h2 className="my-3 text-base text-center text-gray-500">
        Provide your company details to complete the registration
      </h2>
      {isLoading ? (
        <FormSkelton />
      ) : !data || isError ? (
        <div className="text-2xl font-semibold text-center text-red-500 mt-36">
          failed to fetch your agent id
        </div>
      ) : (
        <CompanyForm type="Add" agentId={agentId as string} />
      )}
    </section>
  )
}
