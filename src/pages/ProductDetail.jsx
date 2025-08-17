import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../redux/slices/productSlice";
import Loading from "../components/Loading";
import { useParams, useNavigate } from "react-router-dom";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import CompareIcon from "@mui/icons-material/Compare";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import UpSizeImage from "../components/UpSizeImage";
import AttributeTable from "../components/AttributeTable";
import ReviewCard from "../components/ReviewCard";
import { getProductReview, getVariantDiscount } from "../api/productApi";
import { addtoCartApi } from "../api/cartApi";
import { fetchCart } from "../redux/slices/cartSlice";
import { Snackbar, Alert } from "@mui/material";
import { getErrorMessage, getSuccessMessage } from "../utils/messageUtils";

export const ProductDetail = () => {
  const [amount, setAmount] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product?.products);
  const status = useSelector((state) => state.product.status);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [updatedProduct, setUpdatedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedItems, setSelectedItems] = useState(null);
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.auth.token);
  const userId = user.id;
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const [displayImages, setDisplayImages] = useState([]);

  // Lấy dữ liệu sản phẩm từ Redux khi component mount
  useEffect(() => {
    dispatch(fetchProduct(productId));
  }, [dispatch, productId]);

  // Cập nhật variants với discount nếu có dữ liệu product
  useEffect(() => {
    if (!product) return; // Đảm bảo product không null hay undefined

    if (Array.isArray(product.variants) && product.variants.length > 0) {
      const updateVariantsWithDiscount = async () => {
        try {
          const updatedVariants = await Promise.all(
            product.variants.map(async (variant) => {
              try {
                const discountResponse = await getVariantDiscount(variant.id);
                return {
                  ...variant,
                  discountValue: discountResponse?.discountValue || 0,
                };
              } catch (err) {
                console.error(err);
                return { ...variant, discountValue: 0 };
              }
            })
          );
          setUpdatedProduct({ ...product, variants: updatedVariants });
        } catch (error) {
          console.error("Lỗi khi cập nhật variants với discount: ", error);
        }
      };
      updateVariantsWithDiscount();
    } else {
      // Nếu không có variants, đảm bảo product vẫn được cập nhật với variants là []
      setUpdatedProduct({ ...product, variants: [] });
    }
  }, [product]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reivews = await getProductReview({
          pageNumber: 0,
          pageSize: 6,
          productId,
        });
        setReviews(reivews.content || []);
      } catch (error) {
        console.log(error);
        setReviews([]);
      }
    };
    fetchReviews();
  }, [productId]);

  // Sử dụng product đã cập nhật nếu có, nếu không thì sử dụng product gốc từ Redux
  const displayedProduct = updatedProduct || product;

  useEffect(() => {
    if (!displayedProduct) return;

    if (selectedItems?.variantImages?.length > 0) {
      // Nếu chọn biến thể có ảnh riêng thì chỉ hiển thị ảnh của biến thể
      setDisplayImages(selectedItems.variantImages);
    } else {
      // Hiển thị avatar + ảnh của tất cả biến thể
      const images = [];

      // Thêm ảnh đại diện sản phẩm (productAvatar)
      if (displayedProduct.productAvatar?.data) {
        images.push(displayedProduct.productAvatar);
      }

      // Thêm ảnh từ các biến thể
      displayedProduct.variants?.forEach((variant) => {
        if (Array.isArray(variant.variantImages)) {
          images.push(...variant.variantImages);
        }
      });

      setDisplayImages(images);
    }
  }, [displayedProduct, selectedItems]);

  if (status === "loading") return <Loading />;
  if (status === "failed")
    return (
      <div className="flex items-center justify-center text-red-700 p-4">
        Đã có lỗi xảy ra
      </div>
    );

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSelectedItems = (item) => {
    setSelectedItems((prev) => (prev?.id === item.id ? null : item));
  };

  const handleAddToCart = async () => {
    // Kiểm tra đăng nhập trước khi thêm vào giỏ hàng
    if (!token || !user || !user.id) {
      setToastMessage("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      setToastSeverity("warning");
      setOpenToast(true);
      // Chuyển hướng đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    if (!selectedItems) {
      setToastMessage(
        "Vui lòng chọn một biến thể trước khi thêm vào giỏ hàng!"
      );
      setToastSeverity("warning");
      setOpenToast(true);
      return;
    }

    try {
      await addtoCartApi({
        userId,
        variantId: selectedItems.id,
        quantity: amount,
      });
      setAmount(1);
      dispatch(fetchCart(userId));
      setToastMessage(getSuccessMessage("ADD_TO_CART_SUCCESS"));
      setToastSeverity("success");
      setOpenToast(true);
    } catch (error) {
      const errorMsg = getErrorMessage(
        error,
        "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại."
      );
      setToastMessage(errorMsg);
      setToastSeverity("error");
      setOpenToast(true);
    }
  };

  const handleCompareProduct = () => {
    navigate(`/product/compare?product1=${productId}`);
  };

  return (
    <>
      {/* Main container - responsive width */}
      <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 lg:p-5 bg-white mt-3 sm:mt-5 mb-4">
        {/* Product main section - responsive flex layout */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-7 p-2 py-3 sm:py-5 rounded-md">
          {/* Image section - responsive width and layout */}
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              {/* Main image */}
              <div className="w-full sm:w-[85%] h-64 sm:h-72 lg:h-80 rounded-md bg-white">
                {displayImages.length > 0 ? (
                  <>
                    <img
                      className="w-full h-full rounded-md cursor-pointer"
                      src={`data:image/png;base64,${displayImages[imageIndex]?.data}`}
                      alt={displayedProduct?.name || "Ảnh sản phẩm"}
                      style={{ objectFit: "contain" }}
                      onClick={handleClickOpen}
                    />
                    <UpSizeImage
                      open={open}
                      handleClose={handleClose}
                      images={displayImages}
                      imageNumber={imageIndex}
                    />
                  </>
                ) : (
                  <img
                    className="w-full h-full rounded-md"
                    src={"https://placehold.co/600x400"}
                    style={{ objectFit: "cover" }}
                    alt="Ảnh lỗi"
                  />
                )}
              </div>

              {/* Thumbnail images - responsive layout */}
              <div className="flex sm:flex-col gap-1 w-full sm:w-[20%] h-auto sm:h-72 overflow-x-auto sm:overflow-y-auto">
                {displayImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-16 sm:w-full h-16 sm:h-24 cursor-pointer rounded-md bg-white"
                    onClick={() => setImageIndex(index)}
                  >
                    <img
                      className="w-full h-full rounded-md"
                      src={`data:image/png;base64,${image.data}`}
                      style={{ objectFit: "contain" }}
                      alt="Ảnh lỗi"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product info section - responsive */}
          <div className="w-full lg:w-1/2 flex flex-col gap-3">
            {/* Product name */}
            <div className="text-xl sm:text-2xl font-extrabold uppercase leading-tight">
              {displayedProduct?.name || "Tên sản phẩm"}
            </div>

            {/* Rating */}
            <Box
              sx={{
                width: "100%",
                maxWidth: 200,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Rating
                name="text-feedback"
                value={displayedProduct?.rating || 0}
                readOnly
                precision={0.5}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
            </Box>

            {/* Price section */}
            <div className="flex flex-col gap-1 pb-2 border-b border-gray-200">
              {(() => {
                const price =
                  selectedItems?.price ||
                  displayedProduct.firstVariantPrice ||
                  0;
                const discount = selectedItems?.discountValue || 0;
                const discountedPrice = Math.round(
                  price * (1 - discount / 100)
                );

                return (
                  <>
                    <div className="text-xl sm:text-2xl font-extrabold text-sky-500">
                      {discountedPrice.toLocaleString("vi-VN")} VNĐ
                    </div>

                    {discount > 0 && (
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-500 text-sm sm:text-base">
                        <span className="line-through">
                          {price.toLocaleString("vi-VN")} VNĐ
                        </span>
                        <span className="bg-red-100 text-red-500 px-2 py-0.5 rounded font-semibold">
                          -{discount}%
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Color selection */}
            <div className="text-gray-400 text-sm sm:text-base">
              Chọn màu sắc:
            </div>
            <div className="flex gap-2 flex-wrap border-b border-b-gray-200 pb-2">
              {displayedProduct?.variants &&
              displayedProduct.variants.length > 0 ? (
                displayedProduct.variants.map(
                  (_variant, idx) =>
                    _variant.isActive && (
                      <div
                        key={_variant.id || idx}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300"
                        style={{
                          backgroundColor: _variant.colorCode || "#fff",
                          border:
                            selectedItems?.id === _variant.id
                              ? `3px solid #16a34a `
                              : "1px solid #ccc",
                          cursor: "pointer",
                        }}
                        onClick={() => handleSelectedItems(_variant)}
                      ></div>
                    )
                )
              ) : (
                <div className="text-sm sm:text-base">
                  Không có lựa chọn màu sắc
                </div>
              )}
            </div>

            {/* Stock info */}
            {selectedItems && (
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200 rounded-xl shadow-sm">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Đã bán:
                  </span>
                  <span className="font-semibold text-sky-600 text-sm sm:text-base">
                    {selectedItems?.sold || "0"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-xl shadow-sm">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Còn lại:
                  </span>
                  <span className="font-semibold text-green-700 text-sm sm:text-base">
                    {selectedItems?.stock || "0"}
                  </span>
                </div>
              </div>
            )}

            {/* Login notice */}
            {(!token || !user || !user.id) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 my-3">
                <div className="flex items-center gap-2 text-yellow-700">
                  <i className="fa-solid fa-exclamation-triangle text-sm"></i>
                  <span className="text-xs sm:text-sm font-medium">
                    Bạn cần đăng nhập để có thể thêm sản phẩm vào giỏ hàng
                  </span>
                </div>
              </div>
            )}

            {/* Quantity and action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 items-stretch sm:items-center">
              {/* Quantity selector */}
              <div className="flex items-center bg-gray-100 px-3 sm:px-4 py-2 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 sm:gap-3 w-full">
                  <div className="text-sky-700 text-xs sm:text-sm font-medium whitespace-nowrap">
                    Số lượng:
                  </div>
                  <input
                    type="number"
                    min="1"
                    className="w-16 sm:w-20 h-8 sm:h-9 text-center text-black bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition text-sm"
                    value={amount}
                    onChange={(e) =>
                      setAmount(Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                <button
                  className={`py-2 px-3 sm:px-6 font-semibold rounded-xl sm:rounded-2xl border text-xs sm:text-sm flex-1 ${
                    !token || !user || !user.id
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-sky-100 text-sky-500 border-sky-200 hover:bg-sky-200 transition-colors"
                  }`}
                  onClick={handleAddToCart}
                  disabled={!token || !user || !user.id}
                  title={
                    !token || !user || !user.id
                      ? "Vui lòng đăng nhập để thêm vào giỏ hàng"
                      : "Thêm vào giỏ hàng"
                  }
                >
                  <AddShoppingCartOutlinedIcon
                    sx={{ fontSize: "16px", marginRight: "4px" }}
                  />
                  <span className="hidden sm:inline">
                    {!token || !user || !user.id
                      ? "Đăng nhập để mua hàng"
                      : "Thêm vào giỏ hàng"}
                  </span>
                  <span className="sm:hidden">
                    {!token || !user || !user.id ? "Đăng nhập" : "Thêm"}
                  </span>
                </button>

                <button
                  className="py-2 px-3 sm:px-6 font-semibold rounded-xl sm:rounded-2xl border bg-orange-100 text-orange-500 border-orange-200 hover:bg-orange-200 transition-colors text-xs sm:text-sm flex-1 sm:flex-initial"
                  onClick={handleCompareProduct}
                  title="So sánh sản phẩm này với sản phẩm khác"
                >
                  <CompareIcon sx={{ fontSize: "16px", marginRight: "4px" }} />
                  So sánh
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Warranty info */}
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md shadow-sm font-semibold text-xs sm:text-sm lg:text-base">
          <i className="fa-solid fa-shield-halved text-blue-600 flex-shrink-0"></i>
          <span>Bảo hành 12 tháng - 1 đổi 1 nếu có lỗi từ nhà sản xuất</span>
        </div>

        {/* Description section */}
        <div className="mt-4 p-3 sm:p-5 text-gray-700 border-t border-gray-200">
          <div className="text-lg sm:text-xl lg:text-2xl font-extrabold mb-2 sm:mb-3 text-blue-500 uppercase">
            Mô tả:
          </div>
          <p className="text-sm sm:text-base leading-relaxed mb-4">
            {displayedProduct?.description || "Chưa có mô tả"}
          </p>
          <AttributeTable productId={displayedProduct?.id} />
        </div>

        {/* Reviews section */}
        <div className="mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-700 uppercase mb-3 sm:mb-4">
            Đánh giá của người mua:
          </div>
          {reviews.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {reviews.map((review, index) => (
                <ReviewCard key={review.id || index} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-sm sm:text-base text-gray-500 text-center py-4">
              Không có đánh giá
            </div>
          )}
          <div className="w-full flex justify-center mt-4 sm:mt-6">
            <div className="px-4 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl text-center text-gray-700 cursor-pointer border border-gray-200 w-full sm:w-1/2 lg:w-1/3 text-sm sm:text-base hover:bg-gray-50 transition-colors">
              Hiển thị thêm
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          onClose={() => setOpenToast(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
