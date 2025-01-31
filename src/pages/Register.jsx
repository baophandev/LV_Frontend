import { Link } from "react-router-dom";

export const Register = () => {
  return (
    <div className="w-1/2 flex flex-col items-center justify-center gap-3 ">
      <div className="uppercase text-3xl font-extrabold text-sky-500">
        ĐĂNG KÝ
      </div>
      <input
        type="text"
        placeholder="Họ và tên"
        className="bg-gray-200  w-full h-10 rounded-3xl p-3 outline-none"
      />
      <input
        type="text"
        placeholder="Số điện thoại"
        className="bg-gray-200  w-full h-10 rounded-3xl p-3 outline-none"
      />
      <input
        type="text"
        placeholder="Email"
        className="bg-gray-200  w-full h-10 rounded-3xl p-3 outline-none"
      />
      <input
        type="date"
        placeholder="Ngày sinh"
        className="bg-gray-200  w-full h-10 rounded-3xl p-3 outline-none"
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none"
      />
      <input
        type="password"
        placeholder="Nhập lại mật khẩu"
        className="bg-gray-200 w-full h-10 rounded-3xl p-3 outline-none"
      />
      <button className="bg-sky-500 w-full h-10 rounded-3xl text-white font-bold">
        Tạo tài khoản
      </button>
      <Link to={"/login"} className="text-sky-500">
        Đăng nhập
      </Link>
    </div>
  );
};
