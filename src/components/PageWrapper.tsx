import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type PageWrapperProps = {
  heading: string;
  children: React.ReactNode;
};

export default function PageWrapper({ heading, children }: PageWrapperProps) {
  const navigate = useNavigate();

  return (
    <div className="container py-6 pb-10 h-auto min-h-screen bg-slate-50">
      <div className="gap-x-4 mb-5 ml-2 flex-center w-fit">
        <button
          onClick={() => navigate(-1)}
          className="border-none transition-colors outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold sm:text-left">{heading}</h1>
      </div>

      {children}
    </div>
  );
}
