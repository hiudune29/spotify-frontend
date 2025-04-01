const SignupProgress = ({ step, totalSteps = 3 }) => {
  return (
    <div className="flex justify-center mb-6">
      {[...Array(totalSteps)].map((_, index) => {
        const num = index + 1;
        return (
          <div key={num} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step >= num ? "bg-green-500" : "bg-gray-600"
              } text-white`}
            >
              {num}
            </div>
            {num < totalSteps && (
              <div
                className={`h-1 w-6 ${
                  step > num ? "bg-green-500" : "bg-gray-600"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SignupProgress;
