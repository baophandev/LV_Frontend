import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../api/userApi";

export const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [token, setToken] = useState("");
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    setToken(tokenFromUrl);
  }, []);

  // Xử lý countdown và điều hướng khi đặt lại mật khẩu thành công
  useEffect(() => {
    let timer;
    if (success && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (success && countdown === 0) {
      navigate("/login");
    }
    return () => clearTimeout(timer);
  }, [success, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      setError("🔒 Vui lòng nhập đầy đủ mật khẩu.");
      return;
    }

    if (password !== confirmPassword) {
      setError("🔑 Mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      await resetPasswordApi({
        token: token,
        newPassword: password,
        confirmPassword: confirmPassword,
      });

      setSuccess(
        "Mật khẩu đã được thay đổi thành công! Bạn có thể đăng nhập với mật khẩu mới."
      );
      setPassword("");
      setConfirmPassword("");
      setCountdown(5); // Bắt đầu countdown 5 giây
    } catch (error) {
      setError("❌ Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl max-w-md w-full border border-orange-200">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full mb-4 shadow-lg">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            🐾 Tạo Mật Khẩu Mới
          </h2>
          <p className="text-gray-600 text-sm">
            Vui lòng nhập mật khẩu mới cho tài khoản thú cưng của bạn
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2"
            >
              🔒 Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 px-4 pl-12 border-2 border-orange-200 rounded-xl text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 shadow-sm"
                placeholder="Nhập mật khẩu mới"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-orange-400 text-lg">🔒</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2"
            >
              🔑 Xác nhận mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full py-3 px-4 pl-12 border-2 border-orange-200 rounded-xl text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 shadow-sm"
                placeholder="Xác nhận lại mật khẩu"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-orange-400 text-lg">🔑</span>
              </div>
            </div>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-100 border border-red-200 text-red-700">
              <span className="text-lg">❌</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-100 border border-green-200 text-green-700">
              <div className="flex flex-col">
                <p className="text-sm font-medium">{success}</p>
                {countdown > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    🕒 Tự động chuyển đến trang đăng nhập sau {countdown}{" "}
                    giây...
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span className="text-lg">🚀</span>
              Đặt lại Mật khẩu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
