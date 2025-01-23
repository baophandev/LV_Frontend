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

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

export const ProductDetail = () => {
  const [amount, setAmount] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product?.products);
  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);
  const { productId } = useParams();

  useEffect(() => {
    dispatch(fetchProduct(productId));
  }, [dispatch, productId]);

  console.log(error);

  if (status === "loading") return <Loading></Loading>;
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

  return (
    <div className="w-2/3 p-5">
      <div className="flex gap-7 p-2 py-5 rounded-md">
        <div className="flex justify-center gap-2 w-1/2">
          <div className="w-[85%] h-80 rounded-md bg-gray-200">
            {product.images && product.images.length > 0 ? (
              <>
                <img
                  className="w-full h-full rounded-md cursor-pointer"
                  src={`data:image/png;base64,${product.images[imageIndex].data}`}
                  alt={product.name}
                  style={{ objectFit: "contain" }}
                  onClick={handleClickOpen}
                />
                <UpSizeImage
                  open={open}
                  handleClose={handleClose}
                  images={product.images}
                  imageNumber={imageIndex}
                ></UpSizeImage>
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
            className={`flex flex-col gap-1 w-[20%] h-64 ${
              product.images?.length > 4 ? "overflow-y-scroll" : ""
            }`}
          >
            {product.images?.map((image, index) => (
              <div
                key={index}
                className="w-full h-24 cursor-pointer rounded-md bg-gray-200"
                style={{ backgroundColor: ThemeColor.MAIN_GREEN }}
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
        <div className="flex flex-col gap-3 ">
          <div className="uppercase text-2xl font-extrabold">
            {product?.name}
          </div>
          <Box sx={{ width: 200, display: "flex", alignItems: "center" }}>
            <Rating
              name="text-feedback"
              value={3.5}
              readOnly
              precision={0.5}
              emptyIcon={
                <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
              }
            />
            <Box
              sx={{
                ml: 1,
                backgroundColor: ThemeColor.LIGHT_GRAY,
                padding: "1px",
                borderRadius: "5px",
                color: "Gray",
              }}
            >
              {labels[3.5]}
            </Box>
          </Box>
          <div className="flex gap-2 flex-wrap pb-2 border-b border-b-gray-200">
            <button
              className="text-white px-4 py-1 rounded-md relative"
              style={{
                border: "1px solid #007580",
              }}
            >
              <div className="font-medium" style={{ color: ThemeColor.BLUE }}>
                1TB
              </div>
              <div className="font-medium text-yellow-400">23.000.000đ</div>
              <div className="absolute top-0 left-1">
                <CheckCircleIcon
                  sx={{ color: ThemeColor.BLUE }}
                  fontSize="small"
                ></CheckCircleIcon>
              </div>
            </button>
          </div>
          <div className="text-gray-400">Chọn màu sắc:</div>
          <div className="flex gap-2 flex-wrap border-b border-b-gray-200 pb-2">
            {product && product.variants && product.variants.length > 0 ? (
              product.variants.map((variant, index) => (
                <button
                  key={index}
                  className="text-white px-4 py-1 rounded-md border border-teal-800"
                >
                  <div
                    className="font-medium"
                    style={{ color: ThemeColor.BLUE }}
                  >
                    {variant?.color}
                  </div>
                  <div className="text-yellow-400 font-medium">
                    {variant?.price?.toLocaleString("vi-VN") || "0"}đ
                  </div>
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
              className="py-1 px-6  text-white rounded-2xl"
              style={{
                backgroundColor: ThemeColor.MAIN_GRREN,
              }}
            >
              <AddShoppingCartOutlinedIcon
                sx={{ color: "white" }}
              ></AddShoppingCartOutlinedIcon>
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2 rounded-md  p-5 text-gray-700 bg-gray-100">
        <div className="uppercase text-2xl font-extrabold ">Mô tả: </div>
        <p className="">{product.description}</p>
        <AttributeTable productId={product.id}></AttributeTable>
      </div>
      <div className="mt-3 pt-3 border-t border-b-gray-200">
        <div className="uppercase text-2xl font-extrabold text-gray-700 ">
          Đánh giá của người mua:{" "}
        </div>
        <ReviewCard></ReviewCard>
        <ReviewCard></ReviewCard>
        <div className="w-full flex justify-center mt-3">
          <div className="px-5 py-2 rounded-2xl text-center text-gray-700 cursor-pointer border border-gray-200 w-1/3">
            Hiển thị thêm
          </div>
        </div>
      </div>
    </div>
  );
};
