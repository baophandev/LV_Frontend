import { useState } from "react";
import { loginApi } from "../api/authApi";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";

export const Login = () => {
  const [phoneNumber, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ";
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await loginApi(phoneNumber, password);

      // Simulate successful login
      const _response = { success: true, data: { token: "sample-token" } };

      if (_response.success) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("ROLE", "USER");
        setMessage("Đăng nhập thành công! Chào mừng bạn trở lại!");
        setTimeout(() => {
          window.location.href = "/";
          console.log("Redirect to dashboard");
        }, 1500);
      } else {
        setMessage("Đăng nhập thất bại! " + response.message);
      }
    } catch (error) {
      setMessage("Số điện thoại hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 backdrop-blur-sm shadow-lg">
            <img
              src={Logo}
              alt="Pet Store Logo"
              className="w-28 hidden md:block"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            🐾 Chào mừng trở lại!
          </h1>
          <p className="text-orange-100 text-sm">
            Đăng nhập để tiếp tục mua sắm cho thú cưng yêu quý
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Phone Number Input */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-orange-300"></span>
              </div>
              <input
                type="text"
                placeholder="Số điện thoại"
                value={phoneNumber}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phoneNumber) {
                    setErrors((prev) => ({ ...prev, phoneNumber: null }));
                  }
                }}
                onKeyPress={handleKeyPress}
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
                <CheckCircleOutlineOutlinedIcon className="w-4 h-4" />
                <span>{errors.phoneNumber}</span>
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-orange-300"></span>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: null }));
                  }
                }}
                onKeyPress={handleKeyPress}
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
                  <VisibilityOffOutlinedIcon className="w-5 h-5" />
                ) : (
                  <RemoveRedEyeOutlinedIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center gap-2 text-sm text-white">
                <ErrorOutlineOutlinedIcon className="w-4 h-4" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-xl ${
                message.includes("thành công")
                  ? "bg-green-500/20 border border-green-500/30 text-green-100"
                  : "bg-red-500/20 border border-red-500/30 text-red-100"
              }`}
            >
              {message.includes("thành công") ? (
                <>
                  <CheckCircleOutlineOutlinedIcon className="w-5 h-5" />
                  <span className="text-sm">{message}</span>
                </>
              ) : (
                <>
                  <ErrorOutlineOutlinedIcon className="w-5 h-5" />
                  <span className="text-sm">{message}</span>
                </>
              )}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>🐾 Đang đăng nhập...</span>
              </>
            ) : (
              <>
                <span>🚀 Đăng nhập</span>
              </>
            )}
          </button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <Link
              to={"/enter-email"}
              className="text-orange-200 hover:text-white text-sm font-medium underline transition-colors duration-200"
              disabled={loading}
            >
              🔑 Quên mật khẩu?
            </Link>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-orange-100 text-sm">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-orange-200 hover:text-white font-medium underline transition-colors duration-200"
              disabled={loading}
            >
              🎯 Đăng ký ngay!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
