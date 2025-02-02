import { useSelector } from "react-redux";
import ThemeColor from "../constant/theme";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";

export const PersonalPage = () => {

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
              className="font-medium  items-center flex cursor-pointer text-sky-400 mb-2 ml-4"
            >
              Hồ sơ
            </Link>
            <Link
              to={"/user/address"}
              className="font-medium  text-slate-700 items-center flex cursor-pointer mb-2 ml-4 hover:text-sky-400"
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
              Quản lý hồ sơ
            </div>
            <div className="border-b border-gray-300 text-sm text-gray-400">
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </div>
            <div className="flex justify-around">
              <div className="p-4 w-full">
                <div className="p-2">
                  <label htmlFor="">Họ và tên: </label>
                  <input
                    className="py-1 px-4 rounded-md"
                    type="text"
                    value={user.displayName || "Không rõ"}
                  />
                </div>
                <div className="p-2">
                  <label htmlFor="">Email: </label>
                  <input
                    className="py-1 px-4 rounded-md"
                    type="text"
                    value={user.email || "Không rõ"}
                  />
                </div>
                <div className="p-2">
                  <label htmlFor="">Số điện thoại: </label>
                  <input
                    className="py-1 px-4 rounded-md"
                    type="text"
                    value={user.phoneNumber || "Không rõ"}
                  />
                </div>
                <div className="p-2">
                  <label htmlFor="">Ngày sinh: </label>
                  <input
                    className="py-1 px-4 rounded-md"
                    type="date"
                    value={user.dob || "Không rõ"}
                  />
                </div>
                <button className="px-6 bg-sky-400 text-center  text-white rounded-md">
                  Lưu
                </button>
              </div>
              <div className=" text-center p-5 flex flex-col items-center justify-center gap-2">
                {user.avatar && user.avatar.data ? (
                  <img
                    className="w-28 h-28 rounded-full object-cover"
                    src={`data:image/png;base64,${user.avatar.data}`}
                    alt="avatar"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center">
                    <AccountCircleOutlinedIcon fontSize="large" />
                  </div>
                )}
                <div className="text-gray-400 text-sm">
                  Dụng lượng file tối đa 1 MB Định dạng:.JPEG, .PNG
                </div>
                <button className="px-2 py-1 bg-white border border-gray-200">
                  Chọn ảnh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};
