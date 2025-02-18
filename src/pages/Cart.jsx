import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice";
import ThemeColor from "../constant/theme";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { getVariantDiscount } from "../api/productApi";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export const Cart = () => {
  const dispacth = useDispatch();
  const { cart, status, error } = useSelector((state) => state.cart);
  const cartData = cart?.data?.items || [];
  const user = useSelector((state) => state.user.user);
  const userId = user.id;
  const [updatedCart, setUpdatedCart] = useState(null);
  useEffect(() => {
    if (status === "idle" && userId) {
      dispacth(fetchCart(userId));
    }
  }, [dispacth, status, userId]);

  useEffect(() => {
    if (!cart?.data?.items || cart.data.items.length === 0) {
      setUpdatedCart({ ...cart?.data, items: [] });
      return;
    }

    const updateVariantsWithDiscount = async () => {
      try {
        const updatedVariants = await Promise.all(
          cart.data.items.map(async (cartItem) => {
            try {
              const discountResponse = await getVariantDiscount(
                cartItem.productVariantId
              );
              return {
                ...cartItem,
                discountValue: discountResponse?.discountValue || 0, // Thêm discountValue
              };
            } catch (err) {
              console.error("Lỗi khi lấy discount:", err);
              return { ...cartItem, discountValue: 0 };
            }
          })
        );

        setUpdatedCart({ ...cart.data, items: updatedVariants }); // Cập nhật items với discountValue
      } catch (error) {
        console.error("Lỗi khi cập nhật variants với discount:", error);
      }
    };

    updateVariantsWithDiscount();
  }, [cart?.data?.items, cart]); // Theo dõi thay đổi trong cart.items

  const displayedCartItem =
    updatedCart?.items?.length > 0 ? updatedCart.items : cartData;


  if (status === "loading") return <Loading></Loading>;

  return (
    <div className="w-2/3 p-5 min-h-screen">
      <div
        className=" p-5 rounded-md mb-4 uppercase text-xl font-extrabold"
        style={{
          backgroundColor: ThemeColor.LIGHT_GRAY,
          color: ThemeColor.MAIN_GRREN,
        }}
      >
        Giỏ hàng
      </div>
      <div className="flex p-3 gap-2 border-b">
        <input type="checkbox" />
        <div className="w-20 text-center">Ảnh</div>
        <div className="w-2/5">Tên sản phẩm</div>
        <div className="w-1/6">Phân loại</div>
        <div className="w-24">Đơn giá</div>
        <div className="1/6">Số lượng</div>
        <div className="1/6">Tổng tiền</div>
        <div className="text-red-500 ml-auto">Xóa</div>
      </div>
      {displayedCartItem.length > 0 ? (
        displayedCartItem.map((item, index) => (
          <div
            key={index}
            className="flex p-3 items-center gap-2 mb-1 border-b border-b-gray-200"
          >
            <input type="checkbox" />
            <img
              className="w-20 rounded-md"
              src={`data:image/png;base64,${item.images[0].data}`}
              alt=""
            />
            <Link
              to={`/product/${item.productId}`}
              className="w-2/5"
            >
              {item.productName}
            </Link>
            <div className="w-1/6">{item.productColor}</div>
            <div className="w-28 text-sm">
              <div>
                {item.discountValue > 0
                  ? (
                      (item.price || 0) *
                      (1 - item.discountValue / 100)
                    ).toLocaleString("vi-VN") + "đ"
                  : (item.price || 0).toLocaleString("vi-VN") + "đ"}
              </div>
              {item.discountValue > 0 && (
                <div className="">
                  <span className="line-through italic text-xs text-gray-400">
                    {(item.price || 0).toLocaleString("vi-VN") + "đ"}
                  </span>
                  <span className="text-red-500 text-xs">
                    -{item.discountValue}%
                  </span>
                </div>
              )}
            </div>
            <input className="w-10" type="number" value={item.quantity || 0} />
            <div className="w-28 text-sm">
              {((item.price || 0) * (item.quantity || 0)).toLocaleString(
                "vi-VN"
              ) + "đ"}
            </div>
            <div className="text-red-500 ml-auto">
              <DeleteOutlineOutlinedIcon />
            </div>
          </div>
        ))
      ) : (
        <div className="text-center" style={{ color: ThemeColor.MAIN_BLUE }}>
          Không có sản phẩm nào
        </div>
      )}
      <div
        className="bg-gray-100 text-lg fixed z-100 w-2/3 bottom-5 rounded-md p-5 font-extrabold uppercase"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          color: ThemeColor.MAIN_GRREN,
        }}
      >
        Tổng thanh toán:
      </div>
    </div>
  );
};
