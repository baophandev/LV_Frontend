import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../redux/slices/productSlice";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import UpSizeImage from "../components/UpSizeImage";
import ReviewCard from "../components/ReviewCard";
import { getProductReview, getVariantDiscount } from "../api/productApi";
import { addtoCartApi } from "../api/cartApi";
import { fetchCart } from "../redux/slices/cartSlice";
import { Snackbar, Alert } from "@mui/material";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import Typography from "@mui/material/Typography";

export const ProductDetail = () => {
  const [amount, setAmount] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product?.products);
  const status = useSelector((state) => state.product.status);
  const { productId } = useParams();
  const [updatedProduct, setUpdatedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedItems, setSelectedItems] = useState(null);
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;
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
      <div className="flex items-center justify-center text-red-700">
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
    if (!selectedItems) {
      setToastMessage(
        "⚠️ Vui lòng chọn một biến thể trước khi thêm vào giỏ hàng!"
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
      setToastMessage("🎉 Đã thêm sản phẩm vào giỏ hàng thành công!");
      setToastSeverity("success");
      setOpenToast(true);
    } catch (error) {
      setToastMessage("❌ Đã có lỗi xảy ra khi thêm vào giỏ hàng");
      setToastSeverity("error");
      setOpenToast(true);
    }
  };

  return (
    <>
      <div className="w-2/3 p-5 bg-gradient-to-br from-orange-50 to-yellow-50 mt-5 mb-4 rounded-xl shadow-lg border border-orange-200">
        <div className="flex gap-7 p-2 py-5 rounded-md">
          <div className="flex justify-center gap-2 w-1/2">
            <div className="w-[85%] h-80 rounded-md bg-white shadow-sm border border-orange-100">
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
            <div
              className={`flex flex-col gap-1 w-[20%] h-72 ${
                displayImages?.length > 4 ? "overflow-y-scroll" : ""
              }`}
            >
              {displayImages.map((image, index) => (
                <div
                  key={index}
                  className="w-full h-24 cursor-pointer rounded-md bg-white shadow-sm border border-orange-100"
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
          <div className="flex flex-col gap-3">
            <div className="uppercase text-2xl font-extrabold text-gray-800">
              <PetsOutlinedIcon /> {displayedProduct?.name || "Tên sản phẩm"}
            </div>
            <Box sx={{ width: 200, display: "flex", alignItems: "center" }}>
              {displayedProduct?.rating && displayedProduct.rating > 0 ? (
                <Rating
                  name="text-feedback"
                  value={displayedProduct.rating}
                  readOnly
                  precision={0.5}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  (Chưa có đánh giá nào)
                </Typography>
              )}
            </Box>

            <div className="flex flex-col gap-1 pb-2 border-b border-gray-200">
              {/* Tính giá gốc và phần trăm giảm */}
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
                    {/* Giá sau giảm (nếu có giảm), hoặc giá gốc */}
                    <div className="text-2xl font-extrabold text-orange-600">
                      <MonetizationOnOutlinedIcon />{" "}
                      {discountedPrice.toLocaleString("vi-VN")} VNĐ
                    </div>

                    {/* Nếu có giảm giá, hiển thị giá gốc + phần trăm */}
                    {discount > 0 && (
                      <div className="flex items-center gap-3 text-gray-500">
                        <span className="line-through">
                          {price.toLocaleString("vi-VN")} VNĐ
                        </span>
                        <span className="bg-red-100 text-red-500 px-2 py-0.5 rounded font-semibold">
                          🔥 -{discount}%
                        </span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            <div className="text-gray-600 font-medium">
              <PaletteOutlinedIcon /> Chọn màu sắc cho thú cưng:
            </div>
            <div className="flex gap-2 flex-wrap border-b border-b-orange-200 pb-2">
              {displayedProduct?.variants &&
              displayedProduct.variants.length > 0 ? (
                displayedProduct.variants.map(
                  (_variant, idx) =>
                    _variant.isActive && (
                      <div
                        key={_variant.id || idx}
                        className="w-10 h-10 rounded-full border border-gray-300 "
                        style={{
                          backgroundColor: _variant.colorCode || "#fff",
                          border:
                            selectedItems?.id === _variant.id
                              ? `3px solid #ea580c `
                              : "1px solid #fed7aa",
                          cursor: "pointer",
                          boxShadow:
                            selectedItems?.id === _variant.id
                              ? "0 4px 12px rgba(234, 88, 12, 0.3)"
                              : "0 2px 4px rgba(251, 146, 60, 0.2)",
                        }}
                        onClick={() => handleSelectedItems(_variant)}
                      ></div>
                    )
                )
              ) : (
                <div className="text-gray-500 italic">
                  🚫 Không có lựa chọn màu sắc
                </div>
              )}
            </div>
            {selectedItems && (
              <div className="flex gap-2 mt-3">
                <div className="flex items-center gap-2 px-3 bg-orange-50 border border-orange-200 rounded-xl shadow-sm">
                  <span className="text-sm text-gray-600">📦 Đã bán:</span>
                  <span className="font-semibold text-orange-600">
                    {selectedItems?.sold || "0"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 bg-green-50 border border-green-200 rounded-xl shadow-sm">
                  <span className="text-sm text-gray-600">✅ Còn lại:</span>
                  <span className="font-semibold text-green-700">
                    {selectedItems?.stock || "0"}
                  </span>
                </div>
              </div>
            )}
            {user && userId ? (
              <div className="text-white flex gap-1">
                <div className="flex items-center bg-gradient-to-r from-orange-100 to-yellow-100 px-4 py-2 rounded-lg shadow-sm border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="text-orange-700 text-sm font-medium">
                      🔢 Chọn số lượng:
                    </div>
                    <input
                      type="number"
                      min="1"
                      className="w-20 h-9 text-center text-black bg-white border border-orange-300 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition"
                      value={amount}
                      onChange={(e) =>
                        setAmount(Math.max(1, parseInt(e.target.value) || 1))
                      }
                    />
                  </div>
                </div>

                <button
                  className="py-1 px-6 font-semibold rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border border-orange-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={handleAddToCart}
                >
                  <AddShoppingCartOutlinedIcon sx={{ color: "white" }} />
                  Thêm vào giỏ hàng
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg shadow-sm font-medium border border-yellow-200">
                <span className="text-lg">🔒</span>
                <span>Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng</span>
              </div>
            )}
          </div>
        </div>
        <div class="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg shadow-sm font-semibold border border-green-200 mt-4">
          <i class="fa-solid fa-shield-halved text-green-600"></i>
          <span className="">
            🏥 Bảo hành sức khỏe thú cưng 10 ngày - 1 đổi 1 nếu có vấn đề về sức
            khỏe
          </span>
        </div>
        <div className="mt-4 p-5 text-gray-700 border-t border-orange-200 bg-white rounded-lg shadow-sm">
          <div className="uppercase text-2xl font-extrabold mb-3 text-orange-600">
            Mô tả sản phẩm:{" "}
          </div>
          <p className="text-gray-600 leading-relaxed">
            {displayedProduct?.description || "Chưa có mô tả"}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-orange-200 bg-white rounded-lg shadow-sm p-5">
          <div className="uppercase text-2xl font-extrabold text-orange-600 mb-4">
            ⭐ Đánh giá của khách hàng:
          </div>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <div className="text-gray-500 italic text-center py-8">
              📝 Chưa có đánh giá nào cho sản phẩm này
            </div>
          )}
          <div className="w-full flex justify-center mt-4">
            <div className="px-6 py-3 rounded-2xl text-center text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 cursor-pointer border border-orange-400 w-1/3 transition-all duration-200 shadow-lg hover:shadow-xl">
              📖 Hiển thị thêm đánh giá
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={openToast}
        autoHideDuration={1000}
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
