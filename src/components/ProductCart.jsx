// import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { Link } from "react-router-dom";

const ProductCart = ({
  id,
  image,
  name,
  price,
  category,
  discountDisplayed,
}) => {
  return (
    <div className="w-72 mb-4 p-3 pb-6 relative rounded-2xl bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
      <div className="h-64 mb-3 flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl overflow-hidden">
        <Link to={`/product/${id}`}>
          <img
            className="w-52 h-52 rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
            src={`data:image/png;base64,${image}`}
            alt={name}
            style={{
              objectFit: "cover",
            }}
          />
        </Link>
      </div>
      <div className="flex pt-3 px-2 h-36">
        <div className="w-full">
          <div className="text-orange-500 font-medium text-sm flex items-center gap-1">
            🐾 {category || "Sản phẩm thú cưng"}
          </div>
          <Link
            to={`/product/${id}`}
            className="text-xl font-extrabold text-slate-700 hover:text-orange-600 transition-colors duration-300 line-clamp-2 block mt-1"
            title={name}
          >
            {name}
          </Link>

          <div className="text-lg mt-3">
            <div className="text-orange-600 font-bold text-xl flex items-center gap-1">
              💰{" "}
              {discountDisplayed > 0
                ? // Tính giá sau giảm và chuyển về chuỗi định dạng "vi-VN" rồi nối thêm "đ"
                  (price * (1 - discountDisplayed / 100)).toLocaleString(
                    "vi-VN"
                  ) + "đ"
                : price.toLocaleString("vi-VN") + "đ"}
            </div>
            {discountDisplayed > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="text-gray-400 italic line-through font-light text-sm">
                  {price?.toLocaleString("vi-VN") + "đ"}
                </div>
                <div className="text-red-500 font-semibold text-sm bg-red-50 px-2 py-1 rounded-full">
                  🔥 -{discountDisplayed}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {discountDisplayed > 0 && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-600 px-3 py-1 text-white rounded-lg shadow-lg transform rotate-3 animate-pulse">
          <span className="font-bold text-sm">🔥 -{discountDisplayed}%</span>
        </div>
      )}

      {/* Pet-themed corner decoration */}
      <div className="absolute top-3 right-3 text-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        🐾
      </div>
    </div>
  );
};

export default ProductCart;
