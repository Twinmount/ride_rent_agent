import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PageWrapperProps = {
  heading: string;
  subheading?: string;
  children: React.ReactNode;
  shouldRenderNavigation?: boolean;
};

export default function PageWrapper({
  heading,
  subheading,
  children,
  shouldRenderNavigation = true,
}: PageWrapperProps) {
  const navigate = useNavigate();

  return (
    <div className="container py-6 pb-10 h-auto min-h-screen bg-slate-50">
      <div className="gap-x-4 mb-5 ml-2 flex-col w-fit">
        <div className="flex  items-center gap-x-4 w-fit">
          {/* navigation button */}
          {shouldRenderNavigation && (
            <button
              onClick={() => navigate(-1)}
              className="border-none transition-colors outline-none w-fit flex-center hover:text-yellow"
            >
              <CircleArrowLeft />
            </button>
          )}
          {/* heading */}
          <h1 className="text-center h3-bold sm:text-left">{heading}</h1>
        </div>
        {/* sub heading */}
        {subheading && (
          <h2 className="text-md text-gray-600 ml-10">{subheading}</h2>
        )}
      </div>

      {children}
    </div>
  );
}
