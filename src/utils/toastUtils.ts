import { toast } from "@/components/ui/use-toast";

export const showSuccessToast = (type: "Add" | "Update") => {
  toast({
    title: `Vehicle ${type.toLowerCase()} successful`,
    className: "bg-yellow text-white",
  });
};

export const showErrorToast = (type: "Add" | "Update") => {
  toast({
    variant: "destructive",
    title: `${type} Vehicle failed`,
    description: "Something went wrong",
  });
};

export const showFileUploadInProgressToast = () => {
  toast({
    title: "File Upload in Progress",
    description:
      "Please wait until the file upload completes before submitting the form.",
    duration: 3000,
    className: "bg-orange",
  });
};
