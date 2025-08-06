import { useEffect } from "react";
import { createOrderApi } from "../api/orderApi";
import vnpayLogo from "../assets/vnpay.png";

export const VNPaySuccess = () => {
  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("pendingOrder"));
    const userId = localStorage.getItem("userId");

    if (orderData && userId) {
      createOrderApi({ order: orderData, userId })
        .then(() => {
          localStorage.removeItem("pendingOrder");
          localStorage.removeItem("userId");
        })
        .catch((err) => {
          console.error("Lỗi khi tạo đơn sau thanh toán:", err);
        });
    }
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
        <div className="mb-6">
          <span className="text-6xl block mb-4">🎉</span>
          <img src={vnpayLogo} alt="VNPay Logo" className="mx-auto mb-4 w-24" />
        </div>

        <div className="mb-6">
          <span className="text-2xl font-bold text-green-500 mb-2 block">
            ✅ THANH TOÁN THÀNH CÔNG
          </span>
          <p className="text-gray-600 text-sm mb-4">
            Cảm ơn bạn đã tin tưởng mua sắm cho thú cưng tại cửa hàng của chúng
            tôi!
          </p>
          <p className="text-gray-500 text-xs mb-4">
            🐾 Thú cưng của bạn sẽ sớm nhận được những món quà tuyệt vời!
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <p className="text-orange-700 text-sm font-medium">
              📦 Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="/user/purchase"
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            📋 Xem đơn hàng
          </a>
          <a
            href="/"
            className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            🏠 Tiếp tục mua sắm
          </a>
        </div>
      </div>
    </div>
  );
};
