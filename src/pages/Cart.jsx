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
  const userId = "U001";

  useEffect(() => {
    if (status === "idle") {
      dispacth(fetchCart({userId}));
    }
  }, [dispacth, status]);

  if(status === "loading") return <Loading></Loading>;

  return (
    <div className="w-2/3 p-5 min-h-screen">
      <div
        className=" p-5 rounded-md mb-4 uppercase text-xl font-extrabold"
        style={{ backgroundColor: ThemeColor.LIGHT_GRAY, color: ThemeColor.MAIN_GRREN }}
      >
        Giỏ hàng
      </div>
      {cartData.length > 0 ? (
        cartData.map((item, index) => (
          <div
            key={index}
            className="flex p-5 items-center gap-2 mb-1 border-b border-b-gray-200"
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
            <div className=" w-64">{item.productColor}</div>
            <div className=" w-32">{item.price}</div>
            <input
              className=""
              type="number"
              value={"2"}
            />
            <div className=" w-32">{item.price}*2</div>
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
        className="bg-gray-100 text-lg fixed z-100 w-2/3 bottom-5 rounded-md p-5 font-extrabold uppercase"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          color: ThemeColor.MAIN_GRREN
        }}
      >
        Tổng thanh toán:
      </div>
    </div>
  );
};
