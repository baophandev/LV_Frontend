import { useState } from "react";
import { forgotPasswordApi } from "../api/userApi";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { Link } from "react-router-dom";

export const EnterEmail = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(""); // "success", "error", ""
  const [message, setMessage] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("📧 Vui lòng nhập email của bạn");
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setMessage("📧 Email không hợp lệ");
      return;
    }

    setIsLoading(true);
    setStatus("");
    setMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Replace with actual API call
      await forgotPasswordApi({ email: email });

      setStatus("success");
      setMessage("📧 Email đã được gửi! Kiểm tra hộp thư để đặt lại mật khẩu.");
    } catch (err) {
      console.log(err);
      setStatus("error");
      setMessage("❌ Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-full mb-4 backdrop-blur-sm shadow-lg">
            <EmailOutlinedIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            🐾 Quên mật khẩu?
          </h1>
          <p className="text-orange-100 text-sm">
            Nhập email để nhận liên kết đặt lại mật khẩu cho tài khoản thú cưng
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-orange-300 text-lg"></span>
            </div>
            <input
              type="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-orange-300/30 rounded-xl text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              disabled={isLoading}
            />
          </div>

          {/* Status Message */}
          {message && (
            <div
              className={`flex items-center gap-2 p-3 rounded-xl ${
                status === "success"
                  ? "bg-green-500/20 border border-green-500/30 text-green-100"
                  : "bg-red-500/20 border border-red-500/30 text-red-100"
              }`}
            >
              {status === "success" ? (
                <>
                  <CheckCircleOutlineOutlinedIcon className="w-5 h-5" />
                  <span className="text-sm">🎉 {message}</span>
                </>
              ) : (
                <>
                  <ErrorOutlineOutlinedIcon className="w-5 h-5" />
                  <span className="text-sm">❌ {message}</span>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              className="flex-shrink-0 p-3 bg-white/10 hover:bg-white/20 border border-orange-300/30 rounded-xl text-white transition-all duration-200 backdrop-blur-sm hover:border-orange-300/50"
              disabled={isLoading}
            >
              <Link to={"/login"}>
                <ArrowBackOutlinedIcon className="w-5 h-5" />
              </Link>
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || !email.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>🐾 Đang gửi...</span>
                </>
              ) : (
                <>
                  <SendOutlinedIcon className="w-5 h-5" />
                  <span>📧 Gửi email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-orange-100 text-sm">
            Nhớ ra mật khẩu?{" "}
            <Link
              to={"/login"}
              className="text-orange-200 hover:text-white font-medium underline transition-colors duration-200"
            >
              🔑 Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
