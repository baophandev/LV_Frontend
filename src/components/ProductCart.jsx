// import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ThemeColor from "../constant/theme";
import { Link } from "react-router-dom";

const ProductCart = ({ id, image, name, price, discountDisplayed }) => {
  return (
    <div className=" w-40 sm:w-52 sm:h-72 mb-4 p-2 pb-5 relative border border-gray-200 hover:shadow-md">
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
          <div className="text-slate-600">
            {discountDisplayed > 0
              ? // Tính giá sau giảm và chuyển về chuỗi định dạng "vi-VN" rồi nối thêm "đ"
                (price * (1 - discountDisplayed / 100)).toLocaleString(
                  "vi-VN"
                ) + "đ"
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
      </div>
      <div className="absolute top-0 left-0 bg-red-500 px-2 text-white rounded-br-md">
        -{discountDisplayed}%
      </div>
    </div>
  );
};

export default ProductCart;
