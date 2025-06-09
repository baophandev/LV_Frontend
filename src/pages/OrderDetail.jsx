import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeColor from "../constant/theme";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useEffect, useState } from "react";
import { fetchOrderByIdApi } from "../api/orderApi";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Image as ImageIcon, Close as CloseIcon } from "@mui/icons-material";
import { createReviewApi } from "../api/reviewApi";

export const OrderDetail = () => {
  const user = useSelector((state) => state.user.user);
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [openReviewDialogId, setOpenReviewDialogId] = useState(null);

  useEffect(() => {
    const getOrderDetail = async () => {
      if (!orderId) return;
      try {
        const response = await fetchOrderByIdApi(orderId);
        setOrderDetail(response);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
      }
    };

    getOrderDetail();
  }, [orderId]);

  console.log("orderDetail", orderDetail);

  const renderStatus = () => {
    if (!orderDetail) return "-";
    switch (orderDetail.status) {
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

  const handleSubmitReview = async (reviewData) => {
    console.log("Review submitted:", reviewData);
    try {
      const formData = new FormData();

      // Đóng gói thông tin variant vào JSON blob
      const data = {
        prdId: reviewData.productId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        orderItemId: reviewData.orderItemId,
        userId: user.id,
      };
      const reviewBlob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      formData.append("data", reviewBlob);

      // Thêm nhiều ảnh (nếu có)
      for (let i = 0; i < reviewData.images.length; i++) {
        formData.append("files", reviewData.images[i]);
      }
      // Gửi API
      await createReviewApi(formData);

      // Reset lại sau khi update
      setOpenReviewDialogId(false);
      window.location.reload(); // Tải lại trang để cập nhật biến thể
    } catch (err) {
      console.log("Lỗi khi cập nhật biến thể:", err);
    }
  };

  const getIconColor = (step) => {
    if (!orderDetail) return "text-gray-400 border-gray-400";
    const statusStep = {
      PENDING: 1,
      CONFIRMED: 2,
      DELIVERING: 3,
      DELIVERED: 4,
    };

    const currentStep = statusStep[orderDetail.status] || 0;
    return currentStep >= step
      ? "text-green-500 border-green-500"
      : "text-gray-400 border-gray-400";
  };

  return (
    <div className="p-5 w-full sm:w-4/5">
      {orderDetail ? (
        <>
          <div
            className=" p-5 rounded-md mb-4 uppercase text-xl font-extrabold bg-white"
            style={{
              color: ThemeColor.MAIN_GRREN,
            }}
          >
            {user.displayName || "Không rõ tên"}
          </div>
          <div className="flex gap-2">
            <div className="w-1/4 rounded-md p-5 bg-white">
              <Link className=" text-slate-700  items-center flex cursor-pointer mb-2">
                <PermIdentityOutlinedIcon />
                Tài khoản của tôi
              </Link>
              <Link
                to={"/user/account"}
                className="  items-center flex cursor-pointer text-slate-700 hover:text-sky-400 mb-2 ml-4"
              >
                Hồ sơ
              </Link>
              <Link
                to={"/user/address"}
                className=" text-slate-700 hover:text-sky-400  items-center flex cursor-pointer mb-2 ml-4 "
              >
                Địa chỉ
              </Link>
              <Link
                to={"/user/purchase"}
                className=" text-sky-400 items-center flex cursor-pointer "
              >
                <AssignmentOutlinedIcon />
                Đơn mua
              </Link>
            </div>
            <div
              className="w-full rounded-md"
              style={{
                backgroundColor: ThemeColor.LIGHT_GRAY,
              }}
            >
              <div className="flex bg-white rounded-b-md p-2 border-b border-dashed">
                <Link
                  className="text-gray-400 uppercase text-sm flex items-center"
                  to={"/user/purchase"}
                >
                  <ArrowBackIosIcon fontSize="" />
                  Trở lại
                </Link>
                <div className="flex gap-2 ml-auto items-center">
                  <div className="text-sm uppercase">
                    MÃ ĐƠN HÀNG: {orderDetail ? orderDetail.orderId : "-"}
                  </div>
                  <div className="text-sm">|</div>
                  <div className="text-orange-600 text-sm uppercase">
                    {renderStatus()}
                  </div>
                </div>
              </div>
              <div className="rounded-md py-10 bg-white flex flex-col items-center justify-center gap-3">
                <div className="flex justify-center items-center">
                  {/* Đơn hàng đã đặt */}
                  <div
                    className={`flex justify-center items-center border-2 rounded-full w-16 p-5 h-16 ${getIconColor(
                      1
                    )}`}
                  >
                    <ReceiptIcon fontSize="large" />
                  </div>
                  <div
                    className={`w-20 h-1 ${
                      orderDetail && orderDetail.status !== "PENDING"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></div>

                  {/* Đã xác nhận đơn hàng */}
                  <div
                    className={`flex justify-center items-center border-2 rounded-full w-16 p-5 h-16 ${getIconColor(
                      2
                    )}`}
                  >
                    <ReceiptLongIcon fontSize="large" />
                  </div>
                  <div
                    className={`w-20 h-1 ${
                      (orderDetail && orderDetail.status === "SHIPPING") ||
                      orderDetail.status === "DELIVERED"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></div>

                  {/* Đang vận chuyển */}
                  <div
                    className={`flex justify-center items-center border-2 rounded-full w-16 p-5 h-16 ${getIconColor(
                      3
                    )}`}
                  >
                    <LocalShippingIcon fontSize="large" />
                  </div>
                  <div
                    className={`w-20 h-1 ${
                      orderDetail && orderDetail.status === "DELIVERED"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  ></div>

                  {/* Đã nhận hàng */}
                  <div
                    className={`flex justify-center items-center border-2 rounded-full w-16 p-5 h-16 ${getIconColor(
                      4
                    )}`}
                  >
                    <CheckCircleIcon fontSize="large" />
                  </div>
                </div>
                <div className="flex gap-6 text-sm text-green-500">
                  <div>Đơn hàng đã đặt</div>
                  <div>Đã xác nhận đơn hàng</div>
                  <div>Đang vận chuyển</div>
                  <div>Đã nhận hàng</div>
                </div>
              </div>

              <div className="h-[4px] bg-[length:44px_44px] bg-[repeating-linear-gradient(45deg,#f18d9b_0px,#f18d9b_25px,white_25px,white_38px,#6fa6d6_38px,#6fa6d6_44px)]"></div>
              <div className="bg-white p-5">
                <div className="text-lg text-slate-400">Địa Chỉ Nhận Hàng</div>
                <div className="mt-2">{orderDetail.receiverName}</div>
                <div className="text-sm text-gray-500">
                  {orderDetail.receiverPhone}
                </div>
                <div className="text-sm text-gray-500">
                  {orderDetail.address}
                </div>
              </div>
              <div className="flex flex-col gap-2 bg-slate-50 p-4">
                {Array.isArray(orderDetail.items) &&
                orderDetail.items.length > 0
                  ? orderDetail.items.map((item) => (
                      <div className="flex gap-1 items-center">
                        <div className="">
                          <Link to={`/product/${item.prdId}`}>
                            {item.name || "-"}
                          </Link>
                          <div className="text-sm text-gray-400">
                            Phân lọai: {item.color || "-"}
                          </div>
                          <div className="text-sm text-gray-400">
                            Số lượng: {item.quantity || "-"}
                          </div>
                        </div>
                        <div className="ml-auto flex gap-3 items-center">
                          <div>
                            {item.discountedPrice.toLocaleString("vi-VN") +
                              "đ" || "-"}
                          </div>
                          {orderDetail.status === "DELIVERED" && !item.isReviewed ? (
                            <button
                              onClick={() => setOpenReviewDialogId(item.id)}
                              className="px-4 py-2 bg-sky-500 rounded-md text-white"
                            >
                              Viết nhận xét
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                        {orderDetail.status === "DELIVERED" &&
                        !item.isReviewed && (
                          <ReviewDialog
                            open={openReviewDialogId === item.id}
                            onClose={() => setOpenReviewDialogId(null)}
                            productId={item.prdId}
                            orderItemId={item.id}
                            onSubmit={handleSubmitReview}
                          />
                        )}
                      </div>
                    ))
                  : ""}
              </div>
              <div className="flex w-full ml-auto p-5 bg-white">
                <div className="ml-auto">
                  Thành tiền:{" "}
                  <span className="text-sky-500 text-lg">
                    {orderDetail.totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
              <div className="bg-sky-50 text-sm px-5 py-2 border border-sky-300">
                Vui lòng thanh toán{" "}
                <span className="text-sky-500 font-semibold">
                  {orderDetail.totalPrice.toLocaleString("vi-VN")}đ
                </span>{" "}
                khi nhận hàng
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export const ReviewDialog = ({ productId, orderItemId, open, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = () => {
    const reviewData = {
      productId,
      rating,
      comment,
      images,
      orderItemId,
    };
    onSubmit(reviewData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Đánh giá sản phẩm
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box>
            <Typography component="legend">Đánh giá:</Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
          </Box>
          <TextField
            label="Nhận xét"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="outlined"
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<ImageIcon />}
          >
            Tải hình ảnh
            <input
              type="file"
              accept="image/*"
              hidden
              multiple
              onChange={handleImageChange}
            />
          </Button>
          {images.length > 0 && (
            <Typography variant="body2" color="textSecondary">
              {images.length} hình ảnh đã chọn
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Gửi đánh giá
        </Button>
      </DialogActions>
    </Dialog>
  );
}
