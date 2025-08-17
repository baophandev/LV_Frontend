// import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { Link } from "react-router-dom";

const ProductCart = ({ id, image, name, price, category, discountDisplayed, premiumStyle }) => {
  return (
    <div className={`${
      premiumStyle 
        ? "w-full max-w-sm mx-auto mb-3 sm:mb-4 p-2 sm:p-3 pb-4 sm:pb-5" 
        : "w-72 mb-4 p-2 pb-5"
    } relative rounded-xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300`}>
      <div className={`${
        premiumStyle 
          ? "h-48 sm:h-56 md:h-64 mb-2 flex items-center justify-center" 
          : "h-64 mb-2 flex items-center justify-center"
      }`}>
        <Link to={`/product/${id}`}>
          <img
            className={`${
              premiumStyle 
                ? "w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] rounded-md" 
                : "w-52 rounded-md"
            }`}
            src={`data:image/png;base64,${image}`}
            alt={name}
            style={{
              objectFit: "cover",
            }}
          />
        </Link>
      </div>
      <div className={`${
        premiumStyle 
          ? "flex pt-2 sm:pt-3 px-1 sm:px-2 min-h-[120px] sm:min-h-[130px]" 
          : "flex pt-3 px-2 h-36"
      }`}>
        <div className="w-full">
          <div className="text-gray-400 text-xs sm:text-sm truncate">{category || ""}</div>
          <Link
            to={`/product/${id}`}
            className={`${
              premiumStyle 
                ? "text-sm sm:text-base md:text-lg font-bold text-slate-700 hover:text-slate-900" 
                : "text-xl font-extrabold text-slate-700"
            } line-clamp-2 leading-tight mt-1`}
          >
            {name}
          </Link>

          <div className={`${
            premiumStyle 
              ? "text-sm sm:text-base md:text-lg mt-2 text-blue-600 font-semibold" 
              : "text-lg mt-2 text-blue-600 font-semibold"
          }`}>
            {discountDisplayed > 0
              ? // Tính giá sau giảm và chuyển về chuỗi định dạng "vi-VN" rồi nối thêm "đ"
                (price * (1 - discountDisplayed / 100)).toLocaleString(
                  "vi-VN"
                ) + "đ"
              : price.toLocaleString("vi-VN") + "đ"}
            {discountDisplayed > 0 && (
              <div className="flex gap-1 mt-1">
                <div className="text-slate-500 italic line-through font-light text-xs sm:text-sm">
                  {price?.toLocaleString("vi-VN") + "đ"}
                </div>
                <div className="text-red-500 text-xs sm:text-sm">-{discountDisplayed}%</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {discountDisplayed > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 px-1.5 sm:px-2 py-0.5 text-white rounded-md text-xs sm:text-sm font-medium">
          -{discountDisplayed}%
        </div>
      )}
    </div>
  );
};

export default ProductCart;
