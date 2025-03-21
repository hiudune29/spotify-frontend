import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple, FaPhone } from "react-icons/fa";

const providers = [
    { name: "Google", icon: <FcGoogle className="h-5 w-5" /> },
    { name: "Facebook", icon: <FaFacebook className="h-5 w-5 text-[#1877F2]" /> },
    { name: "Apple", icon: <FaApple className="h-5 w-5 text-white" /> },
];

const SocialSignUpButtons = () => {
    const handleLogin = (provider) => {
        console.log(`Đăng ký bằng ${provider}`);
        // Thêm logic xử lý đăng nhập tại đây (ví dụ: gọi API)
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
                    <span>Đăng ký bằng {name}</span>
                </button>
            ))}
        </div>
    );
};

export default SocialSignUpButtons;
