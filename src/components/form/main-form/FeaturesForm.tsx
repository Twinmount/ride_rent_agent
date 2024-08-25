import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import MultiSelectDropdown from '../MultiSelectDropdown'
import { useVehicleIdentifiers } from '@/hooks/useVehicleIdentifiers'
import {
  addFeatures,
  getFeaturesFormData,
  getFeaturesFormFieldsData,
  getLevelsFilled,
  updateFeatures,
} from '@/api/vehicle'
import FormSkelton from '@/components/loading-skelton/FormSkelton'
import Spinner from '@/components/general/Spinner'
import { Accordion } from '@/components/ui/accordion'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui/use-toast'
import { load, StorageKeys } from '@/utils/storage'
import { jwtDecode } from 'jwt-decode'
import { formatFeatures } from '@/helpers/form'

type FeaturesFormType = Record<string, string[] | null>

type FeaturesFormProps = {
  type: 'Add' | 'Update'
}

export default function FeaturesForm({ type }: FeaturesFormProps) {
  const { vehicleId, vehicleCategoryId } = useVehicleIdentifiers(type)
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  // Fetch levelsFilled only if the type is "Update"
  const { data: levelsData } = useQuery({
    queryKey: ['getLevelsFilled', vehicleId],
    queryFn: () => getLevelsFilled(vehicleId as string),
    enabled: type === 'Update' && !!vehicleId,
  })

  const levelsFilled = levelsData
    ? parseInt(levelsData.result.levelsFilled, 10)
    : 1

  const isAddOrIncomplete =
    type === 'Add' || (type === 'Update' && levelsFilled < 3)

  const { data, isLoading } = useQuery({
    queryKey: [
      isAddOrIncomplete ? 'features-form-data' : 'features-update-form-data',
      vehicleCategoryId,
      vehicleId,
    ],
    queryFn: async () => {
      if (isAddOrIncomplete) {
        const data = await getFeaturesFormFieldsData({
          vehicleCategoryId: vehicleCategoryId as string,
        })
        return {
          ...data,
          result: data.result.list,
        }
      } else {
        return await getFeaturesFormData(vehicleId)
      }
    },
    enabled: !!vehicleId && (!!vehicleCategoryId || levelsFilled < 3),
  })

  const form = useForm<FeaturesFormType>({
    defaultValues: {},
  })

  async function onSubmit(values: FeaturesFormType) {
    console.log('Form Submitted:', values)

    // Extract user ID from the token
    const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN)
    const { userId } = jwtDecode<{ userId: string }>(refreshToken as string)

    // Prepare the features object for the request body
    const features = formatFeatures(values, data?.result || [])

    const requestBody = {
      features,
      userId,
      vehicleId: vehicleId as string,
      vehicleCategoryId: vehicleCategoryId as string,
    }

    try {
      let response
      if (type === 'Add') {
        response = await addFeatures(requestBody)
      } else if (type === 'Update') {
        response = await updateFeatures({ features, vehicleId })
      }
      console.log(response)
      if (response) {
        toast({
          title: `Features ${type.toLowerCase()}ed successfully`,
          className: 'bg-yellow text-white',
        })
        queryClient.invalidateQueries({
          queryKey: ['primary-details-form'],
          exact: true,
        })
        console.log('levels Filled: ', levelsFilled)
        navigate('/listings')
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: `${type} Features failed`,
        description: 'Something went wrong',
      })
    }
  }

  const fields = data?.result || []

  return isLoading ? (
    <FormSkelton />
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full gap-5 mx-auto bg-white rounded-3xl p-2 md:p-4 py-8 !pb-8"
      >
        <div className="flex flex-col gap-5 w-full max-w-full md:max-w-[800px] mx-auto">
          <Accordion type="single" collapsible>
            {fields.length > 0 ? (
              fields.map((feature, index) => (
                <FormField
                  key={feature.id}
                  control={form.control}
                  name={feature.name}
                  render={({ field }) => {
                    return (
                      <FormItem className="flex w-full mb-2 max-sm:flex-col">
                        <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                          {feature.name}
                          <span className="mr-5 max-sm:hidden">:</span>
                        </FormLabel>
                        <div className="flex-col items-start w-full">
                          <FormControl>
                            <MultiSelectDropdown
                              uniqueValue={index.toString()}
                              onChangeHandler={field.onChange}
                              value={field.value || []}
                              placeholder={feature.name}
                              options={feature.values.map((value) => ({
                                label: value.label,
                                name: value.name,
                                selected: value.selected as boolean, // Pass `selected` prop here
                              }))}
                            />
                          </FormControl>
                          <FormMessage className="ml-2" />
                        </div>
                      </FormItem>
                    )
                  }}
                />
              ))
            ) : (
              <p>No features found for this category.</p>
            )}
          </Accordion>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full md:w-10/12 lg:w-8/12 mx-auto flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
        >
          {type === 'Add' ? 'Add Features' : 'Update Features'}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  )
}
