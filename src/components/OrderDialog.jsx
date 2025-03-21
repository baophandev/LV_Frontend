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
  Button,
} from "@mui/material";
import ThemeColor from "../constant/theme";
import { useSelector } from "react-redux";
import { useState } from "react";
import { createOrderApi } from "../api/orderApi";

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
        <div className="text-slate-600 font-bold border-b">
          Chi tiết đơn hàng
        </div>
        <div className="text-lg mt-3">Địa Chỉ Nhận Hàng</div>
        <div className="pl-3">
          Tên người nhận:{" "}
          <span className="text-sky-500">{address?.receiverName || "-"}</span>
        </div>
        <div className="pl-3">
          Địa chỉ nhận hàng:{" "}
          <span className="text-sky-500">{`${address?.detail || "-"}, ${
            address?.ward || "-"
          }, ${address?.district || "-"}, ${address?.province || "-"}.`}</span>
        </div>
        <div className="border-b pl-3">
          Số điện thoại:{" "}
          <span className="text-sky-500">{address?.receiverPhone || ""}</span>
        </div>

        <div className="mt-2 border-b">
          {order && Object.values(order).length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead style={{backgroundColor: ThemeColor.LIGHT_GRAY}}>
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
            <textarea onChange={(e) => setNote(e.target.value)} value={note} className="w-full outline-none border p-3 rounded-md" name="" id=""></textarea>
          </div>
        <div className="flex p-3 gap-1">
          <div className="ml-auto text-lg  text-yellow-400">Tổng thanh toán: {(totalPrice).toLocaleString("vi-VN") + "đ"}</div>
          <Button onClick={() => handleCreateOrder()} variant="contained" color="primary">
            Đặt hàng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
