import { Link } from "react-router-dom";

const OrderCard = () => {
  return (
    <div className=" w-full bg-white p-2 mt-2">
      <div className="flex justify-end text-yellow-400 border-b border-dashed pb-1">
        Trạng thái
      </div>
      <div>
        <div className="flex gap-1 items-center border-b border-dashed py-2">
          <img src="https://placehold.co/600x400" className="w-28 " alt="" />
          <div className="">
            <Link>Tên sản phẩm</Link>
            <div className="text-sm text-gray-400">Phân lọa sản phẩm</div>
            <div className="text-sm text-gray-400">Số lượng</div>
          </div>
          <div className="ml-auto ">15.000đ</div>
        </div>
        <div className="py-2 flex items-center">
          <div className="text-xs text-gray-400">
            Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được giao đến
            <br />
            bạn và sản phẩm nhận được không có vấn đề nào.
          </div>
          <div className="ml-auto flex flex-col gap-1">
            <div className="">
              <span className="text-sm">Thành tiền</span>
              <span className="text-sky-500 text-lg">: 25.000.000</span>
            </div>
            <div className="ml-auto">
                <button className="bg-yellow-400 px-2 py-1 text-white">Đã nhận được hàng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default OrderCard;
