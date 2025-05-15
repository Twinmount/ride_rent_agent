import { useState } from "react";

import { AnnotationState } from "@markerjs/markerjs3";
import ImageAnnotationEditor from "../image-annotation-editor/ImageAnnotationEditor";
import { FormSubmitButton } from "../form-ui/FormSubmitButton";

type Props = {
  type: "Add" | "Update";
};

export default function CheckListForm({ type }: Props) {
  const [annotationData, setAnnotationData] = useState<AnnotationState | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadCount] = useState(0);

  const handleSave = (data: AnnotationState) => {
    setAnnotationData(data);

    // Example: Submit to backend
    const payload = {
      imageId: "123", // Or any identifier
      annotation: JSON.stringify(data),
    };
    console.log("Submit this to backend:", payload);
  };

  return (
    <div className="w-full max-w-full">
      {annotationData !== undefined && (
        <ImageAnnotationEditor
          key={loadCount}
          targetImage="/1.png"
          onSave={handleSave}
          initialAnnotation={annotationData}
        />
      )}

      <FormSubmitButton
        text={
          type === "Add"
            ? "Continue to Payment Details"
            : "Update Vehicle Details"
        }
        isLoading={isLoading}
        className="mt-8"
      />
    </div>
  );
}
