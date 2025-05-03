import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Download, Eye, Trash2, MoreVertical } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { downloadFileFromStream, validateFileSize } from "@/helpers/form";
import { uploadMultipleFiles } from "@/api/file-upload";
import { GcsFilePaths } from "@/constants/enum";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import PreviewImageComponent from "../PreviewImageComponent";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import ImagePreviewModal from "@/components/modal/ImagePreviewModal";
import VideoPreviewModal from "@/components/modal/VideoPreviewModal";
import PreviewVideoComponent from "../PreviewVideoComponent";

type MultipleFileUploadProps = {
  name: string;
  label: string;
  existingFiles?: string[];
  description: React.ReactNode;
  maxSizeMB?: number;
  maxVideoSizeMB?: number;
  isFileUploading?: boolean;
  setIsFileUploading?: (isUploading: boolean) => void;
  bucketFilePath: GcsFilePaths;
  downloadFileName?: string;
  setDeletedFiles: (deletedPaths: (prev: string[]) => string[]) => void;
};

const MultipleFileUpload: React.FC<MultipleFileUploadProps> = ({
  name,
  label,
  existingFiles = [],
  description,
  maxSizeMB = 15,
  maxVideoSizeMB = 100,
  isFileUploading,
  setIsFileUploading,
  bucketFilePath,
  downloadFileName,
  setDeletedFiles,
}) => {
  const { control, setValue, clearErrors } = useFormContext();
  const [files, setFiles] = useState<string[]>(existingFiles);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  const getMaxCount = () => {
    if (name === "vehiclePhotos") return 8;
    if (name === "commercialLicenses") return 2;
    return 0;
  };

  const maxCount = getMaxCount();

  useEffect(() => {
    setValue(name, files);
  }, [files, setValue, name]);

  const handleFilesChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles: File[] = [];

    const remainingLimit = maxCount - files.length - uploadingCount;
    if (selectedFiles.length > remainingLimit) {
      toast({
        variant: "destructive",
        title: "File limit exceeded",
        description: `You can only upload a maximum of ${maxCount} files.`,
      });
      selectedFiles.splice(remainingLimit);
    }

    for (const file of selectedFiles) {
      const isVideo = file.type.startsWith("video/");
      const sizeLimitMB = isVideo ? maxVideoSizeMB : maxSizeMB;
      if (!validateFileSize(file, sizeLimitMB)) {
        toast({
          variant: "destructive",
          title: "Invalid file size",
          description: `File ${file.name} exceeds the size limit of ${sizeLimitMB}MB`,
        });
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    if (setIsFileUploading) setIsFileUploading(true);
    setUploadingCount((prev) => prev + validFiles.length);

    try {
      const uploadResponse = await uploadMultipleFiles(
        bucketFilePath,
        validFiles
      );
      const uploadedPaths = uploadResponse.result.paths;

      setFiles((prevFiles) => [...prevFiles, ...uploadedPaths]);
      clearErrors(name);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "File upload failed",
        description: "Please try again.",
      });
      console.error("Error uploading multiple files:", error);
    } finally {
      setUploadingCount((prev) => prev - validFiles.length);
      if (setIsFileUploading) setIsFileUploading(false);
      event.target.value = "";
    }
  };

  const handleDeleteFile = () => {
    if (fileToDelete) {
      setFiles((prevFiles) =>
        prevFiles.filter((path) => path !== fileToDelete)
      );
      setDeletedFiles((prev) => [...prev, fileToDelete]);
      setFileToDelete(null);
    }
    setIsDeleteConfirmationOpen(false);
  };

  const handlePreview = (filePath: string) => {
    const isVideo = filePath.match(/\.(mp4|webm|ogg)$/i);
    if (isVideo) {
      setPreviewVideo(filePath);
    } else {
      setPreviewImage(filePath);
    }
  };

  const handleDownloadImage = async (filePath: string, index: number) => {
    try {
      const fileName = downloadFileName || label;
      const formattedFileName = `[${index + 1}] - ${fileName}`;
      await downloadFileFromStream(filePath, formattedFileName);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Unable to download the file. Please try again.",
      });
      console.error("Error downloading file:", error);
    }
  };

  const isVideoFile = (filePath: string) => /\.(mp4|webm|ogg)$/i.test(filePath);

  return (
    <>
      <FormItem className="flex mb-2 w-full max-sm:flex-col">
        <FormLabel className="flex justify-between mt-4 ml-2 w-72 text-base lg:text-lg">
          {label} <span className="mr-5 max-sm:hidden">:</span>
        </FormLabel>
        <div className="flex-col items-start w-full">
          <FormControl>
            <Controller
              name={name}
              control={control}
              render={() => (
                <div className="grid grid-cols-4 gap-2 mt-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
                  {files.length > 0 &&
                    files.map((filePath, index) => (
                      <div
                        key={index}
                        className="overflow-hidden relative w-16 h-16 rounded-lg"
                      >
                        {isVideoFile(filePath) ? (
                          <PreviewVideoComponent videoPath={filePath} />
                        ) : (
                          <PreviewImageComponent imagePath={filePath} />
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="absolute top-1 right-1 p-1 bg-white rounded-full border ring-0 shadow-md outline-none h-fit">
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-28">
                            <DropdownMenuItem
                              onClick={() => handlePreview(filePath)}
                            >
                              <Eye className="mr-2 w-5 h-5 text-blue-600" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDownloadImage(filePath, index)
                              }
                            >
                              <Download className="mr-2 w-5 h-5 text-green-600" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setFileToDelete(filePath);
                                setIsDeleteConfirmationOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 w-5 h-5 text-red-600" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  {Array.from({ length: maxCount - files.length }).map(
                    (_, index) => (
                      <ImagePlaceholder
                        key={index}
                        index={index}
                        name={name}
                        isUploading={isFileUploading}
                        uploadingCount={uploadingCount}
                        onFileChange={handleFilesChange}
                        accept="image/*,video/*"
                      />
                    )
                  )}
                </div>
              )}
            />
          </FormControl>
          <FormDescription className="mt-1 ml-2">{description}</FormDescription>
          <FormMessage />
        </div>
      </FormItem>

      {/* Modals */}
      {previewImage && (
        <ImagePreviewModal
          imagePath={previewImage}
          setSelectedImage={setPreviewImage}
        />
      )}
      {previewVideo && (
        <VideoPreviewModal
          videoPath={previewVideo}
          setSelectedVideo={setPreviewVideo}
        />
      )}

      {isDeleteConfirmationOpen && (
        <Dialog
          open={isDeleteConfirmationOpen}
          onOpenChange={setIsDeleteConfirmationOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this file?</p>
            <DialogFooter>
              <Button onClick={() => setIsDeleteConfirmationOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDeleteFile} variant="destructive">
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default MultipleFileUpload;
