import { Link } from "react-router-dom";

export default function DashboardOverlay({ userId }: { userId: string }) {
  return (
    <div className="flex absolute inset-0 z-20 justify-center pt-0 bg-gray-200 bg-opacity-30 backdrop-blur-md">
      <div className="flex flex-col text-center w-full max-sm:max-w-[90%] max-w-[500px]  mt-52 rounded-lg ">
        <h3 className="mb-4 text-2xl font-extrabold text-gray-800">
          Add your first vehicle and grow your rental business 20x.
        </h3>

        <Link
          to={`/listings/add/${userId}`}
          className="inline-block px-6 py-3 font-semibold text-white rounded-md transition-all bg-yellow hover:bg-yellow focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50 focus:outline-none"
        >
          Add Your First Vehicle
        </Link>
      </div>
    </div>
  );
}
