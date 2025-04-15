import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import EmailField from "../ui/email-input";
import PasswordField from "../ui/password-input";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Sử dụng useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid) return;

    try {
      const response = await axios.post(
        "http://localhost:8082/api/auth/login",
        { identifier: email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data);
        navigate("/"); // Chuyển hướng tới /
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
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
