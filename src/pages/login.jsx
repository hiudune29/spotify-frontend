import { useState } from "react"
import { FaGoogle, FaFacebook, FaApple, FaPhone } from "react-icons/fa"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg p-6">
                {/* Spotify Logo */}
                <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-white p-2">
                        <svg viewBox="0 0 24 24" className="h-full w-full text-black">
                            <path
                                fill="currentColor"
                                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.5576 16.6356C16.3278 16.9878 15.8504 17.0931 15.4983 16.8634C13.4551 15.5968 10.8008 15.3207 7.5121 16.0745C7.10732 16.1752 6.70444 15.9356 6.60373 15.5308C6.50302 15.126 6.74265 14.7231 7.14743 14.6224C10.7753 13.7845 13.7773 14.1167 16.1298 15.5763C16.482 15.8061 16.5873 16.2835 16.3576 16.6356ZM17.7092 13.9301C17.4202 14.3736 16.8226 14.5042 16.3791 14.2152C14.0344 12.7526 10.5363 12.3347 7.12074 13.2347C6.61901 13.3712 6.09456 13.0869 5.95806 12.5852C5.82257 12.0834 6.10583 11.559 6.60756 11.4225C10.5233 10.3911 14.4679 10.8754 17.2241 12.6C17.6676 12.889 17.7982 13.4866 17.5092 13.9301ZM17.8055 11.1214C15.0203 9.41935 9.80085 9.2116 6.52061 10.2673C5.93419 10.4338 5.31226 10.0899 5.14574 9.50345C4.97921 8.91703 5.32318 8.2951 5.9096 8.12857C9.72787 6.91191 15.5322 7.1572 18.7919 9.13324C19.3351 9.46173 19.5121 10.1557 19.1836 10.6977C18.8562 11.2409 18.1611 11.4179 17.6191 11.0894L17.8055 11.1214Z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-center text-2xl font-bold text-white">Đăng nhập vào Spotify</h1>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                    <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-600 py-3 text-white transition hover:border-white">
                        <FaGoogle className="h-5 w-5 text-white" />
                        <span>Tiếp tục bằng Google</span>
                    </button>

                    <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-600 py-3 text-white transition hover:border-white">
                        <FaFacebook className="h-5 w-5 text-[#1877F2]" />
                        <span>Tiếp tục bằng Facebook</span>
                    </button>

                    <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-600 py-3 text-white transition hover:border-white">
                        <FaApple className="h-5 w-5 text-white" />
                        <span>Tiếp tục bằng Apple</span>
                    </button>

                    <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-600 py-3 text-white transition hover:border-white">
                        <FaPhone className="h-4 w-4 text-white" />
                        <span>Tiếp tục bằng số điện thoại</span>
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center ">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                </div>
                <br />
                {/* Login Form */}
                <form className="space-y-4">
                    <div className="space-y-2 ">
                        <label htmlFor="email" className="block text-sm font-medium text-white">
                            Email hoặc tên người dùng
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded border border-gray-600 bg-[#E8F0FE] px-3 py-2 text-black focus:border-white focus:outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" className="block text-sm font-medium text-white">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded border border-gray-600 bg-[#E8F0FE] px-3 py-2 text-black focus:border-white focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                            >
                                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-full bg-[#1ED760] py-3 font-bold text-black transition hover:bg-[#1DB954] cursor-pointer"
                    >
                        Đăng nhập
                    </button>
                </form>

                {/* Forgot Password */}
                <div className="text-center">
                    <a href="#" className="text-sm text-white underline hover:text-[#1DB954]">
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
    )
}

export default Login

