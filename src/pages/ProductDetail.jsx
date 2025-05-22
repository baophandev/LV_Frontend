import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../redux/slices/productSlice";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import ThemeColor from "../constant/theme";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import UpSizeImage from "../components/UpSizeImage";
import AttributeTable from "../components/AttributeTable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReviewCard from "../components/ReviewCard";
import { getProductReview, getVariantDiscount } from "../api/productApi";
import { addtoCartApi } from "../api/cartApi";
import { fetchCart } from "../redux/slices/cartSlice";
import { Snackbar, Alert } from "@mui/material";

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
      alert("Vui lòng chọn một biến thể trước khi thêm vào giỏ hàng!");
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
      setToastMessage("Đã thêm sản phẩm vào giỏ hàng");
      setToastSeverity("success");
      setOpenToast(true);
    } catch (error) {
      alert("Đã có lỗi xảy ra khi thêm vào giỏ hàng");
      setToastMessage("Lỗi khi cập nhật sản phẩm.");
      setToastSeverity("error");
      setOpenToast(true);
    }
  };

  return (
    <>
      <div className="w-2/3 p-5 bg-white mt-5 mb-4">
        <div className="flex gap-7 p-2 py-5 rounded-md">
          <div className="flex justify-center gap-2 w-1/2">
            <div className="w-[85%] h-80 rounded-md bg-white">
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
                  className="w-full h-24 cursor-pointer rounded-md bg-white"
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
            <div className="uppercase text-2xl font-extrabold">
              {displayedProduct?.name || "Tên sản phẩm"}
            </div>
            <Box sx={{ width: 200, display: "flex", alignItems: "center" }}>
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
            <div className="flex gap-2 flex-wrap pb-2 border-b border-b-gray-200">
              <button
                className="text-white px-4 py-1 rounded-md relative"
                style={{ border: "1px solid #007580" }}
              >
                <div className="font-medium" style={{ color: ThemeColor.BLUE }}>
                  1TB
                </div>
                <div className="font-medium text-yellow-400">23.000.000đ</div>
                <div className="absolute top-0 left-1">
                  <CheckCircleIcon
                    sx={{ color: ThemeColor.BLUE }}
                    fontSize="small"
                  />
                </div>
              </button>
            </div>
            <div className="text-gray-400">Chọn màu sắc:</div>
            <div className="flex gap-2 flex-wrap border-b border-b-gray-200 pb-2">
              {displayedProduct?.variants &&
              displayedProduct.variants.length > 0 ? (
                displayedProduct.variants.map((variant, index) => (
                  <button
                    key={index}
                    className="relative text-white px-4 py-1 rounded-md border border-teal-800 text-sm"
                    onClick={() => {
                      handleSelectedItems(variant);
                    }}
                  >
                    <div
                      className="font-medium"
                      style={{ color: ThemeColor.BLUE }}
                    >
                      {variant?.color || "Không xác định"}
                    </div>
                    <div className="text-yellow-400 font-medium">
                      {variant.discountValue > 0
                        ? (
                            (variant.price || 0) *
                            (1 - variant.discountValue / 100)
                          ).toLocaleString("vi-VN") + "đ"
                        : (variant.price || 0).toLocaleString("vi-VN") + "đ"}
                    </div>
                    {variant.discountValue > 0 && (
                      <div className="flex gap-1 justify-center">
                        <div className="text-slate-500 italic line-through">
                          {(variant.price || 0).toLocaleString("vi-VN") + "đ"}
                        </div>
                        <div className="text-red-500">
                          -{variant.discountValue}%
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <div className="text-gray-400 text-xs">
                        Đã bán: {variant?.sold || 0}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Còn lại: {variant?.stock || 0}
                      </div>
                    </div>
                    {selectedItems?.id === variant.id && (
                      <div className="absolute top-0 left-1">
                        <CheckCircleIcon
                          sx={{ color: ThemeColor.BLUE }}
                          fontSize="small"
                        />
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-sky-400 italic">Không có lựa chọn màu sắc</p>
              )}
            </div>

            <div className="text-white flex gap-1">
              <div className="flex gap-1">
                <div className="flex gap-3">
                  <input
                    type="number"
                    className="w-48 text-center text-black rounded-2xl outline-noneshadow bg-gray-200"
                    value={amount}
                    onChange={(e) =>
                      setAmount(Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                </div>
              </div>
              <button
                className="py-1 px-6 text-white rounded-2xl"
                style={{ backgroundColor: ThemeColor.MAIN_GRREN }}
                onClick={handleAddToCart}
              >
                <AddShoppingCartOutlinedIcon sx={{ color: "white" }} />
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
        <div className="mt-2 rounded-md p-5 text-gray-700 bg-gray-100">
          <div className="uppercase text-2xl font-extrabold">Mô tả: </div>
          <p>{displayedProduct?.description || "Chưa có mô tả"}</p>
          <AttributeTable productId={displayedProduct?.id} />
        </div>
        <div className="mt-3 pt-3 border-t border-b-gray-200">
          <div className="uppercase text-2xl font-extrabold text-gray-700">
            Đánh giá của người mua:
          </div>
          {reviews.length > 0 ? (
            reviews.map((review) => <ReviewCard review={review} />)
          ) : (
            <div>Không có đánh giá</div>
          )}
          <div className="w-full flex justify-center mt-3">
            <div className="px-5 py-2 rounded-2xl text-center text-gray-700 cursor-pointer border border-gray-200 w-1/3">
              Hiển thị thêm
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
