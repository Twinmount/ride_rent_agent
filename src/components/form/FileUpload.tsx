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
import { Button } from '@/components/ui/button'
import { Image, Trash2, Upload } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { validateFileSize, validateImageDimensions } from '@/helpers/form'

type FileUploadProps = {
  name: string
  label: string
  multiple?: boolean
  existingFiles?: (File | string)[]
  description: string
  maxSizeMB?: number
  maxWidth?: number
  maxHeight?: number
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  multiple = false,
  existingFiles = [],
  description,
  maxSizeMB = 1,
  maxWidth = 1920,
  maxHeight = 1920,
}) => {
  const { control, setValue, clearErrors } = useFormContext()
  const [files, setFiles] = useState<(File | string)[]>(existingFiles)

  useEffect(() => {
    setValue(name, files)
  }, [files, setValue, name])
  const handleFilesChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let selectedFiles = Array.from(event.target.files || [])
    const newFiles: (File | string)[] = []

    // Determine the remaining upload capacity based on the current files
    const remainingLimit = getMaxCount() - files.length

    // If selected files exceed the remaining limit, slice the array to fit the limit
    if (selectedFiles.length > remainingLimit) {
      selectedFiles = selectedFiles.slice(0, remainingLimit)
      toast({
        variant: 'destructive',
        title: 'File limit exceeded',
        description: `You can only upload a maximum of ${getMaxCount()} files.`,
      })
    }

    for (const file of selectedFiles) {
      if (!validateFileSize(file, maxSizeMB)) {
        toast({
          variant: 'destructive',
          title: 'Invalid file size',
          description: `File ${file.name} exceeds the size limit of ${maxSizeMB}MB`,
        })
        continue
      }

      if (!(await validateImageDimensions(file, maxWidth, maxHeight))) {
        toast({
          variant: 'destructive',
          title: 'Invalid file dimensions',
          description: `File ${file.name} exceeds the dimension limit of ${maxWidth}x${maxHeight}`,
        })
        continue
      }

      newFiles.push(file)
    }

    // Update the state with the newly added files
    if (newFiles.length > 0) {
      clearErrors(name)
      setFiles((prevFiles) => {
        // Combine the new files with the previously selected ones
        const combinedFiles = [...prevFiles, ...newFiles]
        // Ensure we don't exceed the maximum count
        return combinedFiles.slice(0, getMaxCount())
      })
    }
  }
  const handleDeleteFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const isInputDisabled = () => {
    if (name === 'vehiclePhotos') {
      return files.length >= 8
    } else if (name === 'commercialLicenses') {
      return files.length >= 2
    }
    return false
  }

  const getMaxCount = () => {
    if (name === 'vehiclePhotos') return 8
    if (name === 'commercialLicenses') return 2
    return 0
  }

  return (
    <FormItem className="flex w-full mb-2 max-sm:flex-col">
      <FormLabel className="flex justify-between mt-4 ml-2 text-base w-72 lg:text-lg">
        {label} <span className="mr-5 max-sm:hidden">:</span>
      </FormLabel>
      <div className="flex-col items-start w-full">
        <FormControl>
          <div className="relative w-full">
            <Controller
              name={name}
              control={control}
              render={() => (
                <>
                  <Input
                    type="file"
                    accept={'image/*'}
                    multiple={multiple}
                    onChange={handleFilesChange}
                    className="hidden"
                    id={`file-upload-${name}`}
                    disabled={isInputDisabled()}
                  />
                  <div className="grid grid-cols-4 gap-2 mt-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className={`relative w-16 h-16 overflow-hidden rounded-lg`}
                      >
                        <img
                          src={
                            typeof file === 'string'
                              ? file
                              : URL.createObjectURL(file)
                          }
                          alt={`file-${index}`}
                          className="object-cover w-full h-full"
                        />

                        <Button
                          type="button"
                          onClick={() => handleDeleteFile(index)}
                          className="absolute top-0 right-0 w-6 h-6 p-1 text-red-500 bg-white rounded-full hover:bg-red-600 hover:text-white"
                          aria-label={`delete file`}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                    {Array.from({ length: getMaxCount() - files.length }).map(
                      (_, index) =>
                        index === 0 ? (
                          <label
                            key={`placeholder-${index}`}
                            htmlFor={`file-upload-${name}`}
                            className="flex flex-col items-center justify-center w-16 h-16 border rounded-lg cursor-pointer bg-gray-50"
                          >
                            <Upload size={24} className="text-yellow" />
                            <span className="text-sm text-yellow">upload</span>
                          </label>
                        ) : (
                          <div
                            key={`placeholder-${index}`}
                            className="flex items-center justify-center w-16 h-16 bg-gray-100 border rounded-lg"
                          >
                            <Image size={24} className="text-gray-300" />
                          </div>
                        )
                    )}
                  </div>
                </>
              )}
            />
          </div>
        </FormControl>
        <FormDescription className="ml-2">{description}</FormDescription>
        <FormMessage />
      </div>
    </FormItem>
  )
}

export default FileUpload
