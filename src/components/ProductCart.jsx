import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ThemeColor from "../constant/theme";
import { Link } from "react-router-dom";

const ProductCart = ({ id, image, name, price, discountDisplayed }) => {
  return (
    <div className=" w-40 sm:w-52 sm:h-72 mb-4 rounded-md pb-5 relative">
      <div className="w-full h-3/4 mb-2">
        <Link to={`/product/${id}`}>
          <img
            className="w-full h-full rounded-md"
            src={`data:image/png;base64,${image}`}
            alt=""
            style={{
              objectFit: "cover",
            }}
          />
        </Link>
      </div>
      <div className=" flex ">
        <div className="">
          <Link
            to={`/product/${id}`}
            className="line-clamp-2 mb-1"
            style={{ color: ThemeColor.MAIN_GRREN }}
          >
            {name}
          </Link>
          <div className="font-medium text-yellow-400">
            {discountDisplayed > 0
              ? // Tính giá sau giảm và chuyển về chuỗi định dạng "vi-VN" rồi nối thêm "đ"
                (
                  price *
                  (1 - discountDisplayed / 100)
                ).toLocaleString("vi-VN") + "đ"
              : price.toLocaleString("vi-VN") + "đ"}
            {discountDisplayed > 0 && (
              <div className="flex gap-1 justify-center">
                <div className="text-slate-500 italic line-through font-light">
                  {price?.toLocaleString("vi-VN") + "đ"}
                </div>
                <div className="text-red-500">-{discountDisplayed}%</div>
              </div>
            )}
          </div>
        </div>
        <button className="ml-auto">
          <AddShoppingCartOutlinedIcon
            sx={{
              color: "white",
              backgroundColor: ThemeColor.BLUE,
              padding: "2px",
              borderRadius: "5px",
            }}
          ></AddShoppingCartOutlinedIcon>
        </button>
      </div>
      <div className="absolute top-0 left-0 bg-red-500 px-2 text-white rounded-tl-md">
        -{discountDisplayed}%
      </div>
    </div>
  );
};

export default ProductCart;
