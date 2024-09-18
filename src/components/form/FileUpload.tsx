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
import { Download, Eye, Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { validateFileSize } from '@/helpers/form'
import ImagePreviewModal from '../modal/ImagePreviewModal'
import ImagePlaceholder from '../ImagePlaceholder'

type FileUploadProps = {
  name: string
  label: string
  multiple?: boolean
  existingFiles?: (File | string)[]
  description: string
  maxSizeMB?: number
}

const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  multiple = false,
  existingFiles = [],
  description,
  maxSizeMB = 15,
}) => {
  const { control, setValue, clearErrors } = useFormContext()
  const [files, setFiles] = useState<(File | string)[]>(existingFiles)
  const [selectedImage, setSelectedImage] = useState<File | string | null>(null) // Track selected image

  useEffect(() => {
    setValue(name, files)
  }, [files, setValue, name])

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(file))
        }
      })
    }
  }, [files])

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

    // Reset the file input to allow reselection of the same file
    event.target.value = ''
  }

  const handleDeleteFile = (index: number) => {
    setFiles((prevFiles) => {
      const fileToRemove = prevFiles[index]

      // If the file is a File object, revoke the object URL to free up memory
      if (fileToRemove instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(fileToRemove))
      }

      return prevFiles.filter((_, i) => i !== index)
    })
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

  const handleDownload = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault() // Prevent default anchor behavior
    const url = e.currentTarget.href // Get the URL from the anchor's href
    window.open(url, '_blank') // Open the image in a new tab
  }

  return (
    <>
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

                          {/* Delete Button */}
                          <Button
                            type="button"
                            onClick={() => handleDeleteFile(index)}
                            className="absolute top-0 right-0 w-6 h-6 p-1 text-red-500 bg-white rounded-full hover:bg-red-600 hover:text-white"
                            aria-label={`delete file`}
                          >
                            <Trash2 size={16} />
                          </Button>

                          {/* Preview Button */}
                          <Button
                            type="button"
                            onClick={() => setSelectedImage(file)}
                            className="absolute bottom-0 left-0 w-6 h-6 p-1 text-green-500 bg-white rounded-full hover:bg-green-600 hover:text-white"
                            aria-label={`preview file`}
                          >
                            <Eye size={16} />
                          </Button>

                          {/* Download Button (only for string files) */}
                          {typeof file === 'string' && (
                            <a
                              href={file} // Add the file URL here
                              onClick={(e) => handleDownload(e)} // Open the image in a new tab
                              className="absolute bottom-0 right-0 w-6 h-6 p-1 text-blue-500 bg-white rounded-full hover:bg-blue-600 hover:text-white"
                              aria-label={`open file in new tab`}
                              target="_blank" // Optional: Ensure it's opened in a new tab by default
                              rel="noopener noreferrer"
                            >
                              <Download size={16} />
                            </a>
                          )}
                        </div>
                      ))}

                      {Array.from({ length: getMaxCount() - files.length }).map(
                        (_, index) => (
                          <ImagePlaceholder
                            key={index}
                            index={index}
                            name={name}
                            labelForVehiclePhotos="upload"
                            labelForCommercialLicensesFront="front"
                            labelForCommercialLicensesBack="back"
                          />
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

      {/* Image Preview Modal */}
      {selectedImage && (
        <ImagePreviewModal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </>
  )
}

export default FileUpload
