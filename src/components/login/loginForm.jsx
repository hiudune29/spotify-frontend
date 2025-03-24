import { useState } from "react";
import EmailField from "../ui/email-input";
import PasswordField from "../ui/password-input";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid) return;
    console.log("Đăng nhập thành công!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
