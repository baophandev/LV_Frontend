import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { updateOrderStatusApi } from "../api/orderApi";
import { useDispatch } from "react-redux";
import { localUpdateStatus } from "../redux/slices/orderSlice";
import { Snackbar, Alert } from "@mui/material";
// import { CheckCircle, XCircle, Truck, PackageCheck, Undo2 } from "lucide-react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

const STATUS_CONFIG = {
  PENDING: { text: "🐾 CHỜ XÁC NHẬN", color: "bg-orange-100 text-orange-800" },
  CONFIRM: { text: "✅ ĐÃ XÁC NHẬN", color: "bg-green-100 text-green-800" },
  DELIVERING: {
    text: "🚚 ĐANG GIAO HÀNG",
    color: "bg-blue-100 text-blue-800",
  },
  DELIVERED: {
    text: "🎉 ĐÃ GIAO HÀNG",
    color: "bg-emerald-100 text-emerald-800",
  },
  CANCELLED: { text: "❌ ĐÃ HỦY", color: "bg-red-100 text-red-800" },
  REFUNDED: { text: "💰 ĐÃ HOÀN TIỀN", color: "bg-purple-100 text-purple-800" },
  DEFAULT: { text: "-", color: "bg-gray-100 text-gray-800" },
};

const ProductItem = ({ product, orderId }) => (
  <div className="flex gap-4 p-4 border-b hover:bg-orange-50 transition-colors">
    <div className="flex-1">
      <Link
        className="font-semibold text-gray-800 hover:text-orange-600 transition-colors flex items-center gap-2"
        to={`/user/purchase/order/${orderId}`}
      >
        🐾 {product.name}
      </Link>
      <div className="flex flex-wrap gap-2 mt-1 text-sm">
        <span className="text-gray-500 bg-orange-50 px-2 py-1 rounded">
          🎨 Màu: {product.color}
        </span>
        <span className="text-gray-500 bg-orange-50 px-2 py-1 rounded">
          📦 SL: {product.quantity}
        </span>
      </div>

      <div className="mt-2 flex justify-between">
        <div>
          <span className="text-gray-500 text-sm">💰 Đơn giá: </span>
          <span className="font-medium text-orange-600">
            {product.discountedPrice.toLocaleString("vi-VN")}đ
          </span>
        </div>

        <div className="text-right">
          <span className="text-gray-500 text-sm">💸 Thành tiền: </span>
          <span className="font-medium text-red-600">
            {product.calculatePrice.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>
    </div>
  </div>
);

const OrderCard = ({ product, status, id, orderDate, method }) => {
  const [statusRecently, setStatusRecently] = useState(status);
  const dispatch = useDispatch();
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  // Sync status with props
  useEffect(() => {
    setStatusRecently(status);
  }, [status]);

  const getStatusConfig = () =>
    STATUS_CONFIG[statusRecently] || STATUS_CONFIG.DEFAULT;

  const handleStatusChange = async (newStatus) => {
    const oldStatus = statusRecently;
    setStatusRecently(newStatus);

    try {
      await updateOrderStatusApi(id, newStatus);
      dispatch(localUpdateStatus({ orderId: id, oldStatus, newStatus }));

      setToastMessage(
        "🎉 Cập nhật đơn hàng thành công! Thú cưng sẽ sớm nhận được quà!"
      );
      setToastSeverity("success");
    } catch (error) {
      setToastMessage("❌ Lỗi khi cập nhật đơn hàng! Vui lòng thử lại.");
      setToastSeverity("error");
      setStatusRecently(oldStatus);
    } finally {
      setOpenToast(true);
    }
  };

  // Calculate total amount
  const totalAmount = product.reduce(
    (sum, item) => sum + item.calculatePrice,
    0
  );

  return (
    <div className="border border-orange-200 rounded-xl mb-6 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-orange-50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between bg-gradient-to-r from-orange-100 to-red-100 px-5 py-4 border-b border-orange-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="font-bold text-gray-700 flex items-center gap-2">
            🏷️ MÃ ĐƠN:{" "}
            <span className="text-orange-600 uppercase">
              {id.split("-")[0]}
            </span>
          </div>

          {orderDate && (
            <div className="text-sm text-gray-600 flex items-center gap-1">
              📅 Ngày đặt: {new Date(orderDate).toLocaleDateString("vi-VN")}
            </div>
          )}
        </div>

        <div
          className={`mt-2 sm:mt-0 px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
            getStatusConfig().color
          }`}
        >
          {getStatusConfig().text}
        </div>
      </div>

      {/* Product List */}
      <div className="divide-y bg-white">
        {product.map((prd, index) => (
          <ProductItem key={`${id}-${index}`} product={prd} orderId={id} />
        ))}
      </div>

      {/* Order Summary */}
      <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-orange-50 to-pink-50 border-t border-orange-200">
        <div className="text-gray-600 text-sm flex items-center gap-1">
          🛍️{" "}
          <span className="font-medium">
            {product.length} sản phẩm đã chọn
          </span>
        </div>
        <div className="text-right">
          <div className="text-gray-500 text-sm">💰 Tổng tiền:</div>
          <div className="text-xl font-bold text-red-600">
            {totalAmount.toLocaleString("vi-VN")}đ
          </div>
          {method === "BANKING" && (
            <div className="text-orange-600 text-sm font-medium flex items-center gap-1 mt-1">
              💳 Đã thanh toán VNPAY
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-gradient-to-r from-white to-orange-50 border-t border-orange-200">
        {statusRecently === "DELIVERING" && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-sm max-w-md text-slate-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
              <Inventory2OutlinedIcon className="inline mr-2 w-5 h-5 text-blue-500" />
              🐾 Vui lòng chỉ nhấn "Đã nhận hàng" khi bạn đã kiểm tra sản phẩm
              cho thú cưng!
            </div>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => handleStatusChange("DELIVERED")}
            >
              <CheckCircleOutlineOutlinedIcon className="w-5 h-5" />
              🎉 Đã nhận được hàng
            </button>
          </div>
        )}

        {(statusRecently === "PENDING" || statusRecently === "CONFIRM") && (
          <div className="flex justify-end">
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 px-6 py-3 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={() => handleStatusChange("CANCELLED")}
            >
              <HighlightOffOutlinedIcon className="w-5 h-5" />Hủy đơn hàng
            </button>
          </div>
        )}

        {statusRecently === "DELIVERED" && (
          <div className="flex justify-end bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-center text-gray-700">
              <p className="flex items-center gap-2">
                💌 Vui lòng gửi yêu cầu hoàn tiền nếu có vấn đề với sản phẩm qua
                email:
              </p>
              <span className="text-orange-600 ml-2 font-semibold text-lg">
                🐾 cskh@petstore.com
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenToast(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OrderCard;
