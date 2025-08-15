import { useDispatch, useSelector } from "react-redux";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Link } from "react-router-dom";
import { useState } from "react";
import OrderCard from "../components/OrderCard";
import { useEffect } from "react";
import { fetchOrders } from "../redux/slices/orderSlice";
import { ReduxStuatus } from "../enums/Status";
// import { fetchAllOrder } from "../redux/slices/orderSlice";

const STATUS_MAP = {
  0: "ALL",
  1: "PENDING",
  2: "CONFIRM",
  3: "DELIVERING",
  4: "DELIVERED",
  5: "CANCELLED",
  6: "REFUNDED",
};

export const PersonalPurchase = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user.id;
  const dispatch = useDispatch();
  const { orderByStatus, status } = useSelector((state) => state.order);
  const [isFocused, setIsFocused] = useState(0);
  const selectedStatus = STATUS_MAP[isFocused];
  const orders = orderByStatus[selectedStatus] || [];

  useEffect(() => {
    const ordersCached = orderByStatus[selectedStatus];
    if (!ordersCached) {
      dispatch(
        fetchOrders({
          pageNumber: 0,
          pageSize: 100,
          status: selectedStatus,
          userId: userId,
        })
      );
    }
  }, [dispatch, selectedStatus, orderByStatus, userId]);

  if (status === ReduxStuatus.LOADING) {
    return (
      <div className="w-full h-full flex justify-center items-center text-orange-500">
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl animate-bounce">🐾</span>
          <span className="font-medium">Đang tải đơn hàng...</span>
        </div>
      </div>
    );
  }

  const renderStatusButton = (index, label) => {
    return (
      <div
        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
          isFocused === index
            ? " bg-orange-500 text-white shadow-md"
            : "bg-orange-100 text-orange-700 hover:bg-orange-200"
        }`}
        onClick={() => setIsFocused(index)}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="p-5 w-full sm:w-4/5 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      <div className="p-5 rounded-lg mb-4 uppercase text-xl font-extrabold bg-white text-orange-600 shadow-md">
        🐾 {user.displayName || "Khách hàng thú cưng"}
      </div>
      <div className="flex gap-2">
        <div className="w-1/4 rounded-lg p-5 bg-white shadow-md">
          <Link className="text-orange-700 items-center flex cursor-pointer mb-2 font-medium">
            🐱 Tài khoản của tôi
          </Link>
          <Link
            to={"/user/account"}
            className="items-center flex cursor-pointer text-slate-700 hover:text-orange-500 mb-2 ml-4"
          >
            📝 Hồ sơ
          </Link>
          <Link
            to={"/user/address"}
            className="text-slate-700 hover:text-orange-500 items-center flex cursor-pointer mb-2 ml-4"
          >
            📍 Địa chỉ
          </Link>
          <Link
            to={"/user/purchase"}
            className="text-orange-500 items-center flex cursor-pointer font-medium"
          >
            🛍️ Đơn mua
          </Link>
        </div>
        <div className="w-full rounded-lg">
          <div className="flex flex-wrap cursor-pointer justify-center gap-1 sm:gap-2 p-3 bg-white border-b border-orange-200 shadow-md mb-4 rounded-lg">
            {renderStatusButton(0, "📋 Tất cả")}
            {renderStatusButton(1, "⏳ Chờ xác nhận")}
            {renderStatusButton(2, "✅ Đã xác nhận")}
            {renderStatusButton(3, "🚚 Đang vận chuyển")}
            {renderStatusButton(4, "🎉 Đã giao hàng")}
            {renderStatusButton(5, "❌ Đã hủy")}
            {renderStatusButton(6, "💸 Yêu cầu hoàn tiền")}
          </div>
          <div className="w-full mt-2">
            {orders ? (
              orders.map((item) => (
                <OrderCard
                  product={item.items}
                  status={item.status}
                  id={item.orderId}
                  method={item.method}
                ></OrderCard>
              ))
            ) : (
              <div className="w-full h-full flex justify-center items-center text-orange-500 py-12">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-6xl">🐾</span>
                  <span className="font-medium text-lg">
                    Không có đơn hàng nào
                  </span>
                  <span className="text-sm text-gray-500">
                    Hãy mua sắm cho thú cưng của bạn!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
