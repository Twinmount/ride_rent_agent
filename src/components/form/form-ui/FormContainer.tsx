type Props = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
};

/**
 * Custom FormContainer component wraps its children in a styled form element.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onSubmit - The function to call on form submission.
 * @param {React.ReactNode} props.children - The content to be rendered inside the form.
 * @param {string} [props.className] - Optional additional class names for styling.
 * @param {string} [props.description] - Optional description text to display above the form.
 */
export const FormContainer = ({
  onSubmit,
  children,
  className,
  description,
}: Props) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`mx-auto flex w-full max-w-[900px] flex-col gap-5 rounded-3xl border bg-white p-2 py-8 !pb-8 md:p-4 ${className} `}
    >
      {description ? (
        <div className="my-2 text-center">{description}</div>
      ) : null}

      <div className="mx-auto flex w-full max-w-full flex-col gap-5">
        {children}
      </div>
    </form>
  );
};
