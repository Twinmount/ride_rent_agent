import React from 'react'
import { Upload, Image } from 'lucide-react'
import Spinner from './general/Spinner'
import { toast } from './ui/use-toast'

type ImagePlaceholderProps = {
  index: number
  name: string
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void // Add onFileChange prop for upload
  isUploading?: boolean // New prop to indicate if the placeholder is showing an upload progress
  labelForVehiclePhotos?: string

  uploadingCount: number // Keep track of how many images are uploading
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  index,
  name,
  onFileChange,
  isUploading = false, // Default to false if not provided
  labelForVehiclePhotos = 'upload',
  uploadingCount, // This tracks how many images are currently uploading
}) => {
  // If the current index is less than the number of images being uploaded, show spinner
  if (index < uploadingCount) {
    return (
      <div
        key={`placeholder-${index}`}
        className="relative flex items-center justify-center w-16 h-16 bg-gray-100 border rounded-lg"
      >
        <Spinner color="text-yellow" additionalClass="mr-2" />
      </div>
    )
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) {
      toast({
        title: 'Upload in Progress',
        description: 'Please wait while the current images are uploading.',
      })
    } else {
      onFileChange && onFileChange(event)
    }
  }

  // For vehiclePhotos, the first available placeholder after uploading should act as the file upload input
  if (index === uploadingCount) {
    return (
      <label
        key={`placeholder-${index}`}
        htmlFor={`file-upload-${name}`}
        className={`relative flex flex-col items-center justify-center w-16 h-16 border rounded-lg cursor-pointer bg-gray-50 ${
          isUploading ? 'cursor-default' : 'cursor-pointer'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          id={`file-upload-${name}`}
          className="hidden"
          multiple={true}
          onChange={handleInputChange}
          disabled={isUploading}
        />
        <Upload
          size={24}
          className={` ${isUploading ? 'text-gray-300' : 'text-yellow'}`}
        />
        <span
          className={`text-sm  ${
            isUploading ? 'text-gray-300' : 'text-yellow'
          }`}
        >
          {labelForVehiclePhotos}
        </span>
      </label>
    )
  }

  // For the rest of the placeholders, render default empty placeholder
  return (
    <div
      key={`placeholder-${index}`}
      className="relative flex items-center justify-center w-16 h-16 bg-gray-100 border rounded-lg"
    >
      <Image size={24} className="text-gray-300" />
    </div>
  )
}

export default ImagePlaceholder
