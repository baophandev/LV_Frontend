import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { deleteAddressApi } from "../api/userApi";
const AddressCard = ({ address = {} }) => {
  const handleDeleteAddress = async () => {
    try {
      const response = await deleteAddressApi({ addressId: address.id });
      console.log(response);
      alert(
        "🗑️ Xóa địa chỉ thành công! Thú cưng của bạn có thể cần địa chỉ mới để nhận quà! 🐾"
      );
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("❌ Xóa địa chỉ thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div className="flex w-full items-center border-b border-orange-200 py-4 px-4 hover:bg-orange-50 transition-colors">
      <div className="flex-1">
        <div className="font-semibold text-orange-700 flex items-center gap-2 mb-1">
          👤 {address.receiverName}
        </div>
        <div className="text-gray-600 text-sm flex items-center gap-2 mb-1">
          📞 {address.receiverPhone}
        </div>
        <div className="text-gray-600 text-sm flex items-center gap-2">
          🏠 {address.detail || "-"} {", "}
          {address.ward || "-"} {", "}
          {address.district || "-"} {", "}
          {address.province || "-"} {"."}
        </div>
        {address.isDefault && (
          <div className="mt-2">
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-medium">
              ⭐ Địa chỉ mặc định
            </span>
          </div>
        )}
      </div>
      <div className="ml-4">
        <button
          onClick={() => handleDeleteAddress()}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
          title="Xóa địa chỉ"
        >
          <DeleteOutlineIcon fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
