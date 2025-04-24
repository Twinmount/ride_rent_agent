import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

type LinkButtonProps = {
  link: string;
  label: string;
  className?: string;
};

export default function LinkButton({
  link,
  label,
  className,
}: LinkButtonProps) {
  return (
    <Link
      to={link}
      className={`group px-3 h-10 bg-white flex gap-x-2 items-center rounded-lg shadow-lg transition-colors duration-300 ease-in-out flex-center text-yellow hover:bg-yellow hover:text-white ${className}`}
      aria-label="add new record"
    >
      <span className="text-gray-800 transition-colors group-hover:text-white">
        {label}
      </span>{" "}
      <Plus />
    </Link>
  );
}
