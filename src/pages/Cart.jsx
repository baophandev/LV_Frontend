import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ThemeColor from "../constant/theme";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { getVariantDiscount } from "../api/productApi";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SelectAddressDialog from "../components/SelectAddressDialog";
import OrderDialog from "../components/OrderDialog";

export const Cart = () => {
  const { cart, status } = useSelector((state) => state.cart);
  const cartData = cart?.data?.items || [];
  const [updatedCart, setUpdatedCart] = useState(null);
  const [open, setOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const addressList = useSelector((state) => state.user.address);
  const memoizedAddressList = useMemo(() => addressList || [], [addressList]);
  const [count, setCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItems, setSelectedItems] = useState({}); // Lưu trạng thái checkbox

  const [address, setAddress] = useState(null);

  console.log("Selected item: ", selectedItems)

  useEffect(() => {
    if (memoizedAddressList.length > 0) {
      setAddress(memoizedAddressList[0]);
    }
  }, [memoizedAddressList]);

  const handleSetAddrress = (address) => {
    setAddress(address);
    handleClose();
  };

  // useEffect(() => {
  //   if (status === "idle" && userId) {
  //     dispatch(fetchCart(userId));
  //   }
  // }, [dispatch, userId, status]);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onClose = () => {
    setOrderOpen(false);
  };

  const handleSelectItem = (item, isChecked) => {
    setSelectedItems((prev) => {
      const updatedItems = { ...prev };
      if (isChecked) {
        updatedItems[item.itemId] = item;
      } else {
        delete updatedItems[item.itemId];
      }
      return updatedItems;
    });
  };

  useEffect(() => {
    setCount(Object.keys(selectedItems).length);
  }, [selectedItems]);

  useEffect(() => {
    const total = Object.values(selectedItems).reduce(
      (sum, item) =>
        sum +
        (item.price || 0) *
          (1 - item.discountValue / 100) *
          (item.quantity || 0),
      0
    );
    setTotalPrice(total);
  }, [selectedItems]);

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
      <div className="flex p-3 gap-2 border-b" style={{
        backgroundColor: ThemeColor.LIGHT_GRAY
      }}>
        <input type="checkbox" />
        <div className="w-20 text-center">Ảnh</div>
        <div className="w-2/5">Tên sản phẩm</div>
        <div className="w-1/6">Phân loại</div>
        <div className="w-28">Đơn giá</div>
        <div className="w-10">SL</div>
        <div className="1/6">Tổng tiền</div>
        <div className="text-red-500 ml-auto">Xóa</div>
      </div>
      {displayedCartItem.length > 0 ? (
        displayedCartItem.map((item, index) => (
          <div
            key={index}
            className= {`flex p-3 items-center gap-2 border-b border-b-gray-200 ${index % 2 !== 0 ? 'bg-gray-50' : ''}`}
          >
            <input
              type="checkbox"
              checked={!!selectedItems[item.itemId]}
              onChange={(e) => handleSelectItem(item, e.target.checked)}
            />
            <img
              className="w-20 rounded-md"
              src={`data:image/png;base64,${item.images[0].data}`}
              alt=""
            />
            <Link to={`/product/${item.productId}`} className="w-2/5">
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
              {(
                (item.price || 0) *
                (1 - item.discountValue / 100) *
                (item.quantity || 0)
              ).toLocaleString("vi-VN") + "đ"}
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
        className="bg-gray-100 fixed z-100 w-2/3 bottom-5 rounded-md p-5 flex items-center"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div className="flex gap-2 border-r pr-3 ml-auto">
          <div>Địa chỉ: </div>
          <div className="text-slate-500">
            {address ? (
              <>
                <div className="text-sm">
                  {address.receiverName || ""}, {address.receiverPhone || ""}
                </div>
                <div className="text-sm">
                  {address.detail || "-"} {", "}
                  {address.ward || "-"} {", "}
                  {address.district || "-"} {", "}
                  {address.province || "-"} {"."}
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-sm">Chưa có địa chỉ</div>
            )}
            <div
              className="text-sky-500 text-sm cursor-pointer"
              onClick={handleClickOpen}
            >
              Thay đổi
            </div>
          </div>
        </div>
        <div className="flex gap-2 border-r px-2">
          <div>Đã chọn: </div>
          <div className="text-slate-500">{count}</div>
        </div>
        <div className="flex gap-2 px-2 border-r">
          <div>Tổng thanh toán: </div>
          <div className="text-slate-500">
            {totalPrice.toLocaleString("vi-VN") + "đ"}
          </div>
        </div>
        <div className="px-2">
          <button className="bg-sky-500 px-3 py-1 text-white rounded-sm font-bold" onClick={() => setOrderOpen(true)}>
            Mua hàng
          </button>
        </div>
      </div>
      <SelectAddressDialog
        open={open}
        handleClose={() => {
          handleClose();
        }}
        handleSetAddrress={handleSetAddrress}
      ></SelectAddressDialog>
      <OrderDialog
        open={orderOpen}
        onClose={() => {
          onClose();
        }}
        order={selectedItems}
        address={address}
        totalPrice={totalPrice}
      ></OrderDialog>
    </div>
  );
};
