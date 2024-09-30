import { CheckCheck, Files, MoreVertical, Eye, Download } from 'lucide-react'
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
import SupportModal from '@/components/modal/SupportModal'
import PreviewImageComponent from '@/components/form/PreviewImageComponent'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'
import { downloadFileFromStream } from '@/helpers/form'
import ImagePreviewModal from '@/components/modal/ImagePreviewModal'

export default function ProfilePage() {
  const [isCopied, setIsCopied] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

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

  // Handle image download using the helper function
  const handleDownloadImage = async (filePath: string) => {
    try {
      await downloadFileFromStream(filePath, 'Registration Card')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: 'Unable to download the image. Please try again.',
      })
      console.error('Error downloading image:', error)
    }
  }

  // Handle image preview
  const handlePreviewImage = (filePath: string) => {
    setPreviewImage(filePath)
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
            <div className="relative w-16 h-16 overflow-hidden border-2 rounded-2xl border-yellow">
              <PreviewImageComponent imagePath={profileData.companyLogo} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="absolute p-1 bg-white border-none rounded-full shadow-md outline-none h-fit right-1 top-1 ring-0">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-28">
                  <DropdownMenuItem
                    onClick={() => handlePreviewImage(profileData.companyLogo)}
                  >
                    <Eye className="w-5 h-5 mr-2 text-blue-600" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDownloadImage(profileData.companyLogo)}
                  >
                    <Download className="w-5 h-5 mr-2 text-green-600" />
                    Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
            <div className="relative w-16 h-16 overflow-hidden border-2 rounded-2xl border-yellow">
              <PreviewImageComponent
                imagePath={profileData.commercialLicense}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="absolute p-1 bg-white border-none rounded-full shadow-md outline-none h-fit right-1 top-1 ring-0">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-28">
                  <DropdownMenuItem
                    onClick={() =>
                      handlePreviewImage(profileData.commercialLicense)
                    }
                  >
                    <Eye className="w-5 h-5 mr-2 text-blue-600" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleDownloadImage(profileData.commercialLicense)
                    }
                  >
                    <Download className="w-5 h-5 mr-2 text-green-600" />
                    Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
          <div className="mr-6 flex-center gap-x-4">
            <SupportModal classes="text-blue-500 w-fit flex-center gap-x-2" />
          </div>
        </div>
      </dl>

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          imagePath={previewImage}
          setSelectedImage={setPreviewImage} // Close modal function
        />
      )}
    </section>
  )
}
