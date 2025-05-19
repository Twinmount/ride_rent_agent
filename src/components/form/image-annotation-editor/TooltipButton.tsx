type TooltipButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  title: string; // tooltip text
  variant?: "add" | "delete" | "clear" | "save";
  label?: string; // new label text
  children: React.ReactNode; // icon element
  className?: string;
};

const TooltipButton = ({
  onClick,
  disabled = false,
  ariaLabel,
  title,
  variant = "add",
  label,
  children,
  className,
}: TooltipButtonProps) => {
  let baseClasses =
    "inline-flex items-center space-x-2 p-2 rounded-md focus:outline-none focus:ring-2";
  let colorClasses = "";

  switch (variant) {
    case "add":
      colorClasses = disabled
        ? "bg-yellow text-white cursor-not-allowed"
        : "bg-yellow text-white hover:bg-yellow-600 focus:ring-yellow-400";
      break;
    case "delete":
      colorClasses = disabled
        ? "bg-red-300 text-white cursor-not-allowed"
        : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
      break;
    case "clear":
      colorClasses = disabled
        ? "bg-red-400 text-white cursor-not-allowed"
        : "bg-red-700 text-white hover:bg-red-800 focus:ring-red-600";
      break;
    case "save":
      colorClasses = disabled
        ? "bg-green-300 text-white cursor-not-allowed"
        : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500";
      break;
    default:
      colorClasses = disabled
        ? "bg-gray-300 text-white cursor-not-allowed"
        : "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400";
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      className={`${baseClasses} ${colorClasses} ${className}`}
    >
      {children}
      {label && (
        <span className="select-none font-medium max-sm:text-sm">{label}</span>
      )}
    </button>
  );
};

export default TooltipButton;
