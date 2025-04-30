import { Link } from "react-router";
import vnpayLogo from "../assets/vnpay.png";

export const VNPayFail = () => {
  return (
    <div className="w-full h-screen items-center justify-center up flex flex-col gap-2 bg-white">
      <img src={vnpayLogo} alt="" />
      <span className="inline-block text-xl text-red-400">
        THANH TOÁN THẤT BẠI
      </span>
      <Link to={"/"} className="text-sky-400"> Quay lại trang chủ</Link>
    </div>
  );
};

