import { useSelector } from "react-redux";
import ThemeColor from "../constant/theme";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Link } from "react-router-dom";
import AddressCard from "../components/AddressCard";
import CreateAddressDialog from "../components/CreateAddressDialog";
import { useState } from "react";

export const PersonalAddressPage = () => {
  const user = useSelector((state) => state.user.user);
  const addressList = useSelector((state) => state.user.address) || [];
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div className="p-5 w-full sm:w-2/3">
      <div
        className=" p-5 rounded-md mb-4 uppercase text-xl font-extrabold bg-white text-blue-500"
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
            className=" text-sky-400 items-center flex cursor-pointer mb-2 ml-4 "
          >
            Địa chỉ
          </Link>
          <Link
            to={"/user/purchase"}
            className=" text-slate-700 items-center flex cursor-pointer hover:text-sky-400"
          >
            <AssignmentOutlinedIcon />
            Đơn mua
          </Link>
        </div>
        <div className="w-full rounded-md p-5 bg-white">
          <div className="uppercase  font-bold text-blue-500">
            Địa chỉ của tôi
          </div>
          <div className="border-b border-gray-300 text-sm text-gray-400 pb-1">
            Quản lý thông tin địa chỉ giao hàng của bạn
          </div>
          <div>
            <button className="py-2 text-sky-500" onClick={handleClickOpen}>
              Thêm địa chỉ mới
            </button>
          </div>
          {addressList.length === 0 ? (
            <div className="text-gray-400">Bạn chưa có địa chỉ nào</div>
          ) : (
            addressList.map((address) => (
              <div className="">
                <AddressCard address={address}></AddressCard>
              </div>
            ))
          )}
        </div>
      </div>
      <CreateAddressDialog
        open={open}
        handleClose={handleClose}
      ></CreateAddressDialog>
    </div>
  );
};
