import * as React from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useQuery } from '@tanstack/react-query'
import { fetchAllBrands, fetchBrandById } from '@/api/brands'

type BrandsDropdownProps = {
  value?: string
  onChangeHandler?: (value: string) => void
  placeholder?: string
  isDisabled?: boolean
  vehicleCategoryId?: string
}

const BrandsDropdown = ({
  value,
  onChangeHandler,
  placeholder = 'brand',
  isDisabled = false,
  vehicleCategoryId,
}: BrandsDropdownProps) => {
  const [selectedValue, setSelectedValue] = React.useState<string>(value || '')
  const [searchTerm, setSearchTerm] = React.useState('')

  // Fetch brand by ID if value is provided
  const { data: specificBrandData, isLoading: isSpecificBrandLoading } =
    useQuery({
      queryKey: ['brand', value],
      queryFn: () => fetchBrandById(value as string),
      enabled: !!value, // Only run this query if value is provided
    })

  // Fetch brands by search term and category
  const {
    data: brandData,
    isLoading: isBrandsLoading,
    refetch,
  } = useQuery({
    queryKey: ['brands', vehicleCategoryId, searchTerm],
    queryFn: () =>
      fetchAllBrands({
        page: 1,
        limit: 20,
        sortOrder: 'ASC',
        vehicleCategoryId: vehicleCategoryId as string,
        search: searchTerm,
      }),
    enabled: !!vehicleCategoryId && searchTerm.length >= 3,
    staleTime: 0,
  })

  // Set the selected value based on the fetched specific brand
  React.useEffect(() => {
    if (specificBrandData && specificBrandData.result) {
      setSelectedValue(specificBrandData.result.id)
    }
  }, [specificBrandData])

  const handleSearch = async (query: string) => {
    setSearchTerm(query)
    if (query.length >= 3) {
      await refetch() // wait for refetch to complete
    }
  }

  const handleSelect = (currentValue: string) => {
    setSelectedValue(currentValue)
    if (onChangeHandler) onChangeHandler(currentValue)
  }

  const selectedBrandName = React.useMemo(() => {
    if (isSpecificBrandLoading) return 'Loading...'
    if (selectedValue && brandData?.result.list) {
      const brand = brandData.result.list.find(
        (brand) => brand.id === selectedValue
      )
      return brand?.brandName || `Choose ${placeholder}`
    }
    if (specificBrandData?.result) {
      return specificBrandData.result.brandName
    }
    return `Choose ${placeholder}`
  }, [
    selectedValue,
    brandData,
    specificBrandData,
    isSpecificBrandLoading,
    placeholder,
  ])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={isDisabled || !vehicleCategoryId}
          className="justify-between w-full font-normal"
        >
          {!vehicleCategoryId
            ? 'Choose a vehicle category first'
            : isBrandsLoading || isSpecificBrandLoading
            ? 'Loading brands...'
            : selectedBrandName}
          <ChevronDown className="w-6 h-6 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:!w-96 p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${placeholder}...`}
            onValueChange={handleSearch}
          />
          <CommandList>
            {searchTerm.length < 3 ? (
              <CommandEmpty>
                Please enter at least 3 letters to search brands.
              </CommandEmpty>
            ) : isBrandsLoading ? (
              <CommandEmpty>Searching for {searchTerm}...</CommandEmpty>
            ) : brandData?.result.list.length === 0 ? (
              <CommandEmpty>No {placeholder} found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {brandData &&
                  brandData.result.list.map((brand) => (
                    <CommandItem
                      key={brand.id}
                      value={brand.id}
                      onSelect={() => handleSelect(brand.id)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedValue === brand.id
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {brand.brandName}
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default BrandsDropdown
