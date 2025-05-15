import {
  AnnotationState,
  MarkerArea,
  CalloutMarker,
} from "@markerjs/markerjs3";
import { useEffect, useRef, useState } from "react";
import TooltipButton from "./TooltipButton";
import { PlusCircle, Trash2, XCircle } from "lucide-react";

type Props = {
  targetImage: string;
  initialAnnotation?: AnnotationState | null;
};

const ImageAnnotationEditor = ({ targetImage, initialAnnotation }: Props) => {
  const editorContainer = useRef<HTMLDivElement | null>(null);
  const markerAreaRef = useRef<MarkerArea | null>(null);
  const [history, setHistory] = useState<AnnotationState[]>([]);
  const [hasSelection, setHasSelection] = useState(false);

  // Load image and initialize MarkerArea
  useEffect(() => {
    if (markerAreaRef.current || !editorContainer.current) return;

    const img = new Image();
    img.src = targetImage;

    img.className = "markerImage";

    img.onload = () => {
      const markerArea = new MarkerArea();
      markerArea.targetImage = img;

      // 👂 Listen for marker selection changes
      markerArea.addEventListener("markerselect", () => {
        setHasSelection(true);
      });

      markerAreaRef.current = markerArea;

      editorContainer.current!.innerHTML = "";
      editorContainer.current!.appendChild(markerArea);

      if (initialAnnotation) {
        markerArea.restoreState(initialAnnotation);
        setHistory([initialAnnotation]);
      } else {
        setHistory([markerArea.getState()]);
      }
    };
  }, [targetImage, initialAnnotation]);

  const handleAddCallout = () => {
    if (markerAreaRef.current) {
      markerAreaRef.current.createMarker(CalloutMarker);
    }
  };

  const handleDeleteSelected = () => {
    if (markerAreaRef.current && hasSelection) {
      markerAreaRef.current.deleteSelectedMarkers();
      setHasSelection(false); // Reset after delete
      const currentState = markerAreaRef.current.getState();
      setHistory([...history, currentState]);
    }
  };

  const handleClear = () => {
    const markerArea = markerAreaRef.current;
    const img = markerArea?.targetImage;

    if (!markerArea || !img) return;

    const emptyState = {
      width: img.naturalWidth,
      height: img.naturalHeight,
      markers: [],
    };

    markerArea.restoreState(emptyState);
    setHistory([emptyState]);
    setHasSelection(false);
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex space-x-4 mb-2">
        <TooltipButton
          onClick={handleAddCallout}
          ariaLabel="Add Callout"
          title="Add Callout"
          variant="add"
          label="Add"
        >
          <PlusCircle size={20} />
        </TooltipButton>

        <TooltipButton
          onClick={handleDeleteSelected}
          disabled={!hasSelection}
          ariaLabel="Delete Selected"
          title="Delete Selected"
          variant="delete"
          label="Delete"
        >
          <XCircle size={20} />
        </TooltipButton>

        <TooltipButton
          onClick={handleClear}
          ariaLabel="Clear All"
          title="Clear All"
          variant="clear"
          label="Clear All"
        >
          <Trash2 size={20} />
        </TooltipButton>
      </div>

      <div
        ref={editorContainer}
        className="w-full h-[700px] relative overflow-hidden flex items-center justify-center border-[3px] border-[#b2b0a8] rounded-[10px] mx-auto max-w-[98%]"
      />
    </div>
  );
};

export default ImageAnnotationEditor;
