import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeColor from "../constant/theme";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

export const OrderDetail = () => {
  const user = useSelector((state) => state.user.user);
  
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
          <div className="flex bg-white rounded-b-md p-2 border-b border-dashed">
            <Link
              className="text-gray-400 uppercase text-sm flex items-center"
              to={"/user/purchase"}
            >
              <ArrowBackIosIcon fontSize=""/>Trở lại
            </Link>
            <div className="flex gap-2 ml-auto items-center">
              <div className="text-sm uppercase">MÃ ĐƠN HÀNG: gfya6732fhuw</div>
              <div className="text-sm">|</div>
              <div className="text-orange-600 text-sm uppercase">
                Đang giao hàng
              </div>
            </div>
          </div>
          <div className="rounded-md py-10 bg-white flex flex-col items-center justify-center gap-3">
            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center text-green-500 border-2 border-green-500 rounded-full w-16 p-5 h-16">
                <ReceiptIcon fontSize="large" />
              </div>
              <div className="bg-green-500 w-20 h-1"></div>
              <div className="flex justify-center items-center text-green-500 border-2 border-green-500 rounded-full w-16 p-5 h-16">
                <ReceiptLongIcon fontSize="large" />
              </div>
              <div className="bg-green-500 w-20 h-1"></div>
              <div className="flex justify-center items-center text-green-500 border-2 border-green-500 rounded-full w-16 p-5 h-16">
                <LocalShippingIcon fontSize="large" />
              </div>
              <div className="bg-green-500 w-20 h-1"></div>
              <div className="flex justify-center items-center text-green-500 border-2 border-green-500 rounded-full w-16 p-5 h-16">
                <CheckCircleIcon fontSize="large" />
              </div>
            </div>
            <div className="flex gap-6 text-sm text-green-500">
              <div>Đơn hàng đã đặt</div>
              <div>Đã xác nhận đơn hàng</div>
              <div>Đang vận chuyển</div>
              <div>Đã nhận hàng</div>
            </div>
          </div>
          <div className="p-3 bg-yellow-50 flex items-center text-gray-500 border-t border-dashed rounded-t-md">
            <WarningAmberIcon />
            <div className="text-sm">
              Lưu ý: đây là đơn hàng Thanh toán khi nhận hàng.
            </div>
            <div className="ml-auto">
              <button className="bg-yellow-400 px-2 py-1 text-white">
                Đã nhận được hàng
              </button>
            </div>
          </div>
          <div class="h-[4px] bg-[length:44px_44px] bg-[repeating-linear-gradient(45deg,#f18d9b_0px,#f18d9b_25px,white_25px,white_38px,#6fa6d6_38px,#6fa6d6_44px)]"></div>
          <div className="bg-white p-5">
            <div className="text-lg text-slate-400">Địa Chỉ Nhận Hàng</div>
            <div className="mt-2">Phan Gia Bảo</div>
            <div className="text-sm text-gray-500">0789668217</div>
            <div className="text-sm text-gray-500">
              2/47/19 Mậu Thân, An Hòa, Ninh Kiều, TP. Cần Thơ
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-slate-50 p-4">
            <div className="flex gap-1 items-center">
              <Link to={"/user/purchase/order/id"}>
                <img
                  src="https://placehold.co/600x400"
                  className="w-28 "
                  alt=""
                />
              </Link>
              <div className="">
                <Link to={"/user/purchase/order/id"}>Tên sản phẩm</Link>
                <div className="text-sm text-gray-400">Phân lọa sản phẩm</div>
                <div className="text-sm text-gray-400">Số lượng</div>
              </div>
              <div className="ml-auto ">15.000đ</div>
            </div>
          </div>
          <div className="flex w-full ml-auto p-5 bg-white">
            <div className="ml-auto">
              Thành tiền: <span className="text-orange-500">25.000.000đ</span>
            </div>
          </div>
          <div className="bg-yellow-50 text-sm px-5 py-2 border border-yellow-300">
            Vui lòng thanh toán{" "}
            <span className="text-orange-500">25.000.000</span> khi nhận hàng
          </div>
        </div>
      </div>
    </div>
  );
};
