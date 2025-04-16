import { useState, useEffect, useCallback } from "react";
import InputField from "../../ui/field-input";
import ErrorMessage from "../../ui/error-message";

const InformationStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [formData, setFormData] = useState({
    userName: userData.userName || "",
    fullname: userData.fullname || "",
    day: userData.dob ? new Date(userData.dob).getDate() : "",
    month: userData.dob ? new Date(userData.dob).getMonth() + 1 : "",
    year: userData.dob ? new Date(userData.dob).getFullYear() : "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const months = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const years = useCallback(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - i);
  }, []);

  const days = useCallback(() => {
    const daysCount =
      formData.year && formData.month
        ? getDaysInMonth(formData.month, formData.year)
        : 31;
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  }, [formData.month, formData.year]);

  useEffect(() => {
    const newErrors = {};

    if (!formData.userName) {
      newErrors.userName = "Vui lòng nhập tên người dùng";
    }

    if (!formData.fullname) {
      newErrors.fullname = "Vui lòng nhập họ tên của bạn";
    }

    if (!formData.day || !formData.month || !formData.year) {
      newErrors.dob = "Vui lòng chọn ngày sinh đầy đủ";
    } else {
      const birthDate = new Date(
        formData.year,
        formData.month - 1,
        formData.day
      );
      const minBirthDate = new Date();
      minBirthDate.setFullYear(minBirthDate.getFullYear() - 13);

      if (birthDate > minBirthDate) {
        newErrors.dob = "Bạn phải đủ 13 tuổi để đăng ký";
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValid) return;

    const dob = new Date(formData.year, formData.month - 1, formData.day)
      .toISOString()
      .split("T")[0];

    updateUserData({
      userName: formData.userName,
      fullname: formData.fullname,
      dob,
    });

    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Cho chúng tôi biết về bạn
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <InputField
            label="Tên người dùng"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            error={errors.userName}
            placeholder="Nhập tên người dùng"
          />
          {errors.userName && <ErrorMessage message={errors.userName} />}
        </div>

        <div className="space-y-1">
          <InputField
            label="Họ tên"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            error={errors.fullname}
            placeholder="Nhập họ tên của bạn"
          />
          {errors.fullname && <ErrorMessage message={errors.fullname} />}
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Ngày sinh
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <select
                name="day"
                value={formData.day}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-[#121212] text-white border ${
                  errors.dob ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <option value="">Ngày</option>
                {days().map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-[#121212] text-white border ${
                  errors.dob ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <option value="">Tháng</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md bg-[#121212] text-white border ${
                  errors.dob ? "border-red-500" : "border-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                <option value="">Năm</option>
                {years().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.dob && (
            <p className="mt-2 text-sm text-red-500">{errors.dob}</p>
          )}
        </div>

        <div className="flex space-x-4 pt-2">
          <button
            type="button"
            onClick={prevStep}
            className="w-1/2 py-3 rounded-full font-semibold bg-transparent border border-gray-500 text-white hover:border-white"
          >
            Quay lại
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`w-1/2 py-3 rounded-full font-semibold 
              ${
                isValid
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

export default InformationStep;
