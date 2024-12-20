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
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.products);
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
  return (
    <div className="w-2/3 border border-gray-200 rounded-md p-5">
      <div className="flex gap-10">
        <div className="flex gap-1">
          <div className="w-60 h-60">
            <img
              className="w-full h-full"
              src={"https://placehold.co/600x400"}
              style={{ objectFit: "cover" }}
              alt="Ảnh lỗi"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="w-16 h-16">
              <img
                className="w-full h-full"
                src={"https://placehold.co/600x400"}
                style={{ objectFit: "cover" }}
                alt="Ảnh lỗi"
              />
            </div>
            <div className="w-16 h-16">
              <img
                className="w-full h-full"
                src={"https://placehold.co/600x400"}
                style={{ objectFit: "cover" }}
                alt="Ảnh lỗi"
              />
            </div>
            <div className="w-16 h-16">
              <img
                className="w-full h-full"
                src={"https://placehold.co/600x400"}
                style={{ objectFit: "cover" }}
                alt="Ảnh lỗi"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-lg">{product?.name}</div>
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
          <div
            className="font-bold text-yellow-500"
            style={{ color: ThemeColor.MAIN_GREEN }}
          >
            {product?.price?.toLocaleString("vi-VN") || "0"}đ
          </div>
          <div className="flex gap-1">
            <p>
              Số lượng: <span> </span>
            </p>
            <div className="flex gap-3">
              <input
                type="number"
                className="w-12 text-center border border-gray-300 rounded outline-none"
                value={amount}
                onChange={(e) =>
                  setAmount(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
            </div>
          </div>
          <div className="text-white flex gap-1">
            <button
              className="py-1 px-2 rounded-md"
              style={{
                border: "1px solid #007580",
                color: ThemeColor.DARK_GREEN,
              }}
            >
              <AddShoppingCartOutlinedIcon
                sx={{ color: ThemeColor.MAIN_GREEN }}
              ></AddShoppingCartOutlinedIcon>
              Thêm vào giỏ hàng
            </button>
            <button
              className="py-1 px-2 rounded-md"
              style={{ backgroundColor: ThemeColor.MAIN_GREEN }}
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <p className="text-gray-600 ">{product.description}</p>
      </div>
    </div>
  );
};
