import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SpotifyIcon from "../../components/ui/spotify-icon";
import EmailStep from "../../components/signup/signup-with-email/emailStep";
import PasswordStep from "../../components/signup/signup-with-email/passwordStep";
import InformationStep from "../../components/signup/signup-with-email/informationStep";
import OTPStep from "../../components/signup/signup-with-email/otpStep";
import SocialLoginButtons from "../../components/ui/social-button";

const SignUpPage = () => {
  const [startedSignup, setStartedSignup] = useState(false);
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Trạng thái dữ liệu người dùng để truyền giữa các bước
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    name: "",
    birthdate: "",
    gender: "",
  });

  // Phân tích bước từ URL hash nếu có
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    const stepNumber = parseInt(hash);

    if (!startedSignup) {
      navigate("", { replace: true }); // Trả về trang nhập email
      setStep(0); // Đảm bảo UI phản ánh đúng
      return;
    }

    if (isNaN(stepNumber) || stepNumber < 1 || stepNumber > 3) {
      navigate(`#${step}`, { replace: true });
    } else {
      const canAccessStep =
        stepNumber === 1 || completedSteps.includes(stepNumber - 1);

      if (canAccessStep) {
        setStep(stepNumber);
      } else {
        const highestAllowedStep = Math.max(...completedSteps, 1);
        navigate(`#${highestAllowedStep}`, { replace: true });
        setStep(highestAllowedStep);
      }
    }
  }, [location.hash, completedSteps, startedSignup, navigate, step]);

  const cancelSignup = () => {
    setStartedSignup(false);
    setCompletedSteps([]); // Reset toàn bộ trạng thái
    setUserData({
      email: "",
      password: "",
      name: "",
      birthdate: "",
      gender: "",
    });
    navigate("", { replace: true }); // Quay về trang email
  };

  useEffect(() => {
    sessionStorage.setItem("signupStep", step);
    sessionStorage.setItem("userData", JSON.stringify(userData));
    sessionStorage.setItem("completedSteps", JSON.stringify(completedSteps));
  }, [step, userData, completedSteps]);

  useEffect(() => {
    const savedStep = sessionStorage.getItem("signupStep");
    const savedData = sessionStorage.getItem("userData");
    const savedCompleted = sessionStorage.getItem("completedSteps");

    if (savedStep) setStep(parseInt(savedStep));
    if (savedData) setUserData(JSON.parse(savedData));
    if (savedCompleted) setCompletedSteps(JSON.parse(savedCompleted));
  }, []);

  // Hàm cập nhật dữ liệu người dùng từ các bước riêng lẻ
  const updateUserData = (data) => {
    setUserData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  // Bắt đầu quy trình đăng ký sau khi nhập email
  const startSignupProcess = (emailData) => {
    updateUserData(emailData);
    setStartedSignup(true);
    setStep(1);
    navigate("#1");
  };

  // Chuyển đến bước tiếp theo
  const nextStep = () => {
    const newStep = step + 1;
    // Đánh dấu bước hiện tại là đã hoàn thành
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step]);
    }
    setStep(newStep);
    navigate(`#${newStep}`);
  };

  // Quay lại bước trước đó
  const prevStep = () => {
    const newStep = step - 1;
    setStep(newStep);
    navigate(`#${newStep}`);
  };

  // Hàm xử lý gửi dữ liệu cuối cùng
  const handleSubmit = () => {
    console.log("Biểu mẫu đã được gửi với dữ liệu:", userData);
    // Thông thường, dữ liệu sẽ được gửi đến backend tại đây
    navigate("/success"); // Chuyển hướng sau khi đăng ký thành công
  };

  // Hiển thị màn hình nhập email (mặc định của trang đăng ký)
  if (!startedSignup) {
    return (
      <div className="flex min-h-screen justify-center bg-black p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg p-6">
          <SpotifyIcon />

          <h1 className="text-center text-4xl font-bold text-white">
            Đăng ký để bắt đầu nghe nhạc
          </h1>

          {/* Các nút đăng nhập bằng mạng xã hội */}
          <SocialLoginButtons signUp={true} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black px-4 text-sm text-gray-400">hoặc</span>
            </div>
          </div>

          {/* Biểu mẫu nhập email */}
          <EmailStep
            nextStep={startSignupProcess}
            userData={userData}
            updateUserData={updateUserData}
          />

          {/* Liên kết đăng nhập */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">
              Đã có tài khoản?{" "}
              <a href="/login" className="text-white hover:underline">
                Đăng nhập
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg p-6">
        <SpotifyIcon />

        <h1 className="text-center text-4xl font-bold text-white">
          Đăng ký tài khoản Spotify
        </h1>

        {/* Chỉ báo bước đăng ký với 3 bước */}
        <div className="flex justify-center mb-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step >= num ? "bg-green-500" : "bg-gray-600"
                } text-white`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`h-1 w-6 ${
                    step > num ? "bg-green-500" : "bg-gray-600"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Nội dung các bước */}
        <div className="mt-4">
          {step === 1 && (
            <PasswordStep
              nextStep={nextStep}
              prevStep={cancelSignup}
              userData={userData}
              updateUserData={updateUserData}
            />
          )}
          {step === 2 && (
            <InformationStep
              nextStep={nextStep}
              prevStep={prevStep}
              userData={userData}
              updateUserData={updateUserData}
            />
          )}
          {step === 3 && (
            <OTPStep
              prevStep={prevStep}
              userData={userData}
              updateUserData={updateUserData}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
