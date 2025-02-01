import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginApi } from "../api/authApi";
import { setAuthToken } from "../redux/slices/authSlice";

export const Login = () => {

  const [phoneNumber, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try{
      const response = await loginApi(phoneNumber, password);

      if(response.success){
        dispatch(setAuthToken(response.data.token));
        alert("Đăng nhập thành công!");
      }else{
        alert("Đăng nhập thất bại!" + response.message);
      }
    }catch(error){
      alert("Lỗi đăng nhập: " + error.message);
    }finally{
      setLoading(false);
    }
  };


  return (
    <div className="w-1/2 flex flex-col items-center justify-center gap-3 ">
      <div className="uppercase text-3xl font-extrabold text-sky-500">
        ĐĂNG NHẬP
      </div>
      <input
        type="text"
        placeholder="Số điện thoại"
        value={phoneNumber}
        onChange={(e) => setPhone(e.target.value)}
        className="bg-gray-200  w-full h-10 rounded-3xl p-3 outline-none"
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none"
      />
      <button
        onClick={handleLogin}
        disabled={loading}
      className="bg-sky-500 w-full h-10 rounded-3xl text-white font-bold">
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      <Link to={"/register"} className="text-sky-500">
        Chưa có tài khoản? Đăng ký ngay!
      </Link>
    </div>
  );
};
