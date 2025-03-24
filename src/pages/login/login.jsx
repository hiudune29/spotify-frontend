import SpotifyIcon from "../../components/ui/spotify-icon";
import LoginForm from "../../components/login/loginForm";
import SocialLoginButtons from "../../components/ui/social-button";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg p-6">
        {/* Spotify Logo */}
        <SpotifyIcon />

        {/* Heading Label*/}
        <h1 className="text-center text-3xl font-bold text-white">
          Đăng nhập vào Spotify
        </h1>

        {/* Social Login Buttons */}
        <SocialLoginButtons />

        <div className="relative">
          <div className="absolute inset-0 flex items-center ">
            <div className="w-full border-t border-gray-600"></div>
          </div>
        </div>
        <br />

        {/* Login Form */}
        <LoginForm />

        {/* Forgot Password */}
        <div className="text-center">
          <a
            href="#"
            className="text-sm text-white underline  hover:text-[#1DB954]"
          >
            Quên mật khẩu của bạn?
          </a>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Bạn chưa có tài khoản?{" "}
            <a href="#" className="text-white underline hover:text-[#1DB954]">
              Đăng ký Spotify
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
