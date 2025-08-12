import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
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
  const [submittingReviewId, setSubmittingReviewId] = useState(null);
  const [showToast, setShowToast] = useState(false);

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
    const orderItemId = reviewData.orderItemId;
    setSubmittingReviewId(orderItemId);

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

      // Hiển thị toast notification
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);

      // Thay vì reload toàn bộ trang, chỉ cập nhật orderDetail
      const updatedOrderDetail = await fetchOrderByIdApi(orderId);
      setOrderDetail(updatedOrderDetail);
    } catch (err) {
      console.log("Lỗi khi tạo đánh giá:", err);
      throw err; // Re-throw to handle in ReviewDialog
    } finally {
      setSubmittingReviewId(null);
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
      ? "text-orange-500 border-orange-500"
      : "text-gray-400 border-gray-400";
  };

  return (
    <div className="p-5 w-full sm:w-4/5 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      {orderDetail ? (
        <>
          <div
            className="p-5 rounded-lg mb-4 uppercase text-xl font-extrabold bg-white shadow-md"
            style={{
              color: "#ea580c",
            }}
          >
            🐾 {user.displayName || "Khách hàng thú cưng"}
          </div>
          <div className="flex gap-2">
            <div className="w-1/4 rounded-lg p-5 bg-white shadow-md">
              <Link className="text-orange-700 items-center flex cursor-pointer mb-2 font-medium">
                <PermIdentityOutlinedIcon
                  sx={{ color: "#ea580c", marginRight: 1 }}
                />
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
                <AssignmentOutlinedIcon
                  sx={{ color: "#ea580c", marginRight: 1 }}
                />
                🛍️ Đơn mua
              </Link>
            </div>
            <div
              className="w-full rounded-lg shadow-md"
              style={{
                backgroundColor: "#fef7ed",
              }}
            >
              <div className="flex bg-white rounded-b-lg p-3 border-b border-dashed border-orange-200">
                <Link
                  className="text-orange-500 uppercase text-sm flex items-center hover:text-orange-600 font-medium"
                  to={"/user/purchase"}
                >
                  <ArrowBackIosIcon fontSize="small" />
                  🔙 Trở lại
                </Link>
                <div className="flex gap-2 ml-auto items-center">
                  <div className="text-sm uppercase text-orange-700 font-medium">
                    📋 MÃ ĐƠN HÀNG:{" "}
                    {orderDetail ? orderDetail.orderId.split("-")[0] : "-"}
                  </div>
                  <div className="text-orange-300 text-sm">|</div>
                  <div className="text-orange-600 font-bold text-sm uppercase">
                    {renderStatus()}
                  </div>
                </div>
              </div>
              <div className="rounded-lg py-10 bg-white flex flex-col items-center justify-center gap-3 shadow-sm">
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
                        ? "bg-orange-400"
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
                        ? "bg-orange-400"
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
                        ? "bg-orange-400"
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
                <div className="flex gap-6 text-sm text-orange-600 font-medium">
                  <div>📋 Đơn hàng đã đặt</div>
                  <div>✅ Đã xác nhận đơn hàng</div>
                  <div>🚚 Đang vận chuyển</div>
                  <div>🎉 Đã nhận hàng</div>
                </div>
              </div>

              <div className="h-[4px] bg-[length:44px_44px] bg-[repeating-linear-gradient(45deg,#fb923c_0px,#fb923c_25px,white_25px,white_38px,#ea580c_38px,#ea580c_44px)]"></div>
              <div className="bg-white p-5">
                <div className="text-lg text-orange-600 font-bold">
                  📍 Địa Chỉ Nhận Hàng
                </div>
                <div className="mt-2 font-medium text-orange-800">
                  👤 {orderDetail.receiverName}
                </div>
                <div className="text-sm text-gray-600">
                  📞 {orderDetail.receiverPhone}
                </div>
                <div className="text-sm text-gray-600">
                  🏠 {orderDetail.address}
                </div>
              </div>
              <div className="flex flex-col gap-2 bg-orange-50 p-4 rounded-lg">
                {Array.isArray(orderDetail.items) &&
                orderDetail.items.length > 0
                  ? orderDetail.items.map((item) => (
                      <div className="flex gap-1 items-center bg-white p-3 rounded-lg shadow-sm">
                        <div className="">
                          <Link
                            to={`/product/${item.prdId}`}
                            className="text-orange-600 hover:text-orange-700 font-medium"
                          >
                            🐾 {item.name || "-"}
                          </Link>
                          <div className="text-sm text-gray-500">
                            🏷️ Phân loại: {item.color || "-"}
                          </div>
                          <div className="text-sm text-gray-500">
                            📦 Số lượng: {item.quantity || "-"}
                          </div>
                        </div>
                        <div className="ml-auto flex gap-3 items-center">
                          <div className="text-orange-600 font-bold">
                            💰{" "}
                            {item.discountedPrice.toLocaleString("vi-VN") +
                              "đ" || "-"}
                          </div>
                          {orderDetail.status === "DELIVERED" &&
                          !item.isReviewed ? (
                            <button
                              onClick={() => setOpenReviewDialogId(item.id)}
                              disabled={submittingReviewId === item.id}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                submittingReviewId === item.id
                                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                  : "bg-orange-500 hover:bg-orange-600 text-white"
                              }`}
                            >
                              {submittingReviewId === item.id
                                ? "⏳ Đang xử lý..."
                                : "⭐ Viết nhận xét"}
                            </button>
                          ) : orderDetail.status === "DELIVERED" &&
                            item.isReviewed ? (
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                              ✅ Đã đánh giá
                            </span>
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
              <div className="flex w-full ml-auto p-5 bg-white rounded-lg shadow-sm">
                <div className="ml-auto">
                  <span className="text-orange-700 font-medium">
                    💸 Thành tiền:{" "}
                  </span>
                  <span className="text-orange-600 text-xl font-bold">
                    {orderDetail.totalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
              <div className="bg-orange-50 text-sm px-5 py-3 border border-orange-200 rounded-lg">
                <span className="text-orange-700">💳 Vui lòng thanh toán </span>
                <span className="text-orange-600 font-bold">
                  {orderDetail.totalPrice.toLocaleString("vi-VN")}đ
                </span>
                <span className="text-orange-700">
                  {" "}
                  khi nhận hàng cho thú cưng của bạn! 🐾
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 transform transition-all duration-500 ease-in-out">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-medium text-white">
                ✅ Đánh giá thành công
              </div>
              <div className="text-green-100 text-sm">
                Cảm ơn bạn đã đánh giá sản phẩm!
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="flex-shrink-0 ml-4 text-green-100 hover:text-white transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ReviewDialog = ({
  productId,
  orderItemId,
  open,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    try {
      const reviewData = {
        productId,
        rating,
        comment,
        images,
        orderItemId,
      };
      await onSubmit(reviewData);
      onClose();
      // Reset form
      setRating(5);
      setComment("");
      setImages([]);
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ backgroundColor: "#fed7aa", color: "#ea580c" }}>
        🐾 Đánh giá sản phẩm
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#ea580c" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ backgroundColor: "#fef7ed" }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box>
            <Typography
              component="legend"
              sx={{ color: "#ea580c", fontWeight: "bold" }}
            >
              ⭐ Đánh giá:
            </Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              sx={{
                "& .MuiRating-iconFilled": {
                  color: "#fb923c",
                },
                "& .MuiRating-iconHover": {
                  color: "#ea580c",
                },
              }}
            />
          </Box>
          <TextField
            label="💬 Nhận xét về sản phẩm"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#fb923c",
                },
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": {
                  color: "#ea580c",
                },
              },
            }}
          />
          <Button
            variant="outlined"
            component="label"
            startIcon={<ImageIcon />}
            sx={{
              borderColor: "#fb923c",
              color: "#ea580c",
              "&:hover": {
                borderColor: "#ea580c",
                backgroundColor: "#fef7ed",
              },
            }}
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
            <Typography variant="body2" sx={{ color: "#ea580c" }}>
              🖼️ {images.length} hình ảnh đã chọn
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#fed7aa", gap: 1 }}>
        <Button onClick={onClose} sx={{ color: "#9ca3af" }}>
          ❌ Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#ea580c",
            "&:hover": {
              backgroundColor: "#dc2626",
            },
            "&:disabled": {
              backgroundColor: "#9ca3af",
            },
          }}
        >
          {isSubmitting ? "⏳ Đang gửi..." : "🚀 Gửi đánh giá"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
