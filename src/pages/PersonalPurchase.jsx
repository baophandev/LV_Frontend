import { useDispatch, useSelector } from "react-redux";
import ThemeColor from "../constant/theme";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Link } from "react-router-dom";
import { useState } from "react";
import OrderCard from "../components/OrderCard";
import { useEffect } from "react";
import { fetchAllOrder } from "../redux/slices/orderSlice";

const buttonClickedStyle = "text-sky-400 font-semibold border-b-2 border-sky-400";
const buttons = ["Tất cả", "Chờ xác nhận", "Đang giao", "Đã giao", "Đã hủy"];

export const PersonalPurchase = () => {
  const [buttonClicked, setButtonClicked] = useState(0);
  const user = useSelector((state) => state.user.user);
  const userId = user.id;
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.order.orders);
  const orderList = orders.content || [];

  useEffect(() => {
    if (userId) {
      dispatch(fetchAllOrder({ userId: userId, pageNumber: 0, pageSize: 10 }));
    }
  }, [dispatch, userId]);

  return (
    <div className="p-5 w-full sm:w-2/3">
      <div
        className=" p-5 rounded-md mb-4 uppercase text-xl font-extrabold"
        style={{
          backgroundColor: ThemeColor.LIGHT_GRAY,
          color: ThemeColor.MAIN_GRREN,
        }}
      >
        {user.displayName || "Không rõ tên"}
      </div>
      <div className="flex gap-2">
        <div
          className="w-1/4 rounded-md p-5"
          style={{
            backgroundColor: ThemeColor.LIGHT_GRAY,
          }}
        >
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
        <div
          className="w-full rounded-md p-5"
          style={{
            backgroundColor: ThemeColor.LIGHT_GRAY,
          }}
        >
          <div className="bg-white w-full flex justify-around">
            {buttons.map((label, index) => (
              <button
                key={index}
                onClick={() => setButtonClicked(index)}
                className={` p-1 ${
                  buttonClicked === index
                    ? buttonClickedStyle
                    : "text-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="w-full mt-2">
            {Array.isArray(orderList) && orderList.length > 0 ? (
              orderList.map((order, index) => (
                <OrderCard 
                  product={order.items}
                  status={order.status}
                ></OrderCard>
              ))
            ) : ( <div> Không có đơn hàng</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};
