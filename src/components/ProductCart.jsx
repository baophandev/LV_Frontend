// import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { Link } from "react-router-dom";

const ProductCart = ({ id, image, name, price, discountDisplayed }) => {
  return (
    <div className=" w-56 h-80 mb-4 p-2 pb-5 relative border border-gray-200 shadow-sm rounded-md bg-white">
      <div className="w-full h-3/5 mb-2">
        <Link to={`/product/${id}`}>
          <img
            className="w-48 rounded-md"
            src={`data:image/png;base64,${image}`}
            alt=""
            style={{
              objectFit: "cover",
            }}
          />
        </Link>
      </div>
      <div className=" flex pt-3">
        <div className="">
          <Link
            to={`/product/${id}`}
            className="line-clamp-2 mb-1 text-blue-500 font-semibold"
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
              <div className="flex gap-1">
                <div className="text-slate-500 italic line-through font-light">
                  {price?.toLocaleString("vi-VN") + "đ"}
                </div>
                <div className="text-red-500">-{discountDisplayed}%</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 bg-red-500 px-2 text-white rounded-br-md rounded-tl-md">
        -{discountDisplayed}%
      </div>
    </div>
  );
};

export default ProductCart;
