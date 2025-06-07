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
import ThemeColor from "../constant/theme";
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
      const response = await createVNPayUrl(totalPrice);
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
    >
      {/* Stripe top bar */}
      <div className="h-[4px] bg-[length:44px_44px] bg-[repeating-linear-gradient(45deg,#f18d9b_0px,#f18d9b_25px,white_25px,white_38px,#6fa6d6_38px,#6fa6d6_44px)]" />

      <DialogContent className="text-sm text-slate-700">
        {/* Tiêu đề */}
        <div className="text-xl font-bold border-b pb-2 mb-3">
          Chi tiết đơn hàng
        </div>

        {/* Địa chỉ nhận hàng */}
        <div className="space-y-1 mb-4">
          <div className="font-semibold">Địa Chỉ Nhận Hàng</div>
          <div className="pl-3">
            Tên người nhận: <span>{address?.receiverName || "-"}</span>
          </div>
          <div className="pl-3">
            Địa chỉ nhận hàng:{" "}
            <span>
              {`${address?.detail || "-"}, ${address?.ward || "-"}, ${
                address?.district || "-"
              }, ${address?.province || "-"}.`}
            </span>
          </div>
          <div className="pl-3 border-b pb-2">
            Số điện thoại: <span>{address?.receiverPhone || "-"}</span>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="mb-4 border-b pb-4">
          {order && Object.values(order).length > 0 ? (
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead style={{ backgroundColor: ThemeColor.LIGHT_GRAY }}>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="center">SL</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(order).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        {(item.discountValue > 0
                          ? item.price * (1 - item.discountValue / 100)
                          : item.price
                        ).toLocaleString("vi-VN") + "đ"}
                      </TableCell>
                      <TableCell align="right">
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
            <div className="text-center text-gray-500 py-4">
              Chưa chọn sản phẩm
            </div>
          )}
        </div>

        {/* Ghi chú */}
        <div className="mb-4">
          <div className="font-bold mb-1">Ghi chú</div>
          <textarea
            onChange={(e) => setNote(e.target.value)}
            value={note}
            className="w-full outline-none border p-3 rounded-md resize-none text-sm"
            rows={3}
            placeholder="Thêm ghi chú cho đơn hàng (nếu có)..."
          ></textarea>
        </div>

        {/* Tổng tiền và nút thanh toán */}
        <div className="flex flex-col gap-3 items-end">
          <div className="text-lg font-bold text-blue-600">
            Tổng thanh toán: {totalPrice.toLocaleString("vi-VN") + "đ"}
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={handleCreateOrder}
              className="rounded-full text-white py-2 px-4 bg-blue-500 hover:bg-blue-600 transition shadow"
            >
              Thanh toán khi nhận hàng
            </button>
            <span className="text-gray-500">Hoặc</span>
            <button
              onClick={handleVNpay}
              className="rounded-full bg-white py-2 px-4 text-blue-500 border border-blue-500 flex items-center gap-2 hover:bg-blue-50 transition"
            >
              <img src={vnpay} alt="vnpay" className="w-5" />
              VNPay
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
