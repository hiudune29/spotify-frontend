import { useState, useEffect, useCallback } from "react";
import InputField from "../../ui/field-input";
import ErrorMessage from "../../ui/error-message";

const InformationStep = ({ nextStep, prevStep, userData, updateUserData }) => {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    day: userData.birthdate ? new Date(userData.birthdate).getDate() : "",
    month: userData.birthdate
      ? new Date(userData.birthdate).getMonth() + 1
      : "",
    year: userData.birthdate ? new Date(userData.birthdate).getFullYear() : "",
    gender: userData.gender || "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Tạo các option cho dropdown tháng
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

  // Tạo các option cho dropdown ngày
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

  // Kiểm tra form hợp lệ
  useEffect(() => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Vui lòng nhập tên của bạn";
    }

    if (!formData.day || !formData.month || !formData.year) {
      newErrors.birthdate = "Vui lòng chọn ngày sinh đầy đủ";
    } else {
      const birthDate = new Date(
        formData.year,
        formData.month - 1,
        formData.day
      );
      const minBirthDate = new Date();
      minBirthDate.setFullYear(minBirthDate.getFullYear() - 13); // Ngày tối thiểu để đủ 13 tuổi

      if (birthDate > minBirthDate) {
        newErrors.birthdate = "Bạn phải đủ 13 tuổi để đăng ký";
      }
    }

    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
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

    // Tạo chuỗi ngày tháng từ các trường riêng lẻ
    const birthdate = new Date(
      formData.year,
      formData.month - 1,
      formData.day
    ).toISOString();

    updateUserData({
      name: formData.name,
      birthdate,
      gender: formData.gender,
    });

    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Cho chúng tôi biết về bạn
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Họ tên */}
        <div className="space-y-1">
          <InputField
            label="Họ tên"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Nhập họ tên của bạn"
          />
          {errors.name && <ErrorMessage message={errors.name} />}
        </div>

        {/* Ngày sinh */}
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
                  errors.birthdate ? "border-red-500" : "border-gray-600"
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
                  errors.birthdate ? "border-red-500" : "border-gray-600"
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
                  errors.birthdate ? "border-red-500" : "border-gray-600"
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
          {errors.birthdate && (
            <p className="mt-2 text-sm text-red-500">{errors.birthdate}</p>
          )}
        </div>

        {/* Giới tính */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Giới tính
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label
              className={`flex items-center justify-center px-4 py-3 rounded-md border ${
                formData.gender === "male"
                  ? "border-green-500 bg-[#1A3D2C]"
                  : "border-gray-600 bg-[#121212]"
              } cursor-pointer`}
            >
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-white">Nam</span>
            </label>
            <label
              className={`flex items-center justify-center px-4 py-3 rounded-md border ${
                formData.gender === "female"
                  ? "border-green-500 bg-[#1A3D2C]"
                  : "border-gray-600 bg-[#121212]"
              } cursor-pointer`}
            >
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-white">Nữ</span>
            </label>
            <label
              className={`flex items-center justify-center px-4 py-3 rounded-md border ${
                formData.gender === "other"
                  ? "border-green-500 bg-[#1A3D2C]"
                  : "border-gray-600 bg-[#121212]"
              } cursor-pointer`}
            >
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="text-white">Khác</span>
            </label>
          </div>
          {errors.gender && (
            <p className="mt-2 text-sm text-red-500">{errors.gender}</p>
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
