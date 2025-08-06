import { Link } from "react-router";
import vnpayLogo from "../assets/vnpay.png";

export const VNPayFail = () => {
  return (
    <div className="w-full h-screen items-center justify-center flex flex-col gap-6 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
        <div className="mb-6">
          <span className="text-6xl block mb-4">😿</span>
          <img src={vnpayLogo} alt="VNPay Logo" className="mx-auto mb-4 w-24" />
        </div>

        <div className="mb-6">
          <span className="inline-block text-2xl font-bold text-red-500 mb-2">
            ❌ THANH TOÁN THẤT BẠI
          </span>
          <p className="text-gray-600 text-sm mb-4">
            Rất tiếc! Việc thanh toán cho đơn hàng thú cưng của bạn đã không
            thành công.
          </p>
          <p className="text-gray-500 text-xs">
            🐾 Đừng lo lắng, thú cưng của bạn vẫn đang chờ những món quà tuyệt
            vời!
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to={"/cart"}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            🛒 Thử lại thanh toán
          </Link>
          <Link
            to={"/"}
            className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            🏠 Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};
