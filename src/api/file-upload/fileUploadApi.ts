import {
  DeleteSingleImageResponse,
  GetSingleImageResponse,
  MultipleFileUploadResponse,
  SingleFileUploadResponse,
} from "@/types/API-types";
import { Slug } from "../Api-Endpoints";
import { API } from "../ApiService";
import { GcsFilePaths } from "@/constants/enum"; // Import the enum where it's defined
import { AxiosProgressEvent } from "axios";

// Single File Upload Function
export const uploadSingleFile = async (
  fileCategory: GcsFilePaths,
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<SingleFileUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("fileCategory", fileCategory);
    formData.append("file", file);

    const response = await API.post<SingleFileUploadResponse>({
      slug: Slug.POST_SINGLE_FILE,
      body: formData,
      axiosConfig: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
        timeout: 60000,
      },
    });

    if (!response) {
      throw new Error("Failed to post single image");
    }

    return response; // Response will contain the image path
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Multiple File Upload Function
export const uploadMultipleFiles = async (
  fileCategory: GcsFilePaths,
  files: File[],
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<MultipleFileUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("fileCategory", fileCategory);

    // Append each file in the 'files' array
    files.forEach((file) => {
      if (file instanceof File) {
        formData.append("files", file); // Use the same key ('files') for all files
      }
    });

    const response = await API.post<MultipleFileUploadResponse>({
      slug: Slug.POST_MULTIPLE_FILES, // Assuming there's a different slug for multiple file upload
      body: formData,
      axiosConfig: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
        timeout: 120000,
      },
    });

    if (!response) {
      throw new Error("Failed to post multiple images");
    }

    return response; // Response will contain an array of paths
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error;
  }
};

export const getSingleImage = async (
  path: string
): Promise<GetSingleImageResponse> => {
  try {
    const response = await API.get<GetSingleImageResponse>({
      slug: `${Slug.GET_SINGLE_FILE}?path=${path}`,
    });

    if (!response) {
      throw new Error("Failed to delete image");
    }

    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

// File delete function
export const deleteFile = async (
  path: string
): Promise<DeleteSingleImageResponse> => {
  try {
    const response = await API.delete<DeleteSingleImageResponse>({
      slug: `${Slug.DELETE_SINGLE_FILE}?path=${path}`,
    });

    if (!response) {
      throw new Error("Failed to delete image");
    }

    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
