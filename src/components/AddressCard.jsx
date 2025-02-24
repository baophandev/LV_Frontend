import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { deleteAddressApi } from "../api/userApi";
const AddressCard = ({ address = {} }) => {

    const handleDeleteAddress = async () => {
      try {
        const response = await deleteAddressApi({ addressId: address.id });
        console.log(response);
        alert("Xóa địa chỉ thành công");
        window.location.reload();
      } catch (err) {
        console.log(err);
        alert("Xóa địa chỉ thất bại");
      }
    };

  return (
    <div className="flex w-full items-center border-b border-gray-300 py-2">
      <div className="">
        <div className="font-semibold text-slate-600">
          {address.receiverName}
        </div>
        <div className="text-gray-600 text-sm">{address.receiverPhone}</div>
        <div className="text-gray-600 text-sm">
          {address.detail || "-"} {", "}
          {address.ward || "-"} {", "}
          {address.district || "-"} {", "}
          {address.province || "-"} {"."}
        </div>
      </div>
      <div className="ml-auto">
        <button onClick={() => handleDeleteAddress()} className="text-red-500"><DeleteOutlineIcon fontSize="small"/></button>
      </div>
    </div>
  );
};

export default AddressCard;
