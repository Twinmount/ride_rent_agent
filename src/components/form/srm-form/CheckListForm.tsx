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

type Props = {
  type: "Add" | "Update";
  checkListData: {
    vehicleId: string;
    bodyType: string;
  };
};

export default function CheckListForm({ type, checkListData }: Props) {
  const [annotationData, setAnnotationData] = useState<AnnotationState | null>(
    null
  );
  const [loadCount] = useState(0);

  // Destructure checkListData
  const { vehicleId, bodyType } = checkListData;

  // Fetch primary form data
  const { data, isLoading } = useQuery({
    queryKey: ["srm-customer-details-form", vehicleId],
    queryFn: () => getSRMCheckListFormData(vehicleId as string),
    enabled: !!vehicleId,
  });

  useEffect(() => {
    if (data) {
      const parsedData = JSON.parse(data.result.checklistMetadata);
      setAnnotationData(parsedData as AnnotationState);
    }
  }, [data, isLoading]);

  const handleSubmit = async (data: AnnotationState) => {
    setAnnotationData(data);

    let responseData;

    if (type === "Add") {
      responseData = await postSRMCheckList({
        vehicleId,
        checklistMetadata: JSON.stringify(data),
      });
    } else {
      responseData = await putSRMCheckList({
        vehicleId,
        checklistMetadata: JSON.stringify(data),
      });
    }

    if (!responseData) {
      throw new Error("Failed to update check list");
    }

    toast({
      title: "Success",
      description: "Check List Updated Successfully",
      className: "bg-yellow text-white",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-full">
      {annotationData !== undefined && (
        <ImageAnnotationEditor
          key={loadCount}
          targetImage="/1.png"
          initialAnnotation={annotationData}
          onSave={handleSubmit}
        />
      )}
    </div>
  );
}
