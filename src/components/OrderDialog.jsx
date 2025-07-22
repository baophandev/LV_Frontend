import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { createOrderApi, createVNPayUrl } from "../api/orderApi";
import vnpay from "../assets/vnpay.png";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderDialog = ({ open, onClose, order, address, totalPrice }) => {
  const user = useSelector((state) => state.user.user);
  const userId = user.id;
  const [note, setNote] = useState("");

  const handleCreateOrder = async () => {
    try {
      const response = await createOrderApi({
        order: {
          items: Object.values(order).map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            discountValue: item.discountValue,
          })),
          addressId: address.id,
          note: note,
          method: "COD",
          itemId: Object.values(order).map((item) => item.itemId),
        },
        userId,
      });
      console.log(response);
      alert("Đặt hàng thành công");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleVNpay = async () => {
    try {
      const tempOrder = {
        items: Object.values(order).map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          discountValue: item.discountValue,
        })),
        addressId: address.id,
        note: note,
        method: "BANKING",
        itemId: Object.values(order).map((item) => item.itemId),
      };

      // Tạo URL thanh toán, gửi theo totalPrice và thông tin đơn hàng
      const response = await createVNPayUrl(totalPrice, tempOrder); // hoặc encode lên URL
      window.localStorage.setItem("pendingOrder", JSON.stringify(tempOrder)); // lưu lại để tạo sau khi thanh toán
      window.localStorage.setItem("userId", userId); // lưu userId
      window.location.href = response.paymentUrl;
    } catch (error) {
      console.error("Error creating VNPay URL:", error);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={onClose}
      keepMounted
      fullWidth
      maxWidth="lg"
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          maxHeight: "70vh"
        },
      }}
    >
      {/* Stripe top bar */}
      <div className="h-[4px] bg-[length:44px_44px] bg-[repeating-linear-gradient(45deg,#f18d9b_0px,#f18d9b_25px,white_25px,white_38px,#6fa6d6_38px,#6fa6d6_44px)]" />

      <DialogContent className="text-sm text-slate-700 bg-gray-50">
        {/* Tiêu đề */}
        <div className="text-2xl font-bold pb-4 mb-4 border-b border-gray-200 text-blue-700 flex justify-between items-center">
          <span>Chi tiết đơn hàng</span>
        </div>

        {/* Địa chỉ nhận hàng */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
          <div className="font-semibold text-lg mb-2 text-gray-800">
            Địa Chỉ Nhận Hàng
          </div>
          <div className="space-y-2 pl-2">
            <div className="flex">
              <span className="font-medium w-32">Người nhận:</span>
              <span className="text-gray-700">
                {address?.receiverName || "-"}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium w-32">Địa chỉ:</span>
              <span className="text-gray-700">
                {`${address?.detail || "-"}, ${address?.ward || "-"}, ${
                  address?.district || "-"
                }, ${address?.province || "-"}.`}
              </span>
            </div>
            <div className="flex">
              <span className="font-medium w-32">Số điện thoại:</span>
              <span className="text-gray-700">
                {address?.receiverPhone || "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="mb-6">
          <div className="font-semibold text-lg mb-3 text-gray-800">
            Sản phẩm
          </div>
          {order && Object.values(order).length > 0 ? (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <Table size="small">
                <TableHead className="bg-blue-50">
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                      #
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#374151" }}>
                      Sản phẩm
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 600, color: "#374151" }}
                    >
                      SL
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, color: "#374151" }}
                    >
                      Đơn giá
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, color: "#374151" }}
                    >
                      Thành tiền
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(order).map((item, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": { backgroundColor: "#f9fafb" },
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {item.productName}
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right" sx={{ color: "#3b82f6" }}>
                        {(item.discountValue > 0
                          ? item.price * (1 - item.discountValue / 100)
                          : item.price
                        ).toLocaleString("vi-VN") + "đ"}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {(
                          (item.price || 0) *
                          (1 - item.discountValue / 100) *
                          (item.quantity || 0)
                        ).toLocaleString("vi-VN") + "đ"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="text-center text-gray-500 py-8 bg-white rounded-xl border border-dashed border-gray-300">
              Chưa chọn sản phẩm
            </div>
          )}
        </div>

        {/* Ghi chú */}
        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="font-bold text-lg mb-2 text-gray-800">Ghi chú</div>
          <textarea
            onChange={(e) => setNote(e.target.value)}
            value={note}
            className="w-full outline-none border p-3 rounded-lg resize-none text-sm 
                      focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all
                      border-gray-300"
            rows={3}
            placeholder="Thêm ghi chú cho đơn hàng (nếu có)..."
          ></textarea>
        </div>
        <div className="flex w-full justify-end mb-2">
          <div className="text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full">
            Tổng thanh toán: {totalPrice.toLocaleString("vi-VN") + "đ"}
          </div>
        </div>
        {/* Tổng tiền và nút thanh toán */}
        <div className="flex flex-col gap-4 items-end pt-4 border-t border-gray-200">
          <div className="flex gap-3 items-center">
            <button
              onClick={handleCreateOrder}
              className="rounded-full text-white py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 
                        hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl
                        font-medium text-base"
            >
              Thanh toán khi nhận hàng
            </button>
            <span className="text-gray-500 text-sm">Hoặc</span>
            <button
              onClick={handleVNpay}
              className="rounded-full bg-white py-3 px-6 text-blue-600 border border-blue-300 
                        flex items-center gap-2 hover:bg-blue-50 transition-all shadow hover:shadow-md
                        font-medium text-base hover:border-blue-400"
            >
              <img src={vnpay} alt="vnpay" className="w-6" />
              Thanh toán VNPay
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
