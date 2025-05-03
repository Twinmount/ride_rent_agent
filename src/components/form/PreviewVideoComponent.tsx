import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../ui/use-toast";

type PreviewVideoComponentProps = {
  videoPath: string;
};

const PreviewVideoComponent: React.FC<PreviewVideoComponentProps> = ({
  videoPath,
}) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL;
        const url = `${apiBaseUrl}/file/stream?path=${videoPath}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch video");
        }

        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        setVideoUrl(objectURL);
      } catch (error) {
        toast({ variant: "destructive", title: "Video preview load failed" });
        console.error("Error loading video:", error);
      } finally {
        setLoading(false);
      }
    };

    if (videoPath) {
      fetchVideo();
    }
  }, [videoPath]);

  return (
    <>
      {loading ? (
        <div className="relative flex items-center justify-center w-40 h-24">
          <Skeleton className="w-full h-full bg-gray-400 rounded-xl" />
        </div>
      ) : videoUrl ? (
        <div className="w-full h-24 overflow-hidden border rounded-md">
          <video
            src={videoUrl}
            muted
            playsInline
            preload="metadata"
            className="object-cover w-full h-full rounded-md"
            onLoadedMetadata={(e) => {
              // Pause immediately after loading metadata to show only the first frame
              (e.target as HTMLVideoElement).currentTime = 0.1;
            }}
            onCanPlay={(e) => {
              (e.target as HTMLVideoElement).pause();
            }}
          />
        </div>
      ) : null}
    </>
  );
};

export default PreviewVideoComponent;
