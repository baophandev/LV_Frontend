import { useDispatch, useSelector } from "react-redux";
import ThemeColor from "../constant/theme";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Link } from "react-router-dom";
import { useState } from "react";
import OrderCard from "../components/OrderCard";
import { useEffect } from "react";
import { fetchOrders } from "../redux/slices/orderSlice";
import { ReduxStuatus } from "../enums/Status";
// import { fetchAllOrder } from "../redux/slices/orderSlice";

const STATUS_MAP = {
  0: "ALL",
  1: "PENDING",
  2: "CONFIRM",
  3: "DELIVERING",
  4: "DELIVERED",
  5: "CANCELLED",
  6: "REFUNDED",
}; 

const buttonClickedStyle = "text-sky-400 font-semibold border-b-2 border-sky-400";
const buttons = ["Tất cả", "Chờ xác nhận", "Đang giao", "Đã giao", "Đã hủy"];

export const PersonalPurchase = () => {
  const user = useSelector((state) => state.user.user);
  const userId = user.id;
  const dispatch = useDispatch();
  const { orderByStatus, status } = useSelector((state) => state.order);
  const [isFocused, setIsFocused] = useState(0);
  const selectedStatus = STATUS_MAP[isFocused];
  const orders = orderByStatus[selectedStatus] || [];

  useEffect(() => {
    const ordersCached = orderByStatus[selectedStatus];
    if (!ordersCached) {
      dispatch(
        fetchOrders({ pageNumber: 0, pageSize: 10, status: selectedStatus, userId: userId })
      );
    }
  }, [dispatch, selectedStatus, orderByStatus, userId]);

  if (status === ReduxStuatus.LOADING) {
    return (
      <div className="w-full h-full flex justify-center items-center text-sky-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-5 w-full sm:w-4/5">
      <div
        className=" p-5 rounded-md mb-4 uppercase text-xl font-extrabold bg-white"
        style={{
          color: ThemeColor.MAIN_GRREN,
        }}
      >
        {user.displayName || "Không rõ tên"}
      </div>
      <div className="flex gap-2">
        <div className="w-1/4 rounded-md p-5 bg-white">
          <Link className=" text-slate-700  items-center flex cursor-pointer mb-2">
            <PermIdentityOutlinedIcon />
            Tài khoản của tôi
          </Link>
          <Link
            to={"/user/account"}
            className="  items-center flex cursor-pointer text-slate-700 hover:text-sky-400 mb-2 ml-4"
          >
            Hồ sơ
          </Link>
          <Link
            to={"/user/address"}
            className=" text-slate-700 hover:text-sky-400  items-center flex cursor-pointer mb-2 ml-4 "
          >
            Địa chỉ
          </Link>
          <Link
            to={"/user/purchase"}
            className=" text-sky-400 items-center flex cursor-pointer "
          >
            <AssignmentOutlinedIcon />
            Đơn mua
          </Link>
        </div>
        <div className="w-full rounded-md">
          <div className="bg-white w-full flex justify-around">
            {buttons.map((label, index) => (
              <button
                key={index}
                onClick={() => setIsFocused(index)}
                className={` p-1 ${
                  isFocused === index ? buttonClickedStyle : "text-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="w-full mt-2">
            {orders ? (
              orders.map((item) => (
                <OrderCard
                  product={item.items}
                  status={item.status}
                  id={item.orderId}
                ></OrderCard>
              ))
            ) : (
              <div className="w-full h-full flex justify-center items-center text-sky-400">
                Không có đơn hàng nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
