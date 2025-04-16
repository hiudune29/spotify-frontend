import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Thêm useDispatch
import axios from "axios";
import { fetchUserInfo } from "../../redux/slice/userSlice"; // Import fetchUserInfo

const providers = [{ name: "Google", icon: <FcGoogle className="h-5 w-5" /> }];

const SocialLoginButtons = ({ signUp = false, setError }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Khởi tạo useDispatch

  const googleLogin = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      console.log("Google Sign-In Success:", credentialResponse);
      if (!credentialResponse.access_token) {
        setError?.("Không lấy được access token từ Google. Vui lòng thử lại.");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:8080/api/auth/google",
          { accessToken: credentialResponse.access_token },
          { withCredentials: true }
        );
        if (response.status === 200) {
          localStorage.setItem("token", response.data);

          // Gọi fetchUserInfo để lấy thông tin người dùng
          const result = await dispatch(fetchUserInfo()).unwrap();

          // Chuyển hướng dựa trên role
          if (result.role === "ADMIN") {
            navigate("/admin");
          } else if (result.role === "USER") {
            navigate("/");
          } else {
            setError?.("Vai trò không hợp lệ.");
          }
        }
      } catch (err) {
        setError?.(
          err.response?.data?.message ||
            "Đăng nhập bằng Google thất bại. Vui lòng thử lại."
        );
      }
    },
    onError: () => {
      console.log("Google Sign-In Error");
      setError?.("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
    },
    onNonOAuthError: (error) => {
      console.log("Non-OAuth Error:", error);
      setError?.("Đăng nhập Google bị hủy hoặc gặp lỗi. Vui lòng thử lại.");
    },
  });

  const handleLogin = (provider) => {
    console.log("Handle login for provider:", provider);
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
