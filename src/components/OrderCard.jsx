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
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";

const STATUS_CONFIG = {
  PENDING: { text: "CHỜ XÁC NHẬN", color: "bg-amber-100 text-amber-800" },
  CONFIRM: { text: "ĐÃ XÁC NHẬN", color: "bg-blue-100 text-blue-800" },
  DELIVERING: {
    text: "ĐANG GIAO HÀNG",
    color: "bg-indigo-100 text-indigo-800",
  },
  DELIVERED: { text: "ĐÃ GIAO HÀNG", color: "bg-green-100 text-green-800" },
  CANCELLED: { text: "ĐÃ HỦY", color: "bg-red-100 text-red-800" },
  REFUNDED: { text: "ĐÃ HOÀN TIỀN", color: "bg-purple-100 text-purple-800" },
  DEFAULT: { text: "-", color: "bg-gray-100 text-gray-800" },
};

const ProductItem = ({ product, orderId }) => (
  <div className="flex gap-4 p-4 border-b">
    <div className="flex-1">
      <Link
        className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
        to={`/user/purchase/order/${orderId}`}
      >
        {product.name}
      </Link>
      <div className="flex flex-wrap gap-2 mt-1 text-sm">
        <span className="text-gray-500">Màu: {product.color}</span>
        <span className="text-gray-500">SL: {product.quantity}</span>
      </div>

      <div className="mt-2 flex justify-between">
        <div>
          <span className="text-gray-500 text-sm">Đơn giá: </span>
          <span className="font-medium text-blue-700">
            {product.discountedPrice.toLocaleString("vi-VN")}đ
          </span>
        </div>

        <div className="text-right">
          <span className="text-gray-500 text-sm">Thành tiền: </span>
          <span className="font-medium text-blue-700">
            {product.calculatePrice.toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>
    </div>
  </div>
);

const OrderCard = ({ product, status, id, orderDate }) => {
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

      setToastMessage("Cập nhật đơn hàng thành công!");
      setToastSeverity("success");
    } catch (error) {
      setToastMessage("Lỗi khi cập nhật đơn hàng!");
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
    <div className="border border-gray-200 rounded-xl mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between bg-blue-50 px-5 py-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="font-bold text-gray-700">
            MÃ ĐƠN: <span className="text-blue-600">{id}</span>
          </div>

          {orderDate && (
            <div className="text-sm text-gray-500">
              Ngày đặt: {new Date(orderDate).toLocaleDateString("vi-VN")}
            </div>
          )}
        </div>

        <div
          className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium ${
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
      <div className="flex justify-between items-center px-5 py-3 bg-blue-50 border-t">
        <div className="text-gray-600 text-sm">{product.length} sản phẩm</div>
        <div className="text-right">
          <div className="text-gray-500 text-sm">Tổng tiền:</div>
          <div className="text-lg font-bold text-red-600">
            {totalAmount.toLocaleString("vi-VN")}đ
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white border-t">
        {statusRecently === "DELIVERING" && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-xs text-gray-500 max-w-md">
              <Inventory2OutlinedIcon className="inline mr-1 w-4 h-4" />
              Vui lòng chỉ nhấn "Đã nhận hàng" khi bạn đã kiểm tra sản phẩm
            </div>
            <button
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded-md transition-colors"
              onClick={() => handleStatusChange("DELIVERED")}
            >
              <CheckCircleOutlineOutlinedIcon className="w-4 h-4" />
              Đã nhận được hàng
            </button>
          </div>
        )}

        {(statusRecently === "PENDING" || statusRecently === "CONFIRM") && (
          <div className="flex justify-end">
            <button
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded-md transition-colors"
              onClick={() => handleStatusChange("CANCELLED")}
            >
              <HighlightOffOutlinedIcon className="w-4 h-4" />
              Hủy đơn hàng
            </button>
          </div>
        )}

        {statusRecently === "DELIVERED" && (
          <div className="flex justify-end">
            <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-md transition-colors">
              <UndoOutlinedIcon className="w-4 h-4" />
              Yêu cầu trả hàng
            </button>
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
