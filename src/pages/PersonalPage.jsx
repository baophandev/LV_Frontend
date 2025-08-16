import { useSelector } from "react-redux";
import ThemeColor from "../constant/theme";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { useState } from "react";
import { updateUserApi } from "../api/userApi";
import { useDispatch } from "react-redux";
import { getMyInfo } from "../redux/slices/userSlice";
import { Snackbar, Alert } from "@mui/material";
import { getErrorMessage, getSuccessMessage } from "../utils/messageUtils";

export const PersonalPage = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [updateData, setUpdateData] = useState({
    displayName: user.displayName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    dob: user.dob || "",
    avatar: user.avatar || null,
  });
  const [avatar, setAvatar] = useState(null);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState(null);

  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  const handleChange = (field, value) => {
    setUpdateData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateUser = async () => {
    try {
      const formData = new FormData();

      const userData = {
        userId: user.id,
        displayName: updateData.displayName,
        email: updateData.email,
        phoneNumber: updateData.phoneNumber,
        dob: updateData.dob,
      };

      const userBlob = new Blob([JSON.stringify(userData)], {
        type: "application/json",
      });

      formData.append("user", userBlob);
      if (avatar && avatar.length > 0) {
        formData.append("avatar", avatar[0]);
      }

      await updateUserApi(formData);
      if (token) {
        dispatch(getMyInfo(token));
      }
      setToastMessage(getSuccessMessage("PROFILE_UPDATE_SUCCESS"));
      setToastSeverity("success");
      setOpenToast(true);
    } catch (err) {
      const errorMsg = getErrorMessage(
        err,
        "Không thể cập nhật thông tin. Vui lòng thử lại."
      );
      setToastMessage(errorMsg);
      setToastSeverity("error");
      setOpenToast(true);
    }
  };

  return (
    <>
      <div className="p-5 w-full sm:w-2/3">
        <div className="text-blue-500 p-5 rounded-md mb-4 uppercase text-xl font-extrabold bg-white">
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
              className=" items-center flex cursor-pointer text-sky-400 mb-2 ml-4"
            >
              Hồ sơ
            </Link>
            <Link
              to={"/user/address"}
              className=" text-slate-700 items-center flex cursor-pointer mb-2 ml-4 hover:text-sky-400"
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
              Quản lý hồ sơ
            </div>
            <div className="border-b border-gray-300 text-sm text-gray-400 pb-1">
              Quản lý thông tin hồ sơ để bảo mật tài khoản
            </div>
            <div className="space-y-4">
              <div className=" text-center p-5 flex flex-col items-center justify-center gap-2">
                {previewAvatarUrl ? (
                  <img
                    className="w-28 h-28 rounded-full object-cover"
                    src={previewAvatarUrl}
                    alt="preview-avatar"
                  />
                ) : user.avatar && user.avatar.data ? (
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
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="upload-images"
                    className="cursor-pointer flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  >
                    <span>Chọn ảnh</span>
                  </label>

                  <input
                    id="upload-images"
                    accept="image/*"
                    type="file"
                    hidden
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setAvatar(files);

                      if (files && files.length > 0) {
                        const url = URL.createObjectURL(files[0]);
                        setPreviewAvatarUrl(url);
                      }
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Họ và tên:
                </label>
                <input
                  type="text"
                  value={updateData.displayName}
                  onChange={(e) => handleChange("displayName", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email:
                </label>
                <input
                  type="text"
                  value={updateData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Số điện thoại:
                </label>
                <input
                  type="text"
                  value={updateData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Ngày sinh:
                </label>
                <input
                  type="date"
                  value={updateData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <button
                onClick={handleUpdateUser}
                className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-md transition duration-200"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenToast(false)}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
