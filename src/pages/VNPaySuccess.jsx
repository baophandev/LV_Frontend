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
    <div className="w-full h-screen flex flex-col items-center justify-center gap-3 bg-white">
      <img src={vnpayLogo} alt="vnpay" />
      <span className="text-2xl font-semibold text-green-500">
        THANH TOÁN THÀNH CÔNG
      </span>
      <span className="text-slate-600">NEXOR chân thành cảm ơn quý khách!</span>
      <a href="user/purchase" className="text-blue-500 underline">
        Xem đơn hàng
      </a>
    </div>
  );
};
