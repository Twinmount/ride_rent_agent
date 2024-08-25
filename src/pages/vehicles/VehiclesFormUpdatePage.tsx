import { CircleArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { lazy, Suspense, useState } from 'react'
import LazyLoader from '@/components/loading-skelton/LazyLoader'
import { useQuery } from '@tanstack/react-query'
import FormSkelton from '@/components/loading-skelton/FormSkelton'
import { getLevelsFilled, getPrimaryDetailsFormData } from '@/api/vehicle'
import { mapGetPrimaryFormToPrimaryFormType } from '@/helpers/form'
import { save, StorageKeys } from '@/utils/storage'

// Lazy-loaded components
const PrimaryDetailsForm = lazy(
  () => import('@/components/form/main-form/PrimaryDetailsForm')
)
const SpecificationsForm = lazy(
  () => import('@/components/form/main-form/SpecificationsForm')
)
const FeaturesDetailsForm = lazy(
  () => import('@/components/form/main-form/FeaturesForm')
)

type TabsTypes = 'primary' | 'specifications' | 'features'

export default function VehiclesFormUpdatePage() {
  const navigate = useNavigate()
  const { vehicleId } = useParams<{
    vehicleId: string
  }>()
  const [activeTab, setActiveTab] = useState<TabsTypes>('primary')

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabsTypes)
  }

  const { data, isLoading } = useQuery({
    queryKey: ['primary-details-form', vehicleId],
    queryFn: () => getPrimaryDetailsFormData(vehicleId as string),
  })

  // Fetch levelsFilled only if the type is "Update"
  const { data: levelsData } = useQuery({
    queryKey: ['getLevelsFilled', vehicleId],
    queryFn: () => getLevelsFilled(vehicleId as string),
    enabled: !!vehicleId,
  })

  const levelsFilled = levelsData
    ? parseInt(levelsData.result.levelsFilled, 10)
    : 1

  const formData = data ? mapGetPrimaryFormToPrimaryFormType(data.result) : null
  const countryCode = data?.result?.countryCode || ''
  const vehicleCategoryId = data?.result?.vehicleCategoryId

  // Store vehicleCategoryId in localStorage if levelsFilled < 3
  if (levelsFilled < 3 && vehicleCategoryId) {
    save(StorageKeys.CATEGORY_ID, vehicleCategoryId)
  }

  return (
    <section className="container h-auto min-h-screen pb-10 bg-white">
      <div className="mb-5 ml-5 flex-center w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold sm:text-left">
          New Update Details Page
        </h1>
      </div>

      <div>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="bg-white flex-center gap-x-4">
            <TabsTrigger value="primary">Primary Details</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>
          <TabsContent value="primary" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              {isLoading ? (
                <FormSkelton />
              ) : (
                <PrimaryDetailsForm
                  type="Update"
                  formData={formData}
                  initialCountryCode={countryCode}
                />
              )}
            </Suspense>
          </TabsContent>
          <TabsContent value="specifications" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              <SpecificationsForm type="Update" />
            </Suspense>
          </TabsContent>
          <TabsContent value="features" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              <FeaturesDetailsForm type="Update" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
