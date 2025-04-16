import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Thêm useDispatch
import EmailField from "../ui/email-input";
import PasswordField from "../ui/password-input";
import axios from "axios";
import { fetchUserInfo } from "../../redux/slice/userSlice"; // Import fetchUserInfo

const LoginForm = ({ setError: setParentError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Khởi tạo useDispatch

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { identifier: email, password },
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
          setError("Vai trò không hợp lệ.");
          setParentError("Vai trò không hợp lệ.");
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
      setError(errorMessage);
      setParentError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <EmailField
        email={email}
        setEmail={setEmail}
        setIsEmailValid={setIsEmailValid}
      />
      <PasswordField
        password={password}
        setPassword={setPassword}
        setIsPasswordValid={setIsPasswordValid}
      />

      <div className="pt-2">
        <button
          type="submit"
          disabled={!isEmailValid || !isPasswordValid}
          className={`w-full py-3 rounded-full font-semibold 
              ${
                isEmailValid && isPasswordValid
                  ? "bg-green-500 hover:bg-green-400 text-black"
                  : "bg-gray-600 text-gray-300 cursor-not-allowed"
              }`}
        >
          Đăng nhập
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
