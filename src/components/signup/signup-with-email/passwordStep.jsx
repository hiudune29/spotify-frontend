import { useState, useEffect } from "react";
import InputField from "../../ui/field-input";
import ErrorMessage from "../../ui/error-message";
import PasswordToggleButton from "../../ui/password-toggle-button";

const PasswordStep = ({ nextStep, userData, updateUserData }) => {
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
            <InputField
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              error={error}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tạo mật khẩu"
              autoComplete="new-password"
            />
            <PasswordToggleButton
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />
          </div>
          {error && <ErrorMessage message={error} />}
        </div>

        <div className="flex space-x-4 pt-2">
          <button
            type="submit"
            disabled={!isValid}
            className={`w-1/2 py-3 rounded-full font-semibold mx-auto
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
