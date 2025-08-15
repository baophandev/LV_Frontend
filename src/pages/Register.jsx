import { useState } from "react";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import { registerApi } from "../api/authApi";
import { Link } from "react-router-dom";

export const Register = () => {
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    password: "",
    repeatPassword: "",
    phoneNumber: "",
    dob: "",
    avatar: null,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "displayName":
        if (!value.trim()) error = "Vui lòng nhập họ và tên";
        else if (value.length < 2)
          error = "Họ và tên phải có ít nhất 2 ký tự";
        break;
      case "email":
        if (!value.trim()) error = "Vui lòng nhập email";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Email không hợp lệ";
        break;
      case "phoneNumber":
        if (!value.trim()) error = "Vui lòng nhập số điện thoại";
        else if (!/^[0-9]{10,11}$/.test(value.replace(/\s/g, "")))
          error = "Số điện thoại không hợp lệ";
        break;
      case "password":
        if (!value.trim()) error = "Vui lòng nhập mật khẩu";
        else if (value.length < 6)
          error = "Mật khẩu phải có ít nhất 6 ký tự";
        break;
      case "repeatPassword":
        if (!value.trim()) error = "Vui lòng nhập lại mật khẩu";
        else if (value !== userData.password) error = "Mật khẩu không khớp";
        break;
      case "dob":
        if (!value.trim()) error = "Vui lòng chọn ngày sinh";
        else {
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 13) error = "Bạn phải từ 13 tuổi trở lên";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === "file" ? files[0] : value;

    setUserData({
      ...userData,
      [name]: newValue,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(userData).forEach((key) => {
      if (key !== "avatar") {
        const error = validateField(key, userData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    const formData = new FormData();
    formData.append(
      "user",
      new Blob(
        [
          JSON.stringify({
            displayName: userData.displayName,
            email: userData.email,
            password: userData.password,
            phoneNumber: userData.phoneNumber,
            dob: userData.dob,
          }),
        ],
        { type: "application/json" }
      )
    );

    formData.append(
      "avatar",
      userData.avatar || new Blob([], { type: "application/octet-stream" })
    );

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await registerApi(formData);

      setSuccessMessage(
        "Tạo tài khoản thành công! Chào mừng bạn đến với cộng đồng yêu thú cưng!"
      );
      setTimeout(() => {
        console.log("Navigate to login");
        // navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
      setErrors({ general: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-full mb-4 backdrop-blur-sm shadow-lg">
            <PersonAddOutlinedIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            🐾 Tạo tài khoản
          </h1>
          <p className="text-orange-100 text-sm">
            Tham gia cộng đồng yêu thú cưng của chúng tôi
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Display Name */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-orange-300"></span>
              </div>
              <input
                type="text"
                name="displayName"
                placeholder="Họ và tên"
                value={userData.displayName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                  errors.displayName
                    ? "border-red-500/50"
                    : "border-orange-300/30"
                } rounded-xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm transition-all duration-200`}
                disabled={loading}
              />
            </div>
            {errors.displayName && (
              <div className="flex items-center gap-2 text-white text-sm">
                <ErrorOutlineOutlinedIcon className="w-4 h-4" />
                <span>{errors.displayName}</span>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-orange-300"></span>
              </div>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Số điện thoại"
                value={userData.phoneNumber}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                  errors.phoneNumber
                    ? "border-red-500/50"
                    : "border-orange-300/30"
                } rounded-xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm transition-all duration-200`}
                disabled={loading}
              />
            </div>
            {errors.phoneNumber && (
              <div className="flex items-center gap-2 text-white text-sm">
                <ErrorOutlineOutlinedIcon className="w-4 h-4" />
                <span>{errors.phoneNumber}</span>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-orange-300"></span>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                  errors.email ? "border-red-500/50" : "border-orange-300/30"
                } rounded-xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm transition-all duration-200`}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-2 text-white text-sm">
                <ErrorOutlineOutlinedIcon className="w-4 h-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-orange-300"></span>
              </div>
              <input
                type="date"
                name="dob"
                placeholder="Ngày sinh"
                value={userData.dob}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-white/10 border ${
                  errors.dob ? "border-red-500/50" : "border-orange-300/30"
                } rounded-xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm transition-all duration-200`}
                disabled={loading}
              />
            </div>
            {errors.dob && (
              <div className="flex items-center gap-2 text-white text-sm">
                <ErrorOutlineOutlinedIcon className="w-4 h-4" />
                <span>{errors.dob}</span>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-orange-300"></span>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                value={userData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${
                  errors.password ? "border-red-500/50" : "border-orange-300/30"
                } rounded-xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm transition-all duration-200`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-300 hover:text-white transition-colors"
                disabled={loading}
              >
                {showPassword ? (
                  <RemoveRedEyeOutlinedIcon className="w-5 h-5" />
                ) : (
                  <VisibilityOffOutlinedIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-2 text-white text-sm">
                <ErrorOutlineOutlinedIcon className="w-4 h-4" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Repeat Password */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-orange-300"></span>
              </div>
              <input
                type={showRepeatPassword ? "text" : "password"}
                name="repeatPassword"
                placeholder="Nhập lại mật khẩu"
                value={userData.repeatPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 bg-white/10 border ${
                  errors.repeatPassword
                    ? "border-red-500/50"
                    : "border-orange-300/30"
                } rounded-xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm transition-all duration-200`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-300 hover:text-white transition-colors"
                disabled={loading}
              >
                {showRepeatPassword ? (
                  <RemoveRedEyeOutlinedIcon className="w-5 h-5" />
                ) : (
                  <VisibilityOffOutlinedIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.repeatPassword && (
              <div className="flex items-center gap-2 text-white text-sm">
                <ErrorOutlineOutlinedIcon className="w-4 h-4" />
                <span>{errors.repeatPassword}</span>
              </div>
            )}
          </div>

          {/* Avatar Upload */}
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-orange-300"></span>
              </div>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-orange-300/30 rounded-xl text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 backdrop-blur-sm transition-all duration-200"
                disabled={loading}
              />
            </div>
            {userData.avatar && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <ErrorOutlineOutlinedIcon className="w-4 h-4" />
                <span>Đã chọn: {userData.avatar.name}</span>
              </div>
            )}
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-100">
              <ErrorOutlineOutlinedIcon className="w-5 h-5" />
              <span className="text-sm">{successMessage}</span>
            </div>
          )}

          {errors.general && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-100">
              <ErrorOutlineOutlinedIcon className="w-5 h-5" />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>🐾 Đang tạo tài khoản...</span>
              </>
            ) : (
              <>
                <PersonAddOutlinedIcon className="w-5 h-5" />
                <span>Tạo tài khoản</span>
              </>
            )}
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-orange-100 text-sm">
            Đã có tài khoản?{" "}
            <Link
              to={"/login"}
              className="text-orange-200 hover:text-white font-medium underline transition-colors duration-200 inline-flex items-center gap-1"
              disabled={loading}
            >
              🔑 Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
