import { CheckCheck, Files } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import { useQuery } from '@tanstack/react-query'
import { getCompany } from '@/api/company'
import { load, StorageKeys } from '@/utils/storage'
import { DecodedRefreshToken } from '@/layout/ProtectedRoutes'
import { jwtDecode } from 'jwt-decode'
import { getUser } from '@/api/user'
import LazyLoader from '@/components/loading-skelton/LazyLoader'

export default function ProfilePage() {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 3000)
      },
      (err) => {
        console.error('Could not copy text: ', err)
      }
    )
  }

  const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN)

  const { userId } = jwtDecode<DecodedRefreshToken>(refreshToken as string)

  // Query to get company data
  const { data: companyData, isLoading: isCompanyLoading } = useQuery({
    queryKey: ['company'],
    queryFn: () => getCompany(userId),
  })

  // Query to get user data
  const { data: agentData, isLoading: isAgentLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUser,
  })

  if (isCompanyLoading || isAgentLoading) {
    return (
      <section className="w-full min-h-screen bg-white flex-center">
        <LazyLoader />
      </section>
    )
  }

  const profileData = companyData?.result
  const userData = agentData?.result

  if (!profileData) {
    return (
      <section className="min-h-screen flex-center">
        <p>No company data found.</p>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex-center">
      <dl className="flex flex-col max-w-4xl p-3 text-lg bg-white shadow-md gap-y-3 md:text-xl lg:px-10 lg:py-10 rounded-xl">
        {/* agent id */}
        <div className="flex items-center">
          <dt className="font-semibold w-44 flex-between">
            Agent ID <span className="mr-2">:</span>
          </dt>
          <dd className="flex items-center ml-4 gap-x-3">
            <span className="font-bold">{profileData.agentId}</span>
            <button
              className="h-6 px-2 text-base border-none rounded-lg outline-none flex-center text-yellow"
              onClick={() => copyToClipboard(userId)}
            >
              {isCopied ? <CheckCheck size={18} /> : <Files size={18} />}
            </button>
          </dd>
        </div>

        {/* company logo */}
        <div className="flex items-center">
          <dt className="font-semibold w-44 flex-between">
            Company Logo <span className="mr-2">:</span>
          </dt>
          <dd className="flex items-center ml-4 gap-x-3">
            <div className="w-12 h-12 overflow-hidden border-2 rounded-full border-yellow">
              <img
                src={profileData.companyLogo}
                className="object-cover w-full h-full"
                alt="company profile"
              />
            </div>
          </dd>
        </div>

        {/* company name */}
        <div className="flex items-center">
          <dt className="font-semibold w-44 flex-between">
            Company Name <span className="mr-2">:</span>
          </dt>
          <dd className="flex items-center ml-4 gap-x-3">
            {profileData.companyName}
          </dd>
        </div>

        {/* Company Registration Card */}
        <div className="flex items-center">
          <dt className="font-semibold w-44 flex-between">
            Registration Card <span className="mr-2">:</span>
          </dt>
          <dd className="flex items-center ml-4 gap-x-3">
            <div className="w-12 h-12 overflow-hidden border-2 rounded-full border-yellow">
              <img
                src={profileData.commercialLicense}
                className="object-cover w-full h-full"
                alt="company profile"
              />
            </div>
            <Link
              className="text-sm text-blue-500 hover:underline"
              to={profileData.commercialLicense}
              target="_blank"
            >
              Preview ?
            </Link>
          </dd>
        </div>

        {/* expiry date */}
        <div className="flex items-center">
          <dt className="font-semibold w-44 flex-between">
            Expiry Date <span className="mr-2">:</span>
          </dt>
          <dd className="flex items-center ml-4 text-base gap-x-3">
            {new Date(profileData.expireDate).toLocaleDateString()}
          </dd>
        </div>

        {/* email */}
        <div className="flex items-start">
          <dt className="font-semibold w-44 flex-between">
            Email<span className="mr-2">:</span>
          </dt>
          <dd className="flex flex-col ml-4 gap-x-3">
            <span className="text-base ">{userData?.emailId}</span>
            {/* <Link to={'/'} className="text-base text-blue-600">
              Change email?
            </Link> */}
          </dd>
        </div>

        {/* phone number */}
        <div className="flex items-start">
          <dt className="font-semibold w-44 flex-between">
            Phone Number<span className="mr-2">:</span>
          </dt>
          <dd className="flex flex-col ml-4 gap-x-3">
            <span className="text-base ">
              +{userData?.countryCode} {userData?.phoneNumber}
            </span>
          </dd>
        </div>

        {/* registration number */}
        <div className="flex items-center">
          <dt className="font-semibold w-44 flex-between">
            Registration Number <span className="mr-2">:</span>
          </dt>
          <dd className="flex items-center ml-4 gap-x-3">
            {profileData.regNumber}
          </dd>
        </div>

        {/* password */}
        <div className="flex items-center">
          <dt className="font-semibold w-44 flex-between">
            Password<span className="mr-2">:</span>
          </dt>
          <dd className="flex items-center ml-4 gap-x-3">
            <span className="font-bold">{'**********'}</span>
            <Link to={'/reset-password'} className="text-base text-blue-600 ">
              Reset password?
            </Link>
          </dd>
        </div>

        <div className="mt-3 flex-between">
          {/* delete account */}
          {/* <Link to={'/'} className="text-red-500 w-fit">
            Delete account?
          </Link> */}

          {/* edit profile */}
          <Link to={'/help'} className="text-blue-500 w-fit">
            Edit profile?
          </Link>
        </div>
      </dl>
    </section>
  )
}
