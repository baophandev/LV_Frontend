import { useSelector } from "react-redux";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { useState } from "react";
import { updateUserApi } from "../api/userApi";
import { useDispatch } from "react-redux";
import { getMyInfo } from "../redux/slices/userSlice";
import { Snackbar, Alert } from "@mui/material";

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
      setToastMessage(
        "🎉 Cập nhật thông tin thành công! Thú cưng của bạn sẽ rất vui! 🐾"
      );
      setToastSeverity("success");
      setOpenToast(true);
    } catch (err) {
      setToastMessage("❌ Lỗi khi cập nhật thông tin. Vui lòng thử lại!");
      setToastSeverity("error");
      setOpenToast(true);
    }
  };

  return (
    <>
      <div className="p-5 w-full sm:w-2/3 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
        <div className="text-orange-600 p-5 rounded-lg mb-4 uppercase text-xl font-extrabold bg-white shadow-md">
          🐾 {user.displayName || "Khách hàng thú cưng"}
        </div>
        <div className="flex gap-2">
          <div className="w-1/4 rounded-lg p-5 bg-white shadow-md">
            <Link className="text-orange-700 items-center flex cursor-pointer mb-2 font-medium">
              {/* <PermIdentityOutlinedIcon
                sx={{ color: "#ea580c", marginRight: 1 }}
              /> */}
              🐱 Tài khoản của tôi
            </Link>
            <Link
              to={"/user/account"}
              className="items-center flex cursor-pointer text-orange-500 mb-2 ml-4 font-medium"
            >
              📝 Hồ sơ
            </Link>
            <Link
              to={"/user/address"}
              className="text-slate-700 items-center flex cursor-pointer mb-2 ml-4 hover:text-orange-500"
            >
              📍 Địa chỉ
            </Link>
            <Link
              to={"/user/purchase"}
              className="text-slate-700 items-center flex cursor-pointer hover:text-orange-500"
            >
              {/* <AssignmentOutlinedIcon
                sx={{ color: "#9ca3af", marginRight: 1 }}
              /> */}
              🛍️ Đơn mua
            </Link>
          </div>
          <div className="w-full rounded-lg p-5 bg-white shadow-md">
            <div className="uppercase font-bold text-orange-600 flex items-center gap-2">
              👤 Quản lý hồ sơ
            </div>
            <div className="border-b border-orange-200 text-sm text-gray-500 pb-2 mb-4">
              🔒 Quản lý thông tin hồ sơ để bảo mật tài khoản và chăm sóc thú
              cưng tốt hơn
            </div>
            <div className="space-y-4">
              <div className="text-center p-5 flex flex-col items-center justify-center gap-2 bg-orange-50 rounded-lg">
                {previewAvatarUrl ? (
                  <img
                    className="w-32 h-32 rounded-full object-cover border-4 border-orange-200"
                    src={previewAvatarUrl}
                    alt="preview-avatar"
                  />
                ) : user.avatar && user.avatar.data ? (
                  <img
                    className="w-32 h-32 rounded-full object-cover border-4 border-orange-200"
                    src={`data:image/png;base64,${user.avatar.data}`}
                    alt="avatar"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center border-4 border-orange-200">
                    <AccountCircleOutlinedIcon
                      fontSize="large"
                      sx={{ color: "#fb923c" }}
                    />
                  </div>
                )}

                <div className="text-orange-600 text-sm font-medium">
                  📷 Dụng lượng file tối đa 1 MB • Định dạng: JPEG, PNG
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="upload-images"
                    className="cursor-pointer flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium bg-orange-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    🖼️ <span>Chọn ảnh đại diện</span>
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
                <label className="flex items-center gap-1 text-orange-700 font-medium mb-2">
                  👤 Họ và tên:
                </label>
                <input
                  type="text"
                  value={updateData.displayName}
                  onChange={(e) => handleChange("displayName", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-orange-700 font-medium mb-2">
                  📧 Email:
                </label>
                <input
                  type="email"
                  value={updateData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
                  placeholder="Nhập địa chỉ email"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-orange-700 font-medium mb-2">
                  📞 Số điện thoại:
                </label>
                <input
                  type="tel"
                  value={updateData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-orange-700 font-medium mb-2">
                  🎂 Ngày sinh:
                </label>
                <input
                  type="date"
                  value={updateData.dob}
                  onChange={(e) => handleChange("dob", e.target.value)}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
                />
              </div>

              <button
                onClick={handleUpdateUser}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                💾 Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={openToast}
        autoHideDuration={4000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenToast(false)}
          severity={toastSeverity}
          sx={{
            width: "100%",
            "&.MuiAlert-standardSuccess": {
              backgroundColor: "#fed7aa",
              color: "#ea580c",
            },
            "&.MuiAlert-standardError": {
              backgroundColor: "#fee2e2",
              color: "#dc2626",
            },
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
