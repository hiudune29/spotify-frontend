import { useState } from "react";
import EmailField from "../../ui/email-input";

const EmailStep = ({ nextStep, userData }) => {
  const [email, setEmail] = useState(userData.email || "");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEmailValid) return;
    // Cập nhật email và tiếp tục quy trình đăng ký
    nextStep({ email });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <EmailField
          email={email}
          setEmail={setEmail}
          setIsEmailValid={setIsEmailValid}
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={!isEmailValid}
            className={`w-full py-3 rounded-full font-semibold 
              ${
                isEmailValid
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

export default EmailStep;
