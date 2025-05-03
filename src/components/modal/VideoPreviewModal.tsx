import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { getSingleImage } from "@/api/file-upload";
import { Skeleton } from "../ui/skeleton";

type VideoPreviewModalProps = {
  videoPath: string;
  setSelectedVideo: (value: null) => void;
};

export default function VideoPreviewModal({
  videoPath,
  setSelectedVideo,
}: VideoPreviewModalProps) {
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideoURL = async (filePath: string) => {
      try {
        const response = await getSingleImage(filePath);
        setVideoURL(response.result.url);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to fetch video.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (videoPath) {
      fetchVideoURL(videoPath);
    }
  }, [videoPath]);

  return (
    <Dialog
      open={!!videoPath}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedVideo(null);
        }
      }}
    >
      <DialogContent className="max-w-[800px] w-full max-sm:w-[95%] mx-auto !rounded-3xl">
        <DialogTitle className="text-lg font-semibold text-center">
          Video Preview
        </DialogTitle>
        <DialogDescription aria-label="Preview of the selected video" />
        <DialogHeader className="w-full max-w-full overflow-hidden">
          <div className="w-full h-auto max-h-[500px] min-h-80 rounded-lg flex-center overflow-hidden">
            {isLoading ? (
              <Skeleton className="w-full h-full bg-gray-300 !cursor-wait rounded-xl" />
            ) : videoURL ? (
              <video
                src={videoURL}
                controls
                className="w-full h-auto max-h-[500px] rounded-lg"
              />
            ) : (
              <p className="text-red-500">Failed to load video preview.</p>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
