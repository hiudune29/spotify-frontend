import { useState, useEffect, useRef } from "react";

const OTPStep = ({ prevStep, userData, updateUserData, onSubmit }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  // Đếm ngược để có thể gửi lại mã
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Focus vào ô đầu tiên khi component được render
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Chỉ cho phép nhập số
    if (value && !/^\d*$/.test(value)) return;

    // Cập nhật giá trị OTP
    const newOtp = [...otp];
    // Chỉ lấy ký tự đầu tiên nếu người dùng paste nhiều ký tự
    newOtp[index] = value.substring(0, 1);
    setOtp(newOtp);

    // Xóa thông báo lỗi khi người dùng nhập
    if (error) setError("");

    // Di chuyển đến ô tiếp theo nếu đã nhập ký tự
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Xử lý phím Backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Nếu ô hiện tại trống và không phải ô đầu tiên, quay lại ô trước
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Nếu dữ liệu dán không phải chỉ chứa số hoặc không đúng độ dài, bỏ qua
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.substring(0, 6).split("");
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    // Di chuyển focus đến ô cuối cùng được điền hoặc ô tiếp theo cần điền
    const lastFilledIndex = Math.min(digits.length, 5);
    if (inputRefs.current[lastFilledIndex]) {
      inputRefs.current[lastFilledIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem OTP đã đủ 6 chữ số chưa
    if (otp.some((digit) => digit === "")) {
      setError("Vui lòng nhập đầy đủ mã OTP");
      return;
    }

    // Mô phỏng việc xác thực OTP
    setIsVerifying(true);

    try {
      // Đây chỉ là mô phỏng. Trong thực tế, bạn sẽ gửi OTP đến API để xác thực
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const otpString = otp.join("");
      updateUserData({ otp: otpString });

      // Giả sử OTP "123456" là hợp lệ để demo
      if (otpString === "123456") {
        onSubmit(); // Hoàn tất quá trình đăng ký
      } else {
        setError("Mã OTP không chính xác. Vui lòng thử lại.");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi khi xác thực. Vui lòng thử lại.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = () => {
    // Mô phỏng việc gửi lại OTP
    setCanResend(false);
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    setError("");

    // Focus lại vào ô đầu tiên
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Hiển thị thông báo đã gửi lại OTP
    alert("Mã OTP mới đã được gửi đến " + userData.email);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4">Xác thực tài khoản</h2>

      <p className="text-gray-300">
        Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến email{" "}
        <span className="font-medium text-white">{userData.email}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              maxLength={1}
              className={`w-11 h-12 text-center text-xl font-bold rounded-md bg-[#121212] text-white border ${
                error ? "border-red-500" : "border-gray-600"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
          ))}
        </div>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <div className="text-center">
          <p className="text-sm text-gray-400">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-green-400 hover:underline"
              >
                Gửi lại mã
              </button>
            ) : (
              <>
                Có thể gửi lại mã sau{" "}
                <span className="text-white">{countdown}</span> giây
              </>
            )}
          </p>
        </div>

        <div className="flex space-x-4 pt-2">
          <button
            type="button"
            onClick={prevStep}
            className="w-1/2 py-3 rounded-full font-semibold bg-transparent border border-gray-500 text-white hover:border-white"
            disabled={isVerifying}
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={otp.some((digit) => digit === "") || isVerifying}
            className={`w-1/2 py-3 rounded-full font-semibold ${
              otp.every((digit) => digit !== "") && !isVerifying
                ? "bg-green-500 hover:bg-green-400 text-black"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            {isVerifying ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Xác thực...
              </span>
            ) : (
              "Xác thực"
            )}
          </button>
        </div>
      </form>

      <div className="text-center text-sm text-gray-400">
        <p>
          Không nhận được mã? Hãy kiểm tra thư mục spam hoặc liên hệ với chúng
          tôi qua{" "}
          <a
            href="mailto:support@spotify.com"
            className="text-white hover:underline"
          >
            support@spotify.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default OTPStep;
