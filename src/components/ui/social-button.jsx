import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple, FaPhone } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const providers = [{ name: "Google", icon: <FcGoogle className="h-5 w-5" /> }];

const SocialLoginButtons = ({ signUp = false, setError }) => {
  const googleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      console.log("Google Sign-In Success:", credentialResponse); // Debug
      if (!credentialResponse.access_token) {
        setError?.("Không lấy được access token từ Google. Vui lòng thử lại.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8082/api/auth/google",
          { accessToken: credentialResponse.access_token }, // Gửi accessToken
          { withCredentials: true }
        );
        if (response.status === 200) {
          window.location.href = "/";
        }
      } catch (err) {
        setError?.(
          err.response?.data?.message ||
            "Đăng ký bằng Google thất bại. Vui lòng thử lại."
        );
      }
    },
    onError: () => {
      console.log("Google Sign-In Error"); // Debug
      setError?.("Đăng ký bằng Google thất bại. Vui lòng thử lại.");
    },
    onNonOAuthError: (error) => {
      console.log("Non-OAuth Error:", error); // Debug
      setError?.("Đăng nhập Google bị hủy hoặc gặp lỗi. Vui lòng thử lại.");
    },
  });

  const handleLogin = (provider) => {
    console.log("Handle login for provider:", provider); // Debug
    if (provider === "Google") {
      googleLogin();
    } else {
      console.log(`Đăng nhập bằng ${provider}`);
    }
  };

  return (
    <div className="space-y-3">
      {providers.map(({ name, icon }) => (
        <button
          key={name}
          onClick={() => handleLogin(name)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-600 py-3 text-white transition hover:border-white"
        >
          {icon}
          <span>Tiếp tục bằng {name}</span>
        </button>
      ))}
    </div>
  );
};

export default SocialLoginButtons;
