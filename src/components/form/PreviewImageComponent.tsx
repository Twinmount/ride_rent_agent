import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../ui/use-toast";

type PreviewImageComponentProps = {
  imagePath: string;
};

const PreviewImageComponent: React.FC<PreviewImageComponentProps> = ({
  imagePath,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const appCountry = localStorage.getItem("appCountry") || "uae";
        const apiBaseUrl =
          appCountry === "in"
            ? import.meta.env.VITE_API_URL_INDIA
            : import.meta.env.VITE_API_URL_UAE;
        // Construct the full URL for the image stream
        const url = `${apiBaseUrl}/file/stream?path=${imagePath}`;

        // Fetch the image stream from the backend API
        const response = await fetch(url);
        const reader = response.body?.getReader();

        if (!reader) {
          throw new Error("Failed to get reader from stream");
        }

        let chunks: Uint8Array[] = [];
        const stream = new ReadableStream({
          async start(controller) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                break;
              }
              controller.enqueue(value);
              chunks.push(value);
            }
          },
        });

        const blob = await new Response(stream).blob();
        const objectURL = URL.createObjectURL(blob);
        setImageSrc(objectURL);
      } catch (error) {
        toast({ variant: "destructive", title: "Image load failed" });
        console.error("Error fetching image:", error);
      } finally {
        setLoading(false);
      }
    };

    if (imagePath) {
      fetchImage();
    }
  }, [imagePath]);

  return (
    <>
      {loading ? (
        <div className="relative flex items-center justify-center w-24 h-24 !cursor-wait">
          <Skeleton className="w-full h-full bg-gray-400 !cursor-wait rounded-xl" />
        </div>
      ) : imageSrc ? (
        <div className="w-full h-24 overflow-hidden border rounded-md">
          <img
            src={imageSrc as string}
            alt="Preview"
            className="object-cover w-full h-full rounded-md "
          />
        </div>
      ) : null}
    </>
  );
};

export default PreviewImageComponent;
