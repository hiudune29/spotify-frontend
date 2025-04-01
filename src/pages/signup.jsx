import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SpotifyIcon from "../components/ui/spotify-icon";
// import EmailStep from "../components/signup/signup-form/step-email";
// import PasswordStep from "../components/signup/signup-form/step-password";

const SignUpPage = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const nextStep = () => {
        if (step < 3) {
            setStep((prev) => prev + 1);
            navigate(`/step${step + 1}`);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
            navigate(`/step${step - 1}`);
        }
    };

    return (
        <div className="flex min-h-screen justify-center bg-black p-4">
            <div className="w-full max-w-md space-y-8 rounded-lg p-6">
                <SpotifyIcon />

                <h1 className="text-center text-4xl font-bold text-white">Đăng ký để bắt đầu nghe nhạc</h1>
                <>
                    {step === 0 && <EmailStep nextStep={nextStep} />}
                    {step === 1 && <PasswordStep nextStep={nextStep} prevStep={prevStep} />}
                    {step === 2 && <InformationStep nextStep={nextStep} prevStep={prevStep} />}
                    {step === 3 && <StepOTP prevStep={prevStep} />}
                </>
            </div>
        </div>
    )
}

export default SignUpPage