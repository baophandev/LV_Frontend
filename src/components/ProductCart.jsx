// import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { Link } from "react-router-dom";

const ProductCart = ({ id, image, name, price, category, discountDisplayed }) => {
  return (
    <div className="w-72 mb-4 p-2 pb-5 relative  rounded-xl bg-white border border-blue-100">
      <div className=" h-64 mb-2 flex items-center justify-center">
        <Link to={`/product/${id}`}>
          <img
            className="w-52 rounded-md"
            src={`data:image/png;base64,${image}`}
            alt=""
            style={{
              objectFit: "cover",
            }}
          />
        </Link>
      </div>
      <div className=" flex pt-3 px-2 h-36">
        <div className="">
          <div className="text-gray-400">{category || ""}</div>
          <Link
            to={`/product/${id}`}
            className=" text-xl font-extrabold text-slate-700"
          >
            {name}
          </Link>

          <div className="text-lg mt-2 text-blue-600 font-semibold">
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
      <div className="absolute top-2 left-2 bg-red-500 px-2 text-white rounded-md">
        -{discountDisplayed}%
      </div>
    </div>
  );
};

export default ProductCart;
