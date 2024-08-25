import React, { useState, useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Upload, X } from 'lucide-react'
import { validateFileSize, validateImageDimensions } from '@/helpers/form'
import { toast } from '@/components/ui/use-toast'

type SingleFileUploadProps = {
  name: string
  label: string
  description: string
  maxSizeMB?: number
  maxWidth?: number
  maxHeight?: number
  existingFile?: string | null
  isDisabled?: boolean
}

const SingleFileUpload: React.FC<SingleFileUploadProps> = ({
  name,
  label,
  description,
  maxSizeMB = 1,
  maxWidth = 1000,
  maxHeight = 1000,
  existingFile = null,
  isDisabled = false,
}) => {
  const { control, setValue, clearErrors } = useFormContext()
  const [previewURL, setPreviewURL] = useState<string | null>(existingFile)

  useEffect(() => {
    if (existingFile) {
      setValue(name, existingFile)
    }
  }, [existingFile, setValue, name])

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!validateFileSize(file, maxSizeMB)) {
        toast({
          variant: 'destructive',
          title: 'Invalid file size',
          description: `File ${file.name} exceeds the size limit of ${maxSizeMB}MB`,
        })
        return
      }

      if (!(await validateImageDimensions(file, maxWidth, maxHeight))) {
        toast({
          variant: 'destructive',
          title: 'Invalid file dimensions',
          description: `File ${file.name} exceeds the dimension limit of ${maxWidth}x${maxHeight}`,
        })
        return
      }

      // Store the file object in the form state
      setPreviewURL(URL.createObjectURL(file))
      setValue(name, file) // Set the file directly in the form state
      clearErrors(name)
    }
  }

  const handleDeleteImage = () => {
    setPreviewURL(null)
    setValue(name, null) // Clear the file from the form state
  }

  return (
    <FormItem className="flex w-full mb-2 max-sm:flex-col">
      <FormLabel className="flex justify-between mt-4 ml-2 text-base max-sm:w-fit w-72 lg:text-lg">
        {label} <span className="mr-5 max-sm:hidden">:</span>
      </FormLabel>
      <div className="flex-col items-start w-full">
        <FormControl>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <>
                <Input
                  type="file"
                  onChange={(e) => {
                    handleFileChange(e)
                    field.onChange(e)
                  }}
                  className="hidden"
                  id={`file-upload-${name}`}
                  disabled={isDisabled}
                />
                <div className="flex items-center gap-4 mt-2">
                  {previewURL ? (
                    <div className="relative">
                      <img
                        src={previewURL}
                        alt="Preview"
                        className="object-contain w-full h-24 rounded-md"
                      />
                      {!isDisabled && (
                        <button
                          type="button"
                          className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md"
                          onClick={handleDeleteImage}
                          disabled={isDisabled}
                        >
                          <X className="w-5 h-5 text-red-600" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <label
                      htmlFor={`file-upload-${name}`}
                      className="w-full cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-full h-16 gap-2 border rounded-lg bg-gray-50">
                        <span
                          className={`text-lg ${
                            isDisabled ? 'opacity-40' : 'text-yellow'
                          }`}
                        >
                          Upload
                        </span>
                        <Upload
                          size={24}
                          className={`${
                            isDisabled ? 'opacity-30' : 'text-yellow'
                          }`}
                        />
                      </div>
                    </label>
                  )}
                </div>
              </>
            )}
          />
        </FormControl>
        <FormDescription>{description}</FormDescription>
        <FormMessage />
      </div>
    </FormItem>
  )
}

export default SingleFileUpload
