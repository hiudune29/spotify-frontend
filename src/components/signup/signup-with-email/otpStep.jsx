import axios from "axios";

const OTPStep = ({ userData, setError, navigate }) => {
  const handleGoToLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8082/api/auth/signup",
        userData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ color: "white" }} className="text-center">
          Bạn đã đăng ký thành công tài khoản Spotify!
        </h1>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleGoToLogin}
            className="bg-[#1DB954] text-white py-2 px-4 rounded-md hover:bg-[#1DB954]/80 transition duration-200 ease-in-out"
          >
            Trở về đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPStep;
