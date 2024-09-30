import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { getSingleImage } from '@/api/file-upload'
import { Skeleton } from '../ui/skeleton'

type ImagePreviewModalProps = {
  imagePath: string // The path to the image
  setSelectedImage: (value: null) => void // Function to close modal
}

export default function ImagePreviewModal({
  imagePath,
  setSelectedImage,
}: ImagePreviewModalProps) {
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchImagePreviewURL = async (filePath: string) => {
      try {
        const imageResponse = await getSingleImage(filePath)
        setPreviewURL(imageResponse.result.url) // Set the preview URL for modal
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to fetch image.',
        })
      } finally {
        setIsLoading(false) // End loading state
      }
    }

    if (imagePath) {
      fetchImagePreviewURL(imagePath)
    }
  }, [imagePath])

  return (
    <Dialog
      open={!!imagePath}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedImage(null) // Close modal on dialog close
        }
      }}
    >
      <DialogContent className="max-w-[700px] w-full max-sm:w-[95%] mx-auto !rounded-3xl">
        <DialogTitle className="text-lg font-semibold text-center">
          Image Preview
        </DialogTitle>
        <DialogDescription aria-label="Preview of the selected image" />
        <DialogHeader className="w-full max-w-full overflow-hidden">
          <div className="w-full h-auto max-h-[400px] min-h-80 rounded-lg flex-center overflow-hidden">
            {isLoading ? (
              <Skeleton className="w-full h-full bg-gray-300 !cursor-wait rounded-xl" />
            ) : previewURL ? (
              <img
                src={previewURL}
                alt="image preview"
                className="object-contain w-full h-auto max-w-full max-h-full"
              />
            ) : (
              <p className="text-red-500">Failed to load image preview.</p>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
