import { useState } from "react";
import { Link } from "react-router-dom";
import { loginApi } from "../api/authApi";

export const Login = () => {
  const [phoneNumber, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    // Ngăn form tự động reload trang khi submit
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await loginApi(phoneNumber, password);

      if (response.success) {
        localStorage.setItem("authToken", response.data.token);
        window.location.href = "/";
      } else {
        alert("Đăng nhập thất bại! " + response.message);
      }
    } catch (error) {
      alert("Lỗi đăng nhập: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/2 flex flex-col items-center justify-center gap-3 ">
      <div className="uppercase text-3xl font-extrabold text-white">
        ĐĂNG NHẬP
      </div>
      {/* Bọc các input trong form để hỗ trợ submit bằng Enter */}
      <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
        <input
          type="text"
          placeholder="Số điện thoại"
          value={phoneNumber}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-sky-500 w-full h-10 rounded-3xl text-white font-bold"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
      <Link to="/register" className="text-sky-500">
        Chưa có tài khoản? Đăng ký ngay!
      </Link>
    </div>
  );
};
