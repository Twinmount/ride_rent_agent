import { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Success",
  message = "Your changes have been saved successfully.",
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 mb-4 flex items-center justify-center bg-green-100 rounded-full">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
