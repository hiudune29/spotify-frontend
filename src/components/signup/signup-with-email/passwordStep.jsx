import { useState, useEffect } from "react";

const PasswordStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [password, setPassword] = useState(userData.password || "");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Kiểm tra mật khẩu hợp lệ
  useEffect(() => {
    if (password) {
      // Yêu cầu mật khẩu ít nhất 8 ký tự
      setIsValid(password.length >= 8);
      setError(password.length >= 8 ? "" : "Mật khẩu phải có ít nhất 8 ký tự");
    } else {
      setIsValid(false);
      setError("");
    }
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    if (!isValid) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    updateUserData({ password });
    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4">Tạo mật khẩu</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white mb-2"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-md bg-[#121212] text-white border ${
                error ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Tạo mật khẩu"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <p className="mt-2 text-xs text-gray-400">
            Mật khẩu phải có ít nhất 8 ký tự
          </p>
        </div>

        <div className="flex space-x-4 pt-2">
          <button
            type="button"
            onClick={prevStep}
            className="w-1/2 py-3 rounded-full font-semibold bg-transparent border border-gray-500 text-white hover:border-white"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`w-1/2 py-3 rounded-full font-semibold 
              ${
                isValid
                  ? "bg-green-500 hover:bg-green-400 text-black"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
          >
            Tiếp theo
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordStep;
