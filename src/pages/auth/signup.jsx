import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SpotifyIcon from "../../components/ui/spotify-icon";
import { GoogleOAuthProvider } from "@react-oauth/google";
import EmailStep from "../../components/signup/signup-with-email/emailStep";
import PasswordStep from "../../components/signup/signup-with-email/passwordStep";
import InformationStep from "../../components/signup/signup-with-email/informationStep";
import OTPStep from "../../components/signup/signup-with-email/otpStep";
import SocialLoginButtons from "../../components/ui/social-button";
import DividerWithText from "../../components/ui/divider-with-text";

const SignUpPage = () => {
  const [startedSignup, setStartedSignup] = useState(false);
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [userData, setUserData] = useState({
    email: "",
    userName: "",
    fullname: "",
    password: "",
    dob: "",
    isPremium: false,
  });

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    const stepNumber = parseInt(hash);

    if (!startedSignup) {
      navigate("", { replace: true });
      setStep(0);
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
    setCompletedSteps([]);
    setUserData({
      email: "",
      userName: "",
      fullname: "",
      password: "",
      dob: "",
      isPremium: false,
    });
    setError("");
    navigate("", { replace: true });
  };

  const updateUserData = (data) => {
    setUserData((prev) => ({
      ...prev,
      ...data,
    }));
    setError("");
  };

  const startSignupProcess = (emailData) => {
    updateUserData(emailData);
    setStartedSignup(true);
    setStep(1);
    navigate("#1");
  };

  const nextStep = () => {
    const newStep = step + 1;
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step]);
    }
    setStep(newStep);
    navigate(`#${newStep}`);
  };

  const prevStep = () => {
    const newStep = step - 1;
    setStep(newStep);
    navigate(`#${newStep}`);
  };

  // Trong SignUpPage.jsx
  if (!startedSignup) {
    return (
      <GoogleOAuthProvider clientId="474604047510-k2b2ejrdjnvj96p7b565fh80i3sm9o8e.apps.googleusercontent.com">
        <div className="flex min-h-screen justify-center bg-black p-4">
          <div className="w-full max-w-md space-y-8 rounded-lg p-6">
            <SpotifyIcon />
            <h1 className="text-center text-4xl font-bold text-white">
              Đăng ký để bắt đầu nghe nhạc
            </h1>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <EmailStep
              nextStep={startSignupProcess}
              userData={userData}
              updateUserData={updateUserData}
            />
            <DividerWithText text="hoặc" />
            <SocialLoginButtons signUp={true} setError={setError} />
            <DividerWithText />
            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                Đã có tài khoản?{" "}
                <a href="/login" className="text-white hover:underline">
                  Đăng nhập tại đây
                </a>
              </p>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg p-6">
        <SpotifyIcon />
        <h1 className="text-center text-4xl font-bold text-white">
          Đăng ký tài khoản Spotify
        </h1>
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
        <div className="bg-[#121212] p-3 rounded-md border border-gray-700 mb-4">
          <div className="flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              <span>Email:</span>
              <span className="ml-2 text-white font-medium">
                {userData.email}
              </span>
            </div>
            <button
              onClick={cancelSignup}
              className="text-xs text-green-500 hover:text-green-400 hover:underline"
            >
              Thay đổi
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="mt-4">
          {step === 1 && (
            <PasswordStep
              nextStep={nextStep}
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
              userData={userData}
              setError={setError}
              navigate={navigate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
