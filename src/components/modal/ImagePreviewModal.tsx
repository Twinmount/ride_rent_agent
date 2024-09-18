import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type ImagePreviewModalProps = {
  selectedImage: File | string
  setSelectedImage: (value: null) => void
}

export default function ImagePreviewModal({
  selectedImage,
  setSelectedImage,
}: ImagePreviewModalProps) {
  return (
    <Dialog
      open={!!selectedImage}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedImage(null)
        }
      }}
    >
      <DialogContent className="max-w-[700px] w-full max-sm:w-[95%] mx-auto !rounded-3xl">
        <DialogTitle className="text-lg font-semibold text-center">
          Image Preview
        </DialogTitle>
        <DialogDescription aria-label="Preview of the selected image" />
        <DialogHeader className="w-full max-w-full overflow-hidden">
          <div className="w-full h-full max-h-[450px] rounded-lg flex-center overflow-hidden">
            {typeof selectedImage === 'string' ? (
              <img
                src={selectedImage}
                alt="image preview"
                className="object-contain w-full h-auto max-w-full max-h-full"
              />
            ) : (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="image preview"
                className="object-contain w-full h-auto max-w-full max-h-full"
              />
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
