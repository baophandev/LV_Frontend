import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice";
import ThemeColor from "../constant/theme";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

export const Cart = () => {

  const dispacth = useDispatch();
  const { cart, status, error } = useSelector((state) => state.cart);
  const cartData = cart?.data?.items || [];
  const userId = "12345678-90ab-cdef-1234-567890abcdef";

  useEffect(() => {
    if (status === "idle") {
      dispacth(fetchCart({userId}));
    }
  }, [dispacth, status]);

  if(status === "loading") return <Loading></Loading>;

  return (
    <div className="w-2/3 p-5 min-h-screen">
      <div className=" p-5 text-yellow-400 rounded-md mb-4 font-medium bg-slate-700">
        Giỏ hàng
      </div>
      {cartData.length > 0 ? (
        cartData.map((item, index) => (
          <div
            key={index}
            className="flex p-5 rounded-md items-center gap-2 shadow bg-slate-700 mb-1"
          >
            <input type="checkbox" />
            <img
              className="w-20 rounded-md"
              src={`data:image/png;base64,${item.images[0].data}`}
              alt=""
            />
            <Link
              to={`/product/${item.productId}`}
              className="text-yellow-500 w-64"
            >
              {item.productName}
            </Link>
            <div className="text-white w-64">{item.productColor}</div>
            <div className="text-white w-32">{item.price}</div>
            <input
              className="w-14 bg-transparent text-white shadow-inner shadow-gray-800 px-2 rounded-md"
              type="number"
              value={"2"}
            />
            <div className="text-white w-32">{item.price}*2</div>
            <div className="text-red-500">Xóa</div>
          </div>
        ))
      ) : (
        <div className="text-center" style={{ color: ThemeColor.MAIN_BLUE }}>
          Không có sản phẩm nào
        </div>
      )}
      {error && <div className="text-red-500">Đã có lỗi xảy ra {error}</div>}
      <div
        className="bg-slate-300 fixed z-100 w-2/3 bottom-2 rounded-md p-2"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        Tổng thanh toán: 
      </div>
    </div>
  );
};
