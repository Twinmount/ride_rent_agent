import React from 'react'
import { Upload, Image } from 'lucide-react'

type ImagePlaceholderProps = {
  index: number
  name: string
  labelForVehiclePhotos?: string
  labelForCommercialLicensesFront?: string
  labelForCommercialLicensesBack?: string
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  index,
  name,
  labelForVehiclePhotos = 'upload',
  labelForCommercialLicensesFront = 'front',
  labelForCommercialLicensesBack = 'back',
}) => {
  if (name === 'commercialLicenses') {
    // Show 'front' and 'back' for commercial licenses
    const labelText =
      index === 0
        ? labelForCommercialLicensesFront
        : labelForCommercialLicensesBack
    return (
      <label
        key={`placeholder-${index}`}
        htmlFor={`file-upload-${name}`}
        className="flex flex-col items-center justify-center w-16 h-16 border rounded-lg cursor-pointer bg-gray-50"
      >
        <Upload size={24} className="text-yellow" />
        <span className="text-sm text-yellow">{labelText}</span>
      </label>
    )
  }

  // Default for vehiclePhotos and other types
  return index === 0 ? (
    <label
      key={`placeholder-${index}`}
      htmlFor={`file-upload-${name}`}
      className="flex flex-col items-center justify-center w-16 h-16 border rounded-lg cursor-pointer bg-gray-50"
    >
      <Upload size={24} className="text-yellow" />
      <span className="text-sm text-yellow">{labelForVehiclePhotos}</span>
    </label>
  ) : (
    <div
      key={`placeholder-${index}`}
      className="flex items-center justify-center w-16 h-16 bg-gray-100 border rounded-lg"
    >
      <Image size={24} className="text-gray-300" />
    </div>
  )
}

export default ImagePlaceholder
