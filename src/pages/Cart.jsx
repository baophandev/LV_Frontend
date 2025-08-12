import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import {
  getVariantDiscount,
  fetchProductApi,
  getVariantImageApi,
} from "../api/productApi";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SelectAddressDialog from "../components/SelectAddressDialog";
import OrderDialog from "../components/OrderDialog";
import EditVariantDialog from "../components/EditVariantDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import {
  deleteCartItemApi,
  updateCartQuantityApi,
  addtoCartApi,
} from "../api/cartApi";

export const Cart = () => {
  const { cart, status } = useSelector((state) => state.cart);
  const cartData = cart?.data?.items || [];
  const [updatedCart, setUpdatedCart] = useState(null);
  const [open, setOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [editVariantOpen, setEditVariantOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const addressList = useSelector((state) => state.user.address);
  const memoizedAddressList = useMemo(() => addressList || [], [addressList]);
  const [count, setCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItems, setSelectedItems] = useState({}); // Lưu trạng thái checkbox
  const [selectAll, setSelectAll] = useState(false);
  const user = useSelector((state) => state.user.user);
  const userId = user.id;

  const [address, setAddress] = useState(null);

  // Helper function để lấy ảnh biến thể
  const getVariantImage = (item) => {
    // Ưu tiên: ảnh riêng của biến thể > ảnh từ variantImages > ảnh avatar biến thể > ảnh sản phẩm
    if (item.variantImage?.data) {
      return {
        src: `data:image/png;base64,${item.variantImage.data}`,
        alt: `${item.productName} - ${item.productColor}`,
        isVariantImage: true,
      };
    }

    if (item.variantDetails?.variantImages?.length > 0) {
      return {
        src: `data:image/png;base64,${item.variantDetails.variantImages[0].data}`,
        alt: `${item.productName} - ${item.productColor}`,
        isVariantImage: true,
      };
    }

    if (item.variantDetails?.avatar?.data) {
      return {
        src: `data:image/png;base64,${item.variantDetails.avatar.data}`,
        alt: `${item.productName} - ${item.productColor}`,
        isVariantImage: true,
      };
    }

    // Fallback về ảnh sản phẩm
    return {
      src: `data:image/png;base64,${item.productAvatar.data}`,
      alt: item.productName,
      isVariantImage: false,
    };
  };

  console.log("Selected item: ", selectedItems);

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

    const updateVariantsWithDetails = async () => {
      try {
        const updatedVariants = await Promise.all(
          cart.data.items.map(async (cartItem) => {
            try {
              // Lấy thông tin discount
              const discountResponse = await getVariantDiscount(
                cartItem.productVariantId
              );

              // Thử lấy ảnh biến thể riêng biệt
              const variantImageResponse = await getVariantImageApi(
                cartItem.productVariantId
              );

              // Lấy thông tin sản phẩm để có được variants với ảnh (fallback)
              const productResponse = await fetchProductApi(cartItem.productId);

              // Tìm biến thể tương ứng trong sản phẩm
              const variantDetails = productResponse?.variants?.find(
                (variant) => variant.id === cartItem.productVariantId
              );

              console.log(
                "Product response for",
                cartItem.productName,
                ":",
                productResponse
              );
              console.log("Found variant details:", variantDetails);
              console.log("Variant image response:", variantImageResponse);

              return {
                ...cartItem,
                discountValue: discountResponse?.discountValue || 0,
                variantDetails: variantDetails || null,
                variantImage: variantImageResponse || null,
              };
            } catch (err) {
              console.error("Lỗi khi lấy thông tin biến thể:", err);
              return {
                ...cartItem,
                discountValue: 0,
                variantDetails: null,
                variantImage: null,
              };
            }
          })
        );

        setUpdatedCart({ ...cart.data, items: updatedVariants });
      } catch (error) {
        console.error("Lỗi khi cập nhật variants với chi tiết:", error);
      }
    };

    updateVariantsWithDetails();
  }, [cart?.data?.items, cart]);

  const displayedCartItem =
    updatedCart?.items?.length > 0 ? updatedCart.items : cartData;

  console.log("Cart items với variant details:", displayedCartItem);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onClose = () => {
    setOrderOpen(false);
  };

  const handleSelectAll = (isChecked) => {
    setSelectAll(isChecked);
    if (isChecked) {
      const allItems = {};
      displayedCartItem.forEach((item) => {
        allItems[item.itemId] = item;
      });
      setSelectedItems(allItems);
    } else {
      setSelectedItems({});
    }
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

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await deleteCartItemApi({ userId, itemId });
      window.location.reload();
      return response;
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng", err);
      throw new Error("Lỗi khi xóa sản phẩm khỏi giỏ hàng", err);
    }
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

  const handleQuantityChange = async (item, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) return;

    try {
      await updateCartQuantityApi({
        userId: userId,
        cartItemId: item.itemId,
        quantity: quantity,
      });

      setUpdatedCart((prev) => {
        const updatedItems = prev.items.map((cartItem) =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, quantity: quantity }
            : cartItem
        );
        return { ...prev, items: updatedItems };
      });
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
    }
  };

  const handleEditVariant = (cartItem) => {
    setSelectedCartItem(cartItem);
    setEditVariantOpen(true);
  };

  const handleUpdateVariant = async (cartItemId, newVariantId) => {
    try {
      console.log("Đang cập nhật biến thể:", {
        cartItemId,
        newVariantId,
        userId,
      });

      // Tìm cart item hiện tại để lấy số lượng
      const currentItem = displayedCartItem.find(
        (item) => item.itemId === cartItemId
      );
      if (!currentItem) {
        throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
      }

      // Xóa item cũ
      await deleteCartItemApi({ userId, itemId: cartItemId });

      // Thêm item mới với variant mới
      await addtoCartApi({
        userId: userId,
        variantId: newVariantId,
        quantity: currentItem.quantity,
      });

      console.log("Cập nhật biến thể thành công");

      // Reload trang để cập nhật dữ liệu mới
      window.location.reload();
    } catch (error) {
      console.error("Lỗi cập nhật biến thể:", error);
      alert("Có lỗi xảy ra khi cập nhật biến thể. Vui lòng thử lại!");
    }
  };

  const handleCloseEditVariant = () => {
    setEditVariantOpen(false);
    setSelectedCartItem(null);
  };

  if (status === "loading") return <Loading></Loading>;

  return (
    <div className="w-4/5 p-5 min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="text-orange-600 p-5 rounded-md mb-4 uppercase text-xl font-extrabold bg-white shadow-md">
        🛒 Giỏ hàng thú cưng
      </div>
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead sx={{ backgroundColor: "white" }}>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={selectAll}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  sx={{
                    color: "#fb923c",
                    "&.Mui-checked": { color: "#fb923c" },
                  }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ea580c" }}>
                🖼️ Ảnh
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ea580c" }}>
                🐾 Tên sản phẩm
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ea580c" }}>
                🏷️ Phân loại
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ea580c" }}>
                💰 Đơn giá
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ea580c" }}>
                📦 SL
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ea580c" }}>
                💸 Tổng tiền
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ea580c" }}>
                ⚙️ Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedCartItem.length > 0 ? (
              displayedCartItem.map((item, index) => (
                <TableRow
                  key={index}
                  style={{
                    backgroundColor: index % 2 !== 0 ? "#f9f9f9" : "inherit",
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={!!selectedItems[item.itemId]}
                      onChange={(e) => handleSelectItem(item, e.target.checked)}
                      sx={{
                        color: "#fb923c",
                        "&.Mui-checked": { color: "#fb923c" },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const imageData = getVariantImage(item);
                      return (
                        <div className="relative">
                          <img
                            className="w-20 h-20 object-cover rounded-md border"
                            src={imageData.src}
                            alt={imageData.alt}
                          />
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/product/${item.productId}`}>
                      {item.productName}
                    </Link>
                  </TableCell>
                  <TableCell>{item.productColor}</TableCell>
                  <TableCell>
                    {item.discountValue > 0
                      ? `${(
                          (item.price || 0) *
                          (1 - item.discountValue / 100)
                        ).toLocaleString("vi-VN")}đ`
                      : `${(item.price || 0).toLocaleString("vi-VN")}đ`}
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
                  </TableCell>
                  <TableCell>
                    <input
                      className="w-16 border-2 border-orange-300 rounded-lg px-2 py-1 focus:border-orange-500 focus:outline-none"
                      type="number"
                      min={1}
                      value={item.quantity || 0}
                      onChange={(e) =>
                        handleQuantityChange(item, e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {(
                      (item.price || 0) *
                      (1 - item.discountValue / 100) *
                      (item.quantity || 0)
                    ).toLocaleString("vi-VN")}
                    đ
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditVariant(item)}
                        className="text-orange-500 hover:text-orange-600"
                        title="Chỉnh sửa biến thể"
                      >
                        <EditOutlinedIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.itemId)}
                        className="text-red-500 hover:text-red-600"
                        title="Xóa sản phẩm"
                      >
                        <DeleteOutlineOutlinedIcon />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8"
                  style={{ color: "#ea580c", textAlign: "center" }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">🐾</span>
                    <span className="text-lg font-medium">Giỏ hàng trống</span>
                    <span className="text-sm text-gray-500">
                      Hãy thêm một số sản phẩm!
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        className="bg-white fixed z-100 w-4/5 bottom-5 rounded-lg p-5 flex items-center shadow-lg border-t-4 border-orange-400"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div className="flex gap-2 border-r border-orange-200 pr-3 ml-auto">
          <div className="text-orange-700 font-medium">
            📍 Địa chỉ giao hàng:{" "}
          </div>
          <div className="text-slate-600">
            {address ? (
              <>
                <div className="text-sm font-medium">
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
              className="text-orange-500 text-sm cursor-pointer hover:text-orange-600 font-medium"
              onClick={handleClickOpen}
            >
              Thay đổi
            </div>
          </div>
        </div>
        <div className="flex gap-2 border-r border-orange-200 px-2">
          <div className="text-orange-700 font-medium">✅ Đã chọn: </div>
          <div className="text-slate-600 font-bold">{count}</div>
        </div>
        <div className="flex gap-2 px-2 border-r border-orange-200">
          <div className="text-orange-700 font-medium">
            💰 Tổng thanh toán:{" "}
          </div>
          <div className="text-slate-600 font-bold text-lg">
            {totalPrice.toLocaleString("vi-VN") + "đ"}
          </div>
        </div>
        <div className="px-2">
          <button
            className={`mt-4 px-6 py-3 font-bold text-white rounded-lg transition-colors ${
              count === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 shadow-md"
            }`}
            onClick={() => setOrderOpen(true)}
            disabled={count === 0}
          >
            🛍️ Mua hàng
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
      <EditVariantDialog
        open={editVariantOpen}
        onClose={handleCloseEditVariant}
        cartItem={selectedCartItem}
        onUpdateVariant={handleUpdateVariant}
      />
    </div>
  );
};
