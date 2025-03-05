type Props = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
};

/**
 * Custom FormContainer component wraps its children in a styled form element.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onSubmit - The function to call on form submission.
 * @param {React.ReactNode} props.children - The content to be rendered inside the form.
 * @param {string} [props.className] - Optional additional class names for styling.
 */
export const FormContainer = ({ onSubmit, children, className }: Props) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`mx-auto flex w-full max-w-[900px] flex-col gap-5 rounded-3xl border bg-white p-2 py-8 !pb-8 md:p-4 ${className} `}
    >
      <div className="mx-auto flex w-full max-w-full flex-col gap-5">
        {children}
      </div>
    </form>
  );
};
