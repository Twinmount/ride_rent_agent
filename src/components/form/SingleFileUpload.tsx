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
import { Download, Eye, Upload, X } from 'lucide-react'
import { validateFileSize } from '@/helpers/form'
import { toast } from '@/components/ui/use-toast'
import ImagePreviewModal from '../modal/ImagePreviewModal'

type SingleFileUploadProps = {
  name: string
  label: string
  description: React.ReactNode
  maxSizeMB?: number
  existingFile?: string | null
  isDisabled?: boolean
}

const SingleFileUpload: React.FC<SingleFileUploadProps> = ({
  name,
  label,
  description,
  maxSizeMB = 5,
  existingFile = null,
  isDisabled = false,
}) => {
  const { control, setValue, clearErrors } = useFormContext()
  const [previewURL, setPreviewURL] = useState<string | null>(existingFile)
  const [selectedImage, setSelectedImage] = useState<string | null>(null) // To track the image for modal preview
  const [isDeleted, setIsDeleted] = useState(false) // Track if the file is deleted

  useEffect(() => {
    // Set the preview to the existing URL only if no new file has been selected and the file has not been deleted
    if (!previewURL && existingFile && !isDeleted) {
      setPreviewURL(existingFile) // Set the existing file URL as preview
      setValue(name, existingFile) // Store the existing URL as the form value (initial state)
    }
  }, [existingFile, setValue, name, previewURL, isDeleted])

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

      // Set preview for the new file and store the file in form state
      setPreviewURL(URL.createObjectURL(file)) // Set the new file preview
      setValue(name, file) // Set the new file in the form state
      clearErrors(name)

      // Reset the input to allow re-uploading the same file after deletion
      event.target.value = ''
    }
  }

  const handleDeleteImage = () => {
    if (previewURL) {
      // If the preview is a blob, revoke the object URL to free up memory
      if (previewURL.startsWith('blob:')) {
        URL.revokeObjectURL(previewURL)
      }
      // Clear the preview and form state
      setPreviewURL(null)
      setValue(name, null)
      setIsDeleted(true) // Set the deletion flag to prevent re-setting the file
    }
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
        <FormLabel className="flex justify-between w-64 mt-4 ml-2 text-base max-sm:w-fit lg:text-lg">
          {label} <span className="mr-5 max-sm:hidden">:</span>
        </FormLabel>
        <div className="flex-col items-start w-full">
          <FormControl>
            <Controller
              name={name}
              control={control}
              render={() => (
                <>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e)} // Handle file change logic here
                    className="hidden"
                    id={`file-upload-${name}`}
                    disabled={isDisabled}
                  />
                  <div className="flex items-center gap-4 mt-2">
                    {previewURL ? (
                      <div className="relative w-24 group/box">
                        <img
                          src={previewURL} // Show the preview image, either from the URL or new file
                          alt="Preview"
                          className="object-cover w-full h-24 rounded-md"
                        />
                        <div className="absolute top-0 bottom-0 left-0 right-0 space-x-2 ">
                          {!isDisabled && (
                            <button
                              type="button"
                              className="absolute p-1 bg-white rounded-full shadow-md h-fit right-1 top-1"
                              onClick={handleDeleteImage}
                              disabled={isDisabled}
                            >
                              <X className="w-5 h-5 text-red-600" />
                            </button>
                          )}

                          <div className="absolute left-0 right-0 flex items-center justify-around bottom-1 h-fit">
                            {/* Preview Button */}
                            {typeof previewURL === 'string' && (
                              <button
                                type="button"
                                className="hidden p-1 bg-white rounded-full shadow-md h-fit group-hover/box:block"
                                onClick={() => setSelectedImage(previewURL)}
                              >
                                <Eye className="w-5 h-5 text-green-500" />
                              </button>
                            )}

                            {/* Download Button (only for string files) */}
                            {typeof previewURL === 'string' && (
                              <a
                                href={previewURL} // Add the file URL here
                                onClick={(e) => handleDownload(e)} // Open the image in a new tab
                                className="hidden p-1 bg-white rounded-full shadow-md h-fit group-hover/box:block"
                                target="_blank" // Optional: Ensure it's opened in a new tab by default
                                rel="noopener noreferrer"
                                aria-label="download file"
                              >
                                <Download className="w-5 h-5 text-blue-500" />
                              </a>
                            )}
                          </div>
                        </div>
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

      {selectedImage && (
        <ImagePreviewModal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </>
  )
}

export default SingleFileUpload
