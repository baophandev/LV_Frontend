
const AddressCard = ({address = {}}) => {
    return (
      <div className="flex w-full items-center border-b border-gray-300 py-2">
        <div className="">
          <div className="font-semibold text-slate-600">{address.receiverName}</div>
          <div className="text-gray-600 text-sm">{address.receiverPhone}</div>
          <div className="text-gray-600 text-sm">
            {address.detail || "-"} {", "}
            {address.ward || "-"} {", "}
            {address.district || "-"} {", "}
            {address.province || "-"} {"."}
          </div>
        </div>
        <div className="ml-auto">
          <button className="mr-2 text-sky-500">Sửa</button>
          <button className="text-red-500">Xóa</button>
        </div>
      </div>
    );
}

export default AddressCard;