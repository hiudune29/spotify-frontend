import { useState } from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
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
    )
}
export default LoginForm;
