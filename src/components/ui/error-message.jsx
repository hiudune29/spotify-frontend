import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
      <ExclamationCircleIcon className="h-5 w-5" />
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
