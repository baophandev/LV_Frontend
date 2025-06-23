import { useState } from "react";
import { Link } from "react-router-dom";
import { updateOrderStatusApi } from "../api/orderApi";
import { useDispatch } from "react-redux";
import { localUpdateStatus } from "../redux/slices/orderSlice";
import { Snackbar, Alert } from "@mui/material";

const OrderCard = ({ product, status, id }) => {

  const [statusRecently, setStatusRecently] = useState(status);
  const dispatch = useDispatch();
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  const renderStatus = () => {
    switch (statusRecently) {
      case "PENDING":
        return "CHỜ XÁC NHẬN";
      case "CONFIRM": 
        return "ĐÃ XÁC NHẬN";
      case "DELIVERING":
        return "ĐANG GIAO HÀNG";
      case "DELIVERED":
        return "ĐÃ GIAO HÀNG";
      case "CANCELLED":
        return "ĐÃ HỦY";
      case "REFUNDED":
        return "ĐÃ HOÀN TIỀN";
      default:
        return "-";
    }
  };

  const handleStatusChange = async (newStatus) => {
    const oldStatus = statusRecently;
    setStatusRecently(newStatus);
    try {
      await updateOrderStatusApi(id, newStatus);
      dispatch(
        localUpdateStatus({ orderId: id, oldStatus, newStatus })
      );
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

  return (
    <div className="border rounded-xl mb-5">
      <div className="flex border-b bg-slate-100 rounded-t-xl px-5 py-4 items-center">
        <div className="font-bold uppercase text-slate-600">
          MÃ ĐƠN HÀNG: {id}{" "}
        </div>
        <div className="ml-auto bg-green-100 text-sm text-green-700 font-bold px-4 py-1 rounded-full">
          {renderStatus()}
        </div>
      </div>
      {Array.isArray(product) && product.length > 0
        ? product.map((prd, index) => (
            <>
              <div className="flex flex-col gap-2 bg-white p-7 border-b">
                <div className="flex gap-1 items-center">
                  {/* <Link to={"/user/purchase/order/id"}>
            <img src="https://placehold.co/600x400" className="w-28 " alt="" />
          </Link> */}
                  <div className="">
                    <Link
                      className="font-semibold text-lg text-slate-600"
                      to={`/user/purchase/order/${id}`}
                    >
                      {prd.name}
                    </Link>
                    <div className="text-sm text-gray-400">{prd.color}</div>
                    <div className="text-sm text-gray-400">
                      Số lượng: {prd.quantity}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <div>
                      <span className="text-sm">Giá bán: </span>{" "}
                      <span className="text-blue-800 font-semibold">
                        {prd.discountedPrice.toLocaleString("vi-VN") + "đ"}
                      </span>
                    </div>
                    <div className="">
                      <span className="text-sm">Thành tiền: </span>
                      <span className="text-blue-800 font-semibold">
                        {prd.calculatePrice.toLocaleString("vi-VN") + "đ"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))
        : ""}
      <div className="flex items-center bg-slate-100 rounded-b-xl py-4 px-5">
        {status === "DELIVERING" ? (
          <>
            <div className="text-xs text-gray-400">
              Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao
              đến
              <br />
              bạn và sản phẩm nhận được không có vấn đề nào.
            </div>
            <div className="ml-auto flex flex-col gap-1">
              <div className="ml-auto">
                <button
                  className="bg-yellow-400 px-2 py-1 text-white rounded-md"
                  onClick={() => handleStatusChange("DELIVERED")}
                >
                  Đã nhận được hàng
                </button>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        {status === "PENDING" || status === "CONFIRM" ? (
          <div className="ml-auto flex flex-col gap-1">
            <div className="ml-auto">
              <button
                className="bg-red-500 px-2 py-1 text-white rounded-md"
                onClick={() => handleStatusChange("CANCELLED")}
              >
                Hủy đơn hàng
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        {status === "DELIVERED" ? (
          <div className="ml-auto flex flex-col gap-1">
            <div className="ml-auto">
              <button className="bg-sky-500 px-3 py-2 text-white rounded-md">
                Yêu cầu trả hàng
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
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
