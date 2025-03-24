import { useState, useEffect } from "react";
import InputField from "../../ui/input-field";

const EmailStep = ({ nextStep, userData }) => {
  const [email, setEmail] = useState(userData.email || "");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  // Kiểm tra email hợp lệ khi người dùng nhập
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValid(emailRegex.test(email));
      setError(emailRegex.test(email) ? "" : "Email không hợp lệ");
    } else {
      setIsValid(false);
      setError("");
    }
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }

    if (!isValid) {
      setError("Email không hợp lệ. Vui lòng kiểm tra lại");
      return;
    }

    // Cập nhật email và tiếp tục quy trình đăng ký
    nextStep({ email });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white mb-2"
          >
            Email của bạn là gì?
          </label>
          <InputField
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="Nhập địa chỉ email của bạn"
          />
          {/* <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            className={`w-full px-4 py-3 rounded-md bg-[#121212] text-white border 
            ${
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-500"
                : "border-gray-600 focus:ring-2 focus:ring-green-500"
            } focus:outline-none`}
            placeholder="Nhập địa chỉ email của bạn"
          /> */}

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <p className="mt-2 text-xs text-gray-400">
            Địa chỉ email sẽ được sử dụng để đăng nhập và khôi phục tài khoản
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 rounded-full font-semibold 
              ${
                isValid
                  ? "bg-green-500 hover:bg-green-400 text-black"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
          >
            Tiếp tục với Email
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailStep;
