import TripEndForm from "@/components/form/srm/TripEndForm";
import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EndTripsPage() {
  const navigate = useNavigate();

  return (
    <section className="container py-6 pb-10 h-auto min-h-screen bg-slate-50">
      <div className="gap-x-4 mb-5 ml-5 flex-center w-fit">
        <button
          onClick={() => navigate(-1)}
          className="border-none transition-colors outline-none w-fit flex-center hover:text-yellow"
        >
          <CircleArrowLeft />
        </button>
        <h1 className="text-center h3-bold sm:text-left">End Trip</h1>
      </div>

      <TripEndForm type="Add" />
    </section>
  );
}
