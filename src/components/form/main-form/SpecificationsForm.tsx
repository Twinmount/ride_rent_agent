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
import SpecificationDropdown from '../SpecificationDropdown'
import { useVehicleIdentifiers } from '@/hooks/useVehicleIdentifiers'
import {
  addSpecifications,
  getLevelsFilled,
  getSpecificationFormData,
  getSpecificationFormFieldData,
  updateSpecifications,
} from '@/api/vehicle'
import FormSkelton from '@/components/loading-skelton/FormSkelton'
import Spinner from '@/components/general/Spinner'
import { toast } from '@/components/ui/use-toast'
import { load, StorageKeys } from '@/utils/storage'
import { jwtDecode } from 'jwt-decode'
import { formatSpecifications } from '@/helpers/form'
import { SpecificationFormData } from '@/types/API-types'

type SpecificationFormType = Record<string, string | null>

type SpecificationFormProps = {
  type: 'Add' | 'Update'
  onNextTab?: () => void
}

export default function SpecificationsForm({
  type,
  onNextTab,
}: SpecificationFormProps) {
  const { vehicleId, vehicleCategoryId } = useVehicleIdentifiers(type)

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
    type === 'Add' || (type === 'Update' && (levelsFilled ?? 1) < 3)

  // useQuery for fetching form data, now relying on levelsFilled
  const { data, isLoading } = useQuery({
    queryKey: [
      isAddOrIncomplete
        ? 'specification-form-data'
        : 'specification-update-form-data',
      vehicleCategoryId,
      vehicleId,
    ],
    queryFn: async () => {
      if (isAddOrIncomplete) {
        const data = await getSpecificationFormFieldData({
          vehicleCategoryId: vehicleCategoryId as string,
        })
        return {
          ...data,
          result: data.result.list,
        }
      } else {
        return await getSpecificationFormData(vehicleId)
      }
    },
    enabled: !!vehicleId && (!!vehicleCategoryId || levelsFilled < 3),
  })

  console.log('specificationFormData ', data)

  const initialValues = {}

  const form = useForm<SpecificationFormType>({
    defaultValues: initialValues,
  })

  async function onSubmit(values: SpecificationFormType) {
    console.log('Form Submitted:', values)

    // Transform data.result to match SpecificationFormData[]
    const transformedData = (data?.result || []).map((spec) => ({
      ...spec,
      values: spec.values.map((value) => ({
        ...value,
        _id: '',
      })),
    })) as SpecificationFormData[]

    // Format the data as per the backend requirement
    const specs = formatSpecifications(values, transformedData)

    console.log('Final specs object:', specs)

    const refreshToken = load<string>(StorageKeys.REFRESH_TOKEN)
    const { userId } = jwtDecode<{ userId: string }>(refreshToken as string)

    const requestBody = {
      specs,
      userId,
      vehicleId,
      vehicleCategoryId: vehicleCategoryId as string,
    }

    try {
      let response
      if (type === 'Add') {
        response = await addSpecifications(requestBody)
        console.log('response ', response)
      } else if (type === 'Update') {
        response = await updateSpecifications({
          specs,
          vehicleId: vehicleId as string,
        })
      }

      if (response) {
        toast({
          title: `Specifications ${type.toLowerCase()}ed successfully`,
          className: 'bg-yellow text-white',
        })

        queryClient.invalidateQueries({
          queryKey: ['primary-details-form'],
          exact: true,
        })
        if (isAddOrIncomplete && onNextTab) {
          onNextTab()
        }
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: `${type} Specifications failed`,
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
          {fields.length > 0 ? (
            fields.map((spec) => (
              <FormField
                key={spec.id}
                control={form.control}
                name={spec.name}
                render={({ field }) => {
                  // selecting the default value for Update case.
                  const selectedOption = spec.values.find(
                    (
                      option
                    ): option is {
                      name: string
                      label: string
                      selected: boolean
                    } => 'selected' in option && option.selected
                  )
                  return (
                    <FormItem className="flex w-full mb-2 max-sm:flex-col">
                      <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
                        {spec.name}
                        <span className="mr-5 max-sm:hidden">:</span>
                      </FormLabel>
                      <div className="flex-col items-start w-full">
                        <FormControl>
                          <SpecificationDropdown
                            onChangeHandler={field.onChange}
                            value={field.value || selectedOption?.name || ''}
                            options={spec.values.map((value) => ({
                              label: value.label,
                              value: value.name,
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
            <p>No specifications found for this category.</p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="w-full md:w-10/12 lg:w-8/12 mx-auto flex-center col-span-2 mt-3 !text-lg !font-semibold button bg-yellow hover:bg-darkYellow"
        >
          {type === 'Add' ? 'Add Specifications' : 'Update Specifications'}
          {form.formState.isSubmitting && <Spinner />}
        </Button>
      </form>
    </Form>
  )
}
