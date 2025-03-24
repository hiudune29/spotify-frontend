const SelectInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-white mb-2"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 rounded-md bg-[#121212] text-white border ${
          error ? "border-red-500" : "border-gray-600"
        } focus:outline-none focus:ring-2 focus:ring-green-500`}
        placeholder={placeholder}
      />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SelectInput;
