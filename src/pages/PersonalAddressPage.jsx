import { useSelector } from "react-redux";
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
    <div className="p-5 w-full sm:w-2/3 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      <div className="p-5 rounded-lg mb-4 uppercase text-xl font-extrabold bg-white text-orange-600 shadow-md">
        🐾 {user.displayName || "Khách hàng thú cưng"}
      </div>
      <div className="flex gap-2">
        <div className="w-1/4 rounded-lg p-5 bg-white shadow-md">
          <Link className="text-orange-700 items-center flex cursor-pointer mb-2 font-medium">
            🐱 Tài khoản của tôi
          </Link>
          <Link
            to={"/user/account"}
            className="items-center flex cursor-pointer text-slate-700 hover:text-orange-500 mb-2 ml-4"
          >
            📝 Hồ sơ
          </Link>
          <Link
            to={"/user/address"}
            className="text-orange-500 items-center flex cursor-pointer mb-2 ml-4 font-medium"
          >
            📍 Địa chỉ
          </Link>
          <Link
            to={"/user/purchase"}
            className="text-slate-700 items-center flex cursor-pointer hover:text-orange-500"
          >
            🛍️ Đơn mua
          </Link>
        </div>
        <div className="w-full rounded-lg p-5 bg-white shadow-md">
          <div className="uppercase font-bold text-orange-600 flex items-center gap-2 mb-2">
            📍 Địa chỉ giao hàng thú cưng
          </div>
          <div className="border-b border-orange-200 text-sm text-gray-500 pb-2 mb-4">
            🏠 Quản lý thông tin địa chỉ giao hàng để nhận đồ cho thú cưng nhanh
            chóng
          </div>
          <div>
            <button
              className="py-3 px-6 text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              onClick={handleClickOpen}
            >
              ➕ Thêm địa chỉ mới
            </button>
          </div>
          {addressList.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <span className="text-6xl">🏠</span>
                <span className="text-orange-600 font-medium text-lg">
                  Chưa có địa chỉ giao hàng
                </span>
                <span className="text-gray-500 text-sm">
                  Thêm địa chỉ để nhận đồ cho thú cưng nhanh chóng!
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {addressList.map((address) => (
                <div className="border border-orange-200 rounded-lg overflow-hidden">
                  <AddressCard address={address}></AddressCard>
                </div>
              ))}
            </div>
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
