import { CircleArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { lazy, Suspense, useState } from 'react'
import LazyLoader from '@/components/loading-skelton/LazyLoader'
import { validateTabAccess } from '@/helpers/form'
import { TabsTypes } from '@/types/types'
import { toast } from '@/components/ui/use-toast'

// Lazy-loaded components
const PrimaryDetailsForm = lazy(
  () => import('@/components/form/main-form/PrimaryDetailsForm')
)
const SpecificationsForm = lazy(
  () => import('@/components/form/main-form/SpecificationsForm')
)
const FeaturesForm = lazy(
  () => import('@/components/form/main-form/FeaturesForm')
)

export default function VehiclesFormAddPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabsTypes>('primary')
  const [levelsFilled, setLevelsFilled] = useState<number>(0) // Default starting level

  // Handle tab change based on levelsFilled state
  const handleTabChange = (value: string) => {
    const tab = value as TabsTypes
    const { canAccess, message } = validateTabAccess({ tab, levelsFilled })

    if (canAccess) {
      setActiveTab(tab)
    } else {
      toast({
        title: 'Access Restricted',
        description: message,
        className: 'bg-orange text-white',
      })
    }
  }

  // Handle moving to the next tab and update levelsFilled state
  const handleNextTab = (nextTab: TabsTypes) => {
    setActiveTab(nextTab)

    // Update levelsFilled based on the next tab
    if (nextTab === 'specifications' && levelsFilled < 1) {
      setLevelsFilled(1) // Update to reflect PrimaryDetailsForm completion
    } else if (nextTab === 'features' && levelsFilled < 2) {
      setLevelsFilled(2) // Update to reflect SpecificationsForm completion
    }
  }

  return (
    <section className="container h-auto min-h-screen py-10 bg-white">
      <div className="mb-5 ml-5 flex-center w-fit gap-x-4">
        <button
          onClick={() => navigate(-1)}
          className="transition-colors border-none outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold max-sm:text-xl sm:text-left">
          Manually Add New Vehicle
        </h1>
      </div>

      <div>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full bg-white flex-center gap-x-2">
            <TabsTrigger
              value="primary"
              className="h-9 max-sm:text-sm max-sm:px-2"
            >
              Primary Details
            </TabsTrigger>

            <TabsTrigger value="specifications" className="max-sm:px-2">
              Specifications
            </TabsTrigger>

            <TabsTrigger value="features" className="max-sm:px-2">
              Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="primary" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              <PrimaryDetailsForm
                type="Add"
                onNextTab={() => handleNextTab('specifications')}
              />
            </Suspense>
          </TabsContent>
          <TabsContent value="specifications" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              <SpecificationsForm
                type={'Add'}
                onNextTab={() => handleNextTab('features')}
                isAddOrIncomplete={true}
              />
            </Suspense>
          </TabsContent>
          <TabsContent value="features" className="flex-center">
            <Suspense fallback={<LazyLoader />}>
              <FeaturesForm type={'Add'} isAddOrIncomplete={true} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
