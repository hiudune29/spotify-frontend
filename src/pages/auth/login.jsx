import SpotifyIcon from "../../components/ui/spotify-icon";
import LoginForm from "../../components/login/loginForm";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SocialLoginButtons from "../../components/ui/social-button";
import DividerWithText from "../../components/ui/divider-with-text";
import { useState } from "react";

const LoginPage = () => {
  const [error, setError] = useState("");

  return (
    <GoogleOAuthProvider clientId="474604047510-k2b2ejrdjnvj96p7b565fh80i3sm9o8e.apps.googleusercontent.com">
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg p-6">
          <SpotifyIcon />
          <h1 className="text-center text-3xl font-bold text-white">
            Đăng nhập vào Spotify
          </h1>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <SocialLoginButtons signUp={false} setError={setError} />
          <DividerWithText text="hoặc" />
          <LoginForm setError={setError} /> {/* Truyền setError */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Bạn chưa có tài khoản?{" "}
              <a
                href="/signup"
                className="text-white underline hover:text-[#1DB954]"
              >
                Đăng ký Spotify
              </a>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
