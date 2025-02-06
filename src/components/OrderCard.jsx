import { Link } from "react-router-dom";

const OrderCard = () => {
  return (
    <>
      <div className="flex justify-end text-yellow-400 border-b border-dashed bg-white rounded-b-md p-2 mt-2">
        Trạng thái
      </div>
      <div className="flex flex-col gap-2 rounded-md bg-white p-2 border-b border-dashed">
        <div className="flex gap-1 items-center">
          <Link to={"/user/purchase/order/id"}>
            <img src="https://placehold.co/600x400" className="w-28 " alt="" />
          </Link>
          <div className="">
            <Link to={"/user/purchase/order/id"}>Tên sản phẩm</Link>
            <div className="text-sm text-gray-400">Phân lọa sản phẩm</div>
            <div className="text-sm text-gray-400">Số lượng</div>
          </div>
          <div className="ml-auto ">15.000đ</div>
        </div>
      </div>
      <div className="py-2 flex items-center bg-white rounded-t-md p-2">
        <div className="text-xs text-gray-400">
          Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao đến
          <br />
          bạn và sản phẩm nhận được không có vấn đề nào.
        </div>
        <div className="ml-auto flex flex-col gap-1">
          <div className="">
            <span className="text-sm">Thành tiền</span>
            <span className="">: 25.000.000đ</span>
          </div>
          <div className="ml-auto">
            <button className="bg-yellow-400 px-2 py-1 text-white">
              Đã nhận được hàng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderCard;
