const InputField = ({
  label,
  type = "text",
  id,
  name,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-md bg-[#121212] text-white border 
          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : "border-gray-600 focus:ring-2 focus:ring-green-500"
          } focus:outline-none`}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default InputField;
