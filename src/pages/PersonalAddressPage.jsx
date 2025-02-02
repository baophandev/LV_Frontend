import { useSelector } from "react-redux";
import ThemeColor from "../constant/theme";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Link } from "react-router-dom";

export const PersonalAddressPage = () => {
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
          <Link className="font-medium text-slate-700  items-center flex cursor-pointer mb-2">
            <PermIdentityOutlinedIcon />
            Tài khoản của tôi
          </Link>
          <Link
            to={"/user/account"}
            className="font-medium  items-center flex cursor-pointer text-slate-700 hover:text-sky-400 mb-2 ml-4"
          >
            Hồ sơ
          </Link>
          <Link
            to={"/user/address"}
            className="font-medium   text-sky-400 items-center flex cursor-pointer mb-2 ml-4 "
          >
            Địa chỉ
          </Link>
          <Link
            to={"/user/purchase"}
            className="font-medium text-slate-700 items-center flex cursor-pointer hover:text-sky-400"
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
          <div className="uppercase  font-bold text-slate-500">
            Địa chỉ của tôi
          </div>
          <div className="border-b border-gray-300 text-sm text-gray-400 pb-1">
            Quản lý thông tin địa chỉ giao hàng của bạn
          </div>
        </div>
      </div>
    </div>
  );
};
