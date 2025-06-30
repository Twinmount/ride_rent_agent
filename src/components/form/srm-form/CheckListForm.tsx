import { useEffect, useState } from "react";

import { AnnotationState } from "@markerjs/markerjs3";
import ImageAnnotationEditor from "../image-annotation-editor/ImageAnnotationEditor";
import { useQuery } from "@tanstack/react-query";
import {
  getSRMCheckListFormData,
  postSRMCheckList,
  putSRMCheckList,
} from "@/api/srm";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

type Props = {
  type: "Add" | "Update";
  formData?: {
    vehicleId: string;
    checklistMetadata: string;
  } | null;
  vehicleIdParam?: string | null;
};

export default function CheckListForm({
  type,
  formData,
  vehicleIdParam,
}: Props) {
  const [annotationData, setAnnotationData] = useState<AnnotationState | null>(
    null
  );

  const navigate = useNavigate();
  const [loadCount] = useState(0);

  const vehicleId =
    type === "Add" ? sessionStorage.getItem("vehicleId") : vehicleIdParam;
  const bodyType = sessionStorage.getItem("bodyType");

  // Fetch check form data
  const { data, isLoading } = useQuery({
    queryKey: ["srm-check-list", vehicleId],
    queryFn: () => getSRMCheckListFormData(vehicleId as string),
    enabled: type === "Add" || !!vehicleId,
  });

  useEffect(() => console.log("data : ", data), [isLoading]);

  useEffect(() => {
    if (data?.result && type === "Add") {
      const parsedData = JSON.parse(data.result.checklistMetadata);
      setAnnotationData(parsedData as AnnotationState);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (type === "Update" && formData) {
      const parsedData = JSON.parse(formData.checklistMetadata);
      setAnnotationData(parsedData as AnnotationState);
    }
  }, [formData]);

  const handleSubmit = async (submittedData: AnnotationState) => {
    try {
      setAnnotationData(submittedData);

      let responseData;

      if (type === "Add") {
        responseData = await postSRMCheckList({
          vehicleId: vehicleId as string,
          checklistMetadata: JSON.stringify(data),
        });
      } else if (type === "Update") {
        if (data?.result) {
          console.log("data.result found, updating check list");
          responseData = await putSRMCheckList({
            vehicleId: vehicleId as string,
            checklistMetadata: JSON.stringify(data),
          });
        } else {
          console.log("data.result not found, creating new check list");
          responseData = await postSRMCheckList({
            vehicleId: vehicleId as string,
            checklistMetadata: JSON.stringify(data),
          });
        }
      }

      if (!responseData) {
        throw new Error("Failed to update check list");
      }

      toast({
        title: "Success",
        description: "Check List Updated Successfully",
        className: "bg-yellow text-white",
      });

      navigate(`/srm/manage-vehicles/${vehicleId}/${bodyType}`);
    } catch (error) {
      console.error("Checklist submit failed:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-full">
      {annotationData !== undefined && (
        <ImageAnnotationEditor
          key={loadCount}
          type={type}
          targetImage="/1.png"
          initialAnnotation={annotationData}
          onSave={handleSubmit}
        />
      )}
    </div>
  );
}
