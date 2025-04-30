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
import { createOrderApi } from "../api/orderApi";
import vnpay from "../assets/vnpay.png"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderDialog = ({ open, onClose, order, address, totalPrice }) => {
  const user = useSelector((state) => state.user.user);
  const userId = user.id;
  const [note, setNote] = useState("");

  const handleCreateOrder = async () => {
    try{
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
          itemId: Object.values(order)
            .map((item) => item.itemId)
        },
        userId,
      });
      console.log(response);
      alert("Đặt hàng thành công");
      onClose();
      window.location.reload();
    }catch(error){
      console.error("Error creating order:", error);
    }
  }

  console.log("order", order);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={onClose}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
      fullWidth
      maxWidth="lg"
    >
      <div className="h-[4px] bg-[length:44px_44px] bg-[repeating-linear-gradient(45deg,#f18d9b_0px,#f18d9b_25px,white_25px,white_38px,#6fa6d6_38px,#6fa6d6_44px)]"></div>
      <DialogContent>
        <div className="text-slate-600 border-b">Chi tiết đơn hàng</div>
        <div className=" mt-3 font-semibold">Địa Chỉ Nhận Hàng</div>
        <div className="pl-3">
          Tên người nhận:{" "}
          <span className="">{address?.receiverName || "-"}</span>
        </div>
        <div className="pl-3">
          Địa chỉ nhận hàng:{" "}
          <span className="">{`${address?.detail || "-"}, ${
            address?.ward || "-"
          }, ${address?.district || "-"}, ${address?.province || "-"}.`}</span>
        </div>
        <div className="border-b pl-3">
          Số điện thoại:{" "}
          <span className="">{address?.receiverPhone || ""}</span>
        </div>

        <div className="mt-2 border-b">
          {order && Object.values(order).length > 0 ? (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead style={{ backgroundColor: ThemeColor.LIGHT_GRAY }}>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Đơn giá</TableCell>
                    <TableCell>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(order).map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        {item.discountValue > 0
                          ? (
                              (item.price || 0) *
                              (1 - item.discountValue / 100)
                            ).toLocaleString("vi-VN") + "đ"
                          : (item.price || 0).toLocaleString("vi-VN") + "đ"}
                      </TableCell>
                      <TableCell>
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
            <div>Chưa chọn sản phẩm</div>
          )}
        </div>
        <div className="w-full mt-2">
          <div className="font-bold">Ghi chú</div>
          <textarea
            onChange={(e) => setNote(e.target.value)}
            value={note}
            className="w-full outline-none border p-3 rounded-md"
            name=""
            id=""
          ></textarea>
        </div>
        <div className="flex flex-col p-3 gap-1 items-center">
          <div className="ml-auto font-semibold text-blue-500 mb-2">
            Tổng thanh toán: {totalPrice.toLocaleString("vi-VN") + "đ"}
          </div>
          <div className="flex ml-auto items-center gap-2">
            <button
              onClick={() => handleCreateOrder()}
              className="rounded-2xl text-white py-1 px-3 bg-blue-500 shadow-md"
            >
              Thanh toán khi nhận hàng
            </button>
            <div>Hoặc</div>
            <button
              onClick={() => handleCreateOrder()}
              className="rounded-2xl bg-white py-1 px-4 text-blue-500 shadow-md border flex"
            >
              <img src={vnpay} alt="" className="w-6" /> Thanh toán qua VNPay
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
