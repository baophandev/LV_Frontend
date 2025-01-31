import { Link } from "react-router-dom";

export const Login = () => {
  return (
    <div className="w-1/2 flex flex-col items-center justify-center gap-3 ">
      <div className="uppercase text-3xl font-extrabold text-sky-500">
        ĐĂNG NHẬP
      </div>
      <input
        type="text"
        placeholder="Số điện thoại"
        className="bg-gray-200  w-full h-10 rounded-3xl p-3 outline-none"
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none"
      />
      <button className="bg-sky-500 w-full h-10 rounded-3xl text-white font-bold">
        Đăng nhập
      </button>
      <Link to={"/register"} className="text-sky-500">
        Chưa có tài khoản? Đăng ký ngay!
      </Link>
    </div>
  );
};
