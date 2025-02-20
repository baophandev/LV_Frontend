import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import * as React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OrderDialog = ({ open, onClose, order, address, totalPrice }) => {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={onClose}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        maxWidth="lg"
      >
        <DialogContent>
          <div className="text-slate-600 font-bold border-b">
            Chi tiết đơn hàng
          </div>
          <div>Địa chỉ: </div>
          <div className="">
            Tên người nhận:{" "}
            <span className="text-sky-500">{address?.receiverName || "-"}</span>
          </div>
          <div>
            Địa chỉ nhận hàng:{" "}
            <span className="text-sky-500">
              {address?.detail || "-"} {", "}
              {address?.ward || "-"} {", "}
              {address?.district || "-"} {", "}
              {address?.province || "-"} {"."}
            </span>
          </div>
          <div className="border-b">
            Số điện thoại:{" "}
            <span className="text-sky-500">{address?.receiverPhone || ""}</span>
          </div>
          <div className="mt-2 border-b">
            {order && Object.values(order).length > 0 ? (
              Object.values(order).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <div>{index + 1}.</div>
                  <div>{item.productName} -</div>
                  <div>Số lượng: {item.quantity} -</div>
                  <div>
                    Đơn giá:{" "}
                    {item.discountValue > 0
                      ? (
                          (item.price || 0) *
                          (1 - item.discountValue / 100)
                        ).toLocaleString("vi-VN") + "đ"
                      : (item.price || 0).toLocaleString("vi-VN") + "đ"}{" "}
                    -
                  </div>
                  <div>
                    Thành tiền:
                    {(
                      (item.price || 0) *
                      (1 - item.discountValue / 100) *
                      (item.quantity || 0)
                    ).toLocaleString("vi-VN") + "đ"}
                  </div>
                </div>
              ))
            ) : (
              <div>Chưa chọn sản phẩm</div>
            )}
          </div>
          <div className="flex p-3 gap-1">
            <div className="ml-auto">Tổng thanh toán: {totalPrice}</div>
            <button className="bg-sky-500 px-3 text-white">Đặt hàng</button>
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default OrderDialog;
