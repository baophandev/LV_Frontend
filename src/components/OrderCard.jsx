import { Link } from "react-router-dom";

const OrderCard = ({ product, status, id }) => {

  const renderStatus = () => {
    switch (status) {
      case "PENDING":
        return "CHỜ XÁC NHẬN";
      default:
        return "-";
    }
  };

  return (
    <>
      <div className="flex justify-end text-yellow-400 border-b border-dashed bg-white rounded-b-md p-2 mt-2 text-xs">
        {renderStatus()}
      </div>
      {Array.isArray(product) && product.length > 0
        ? product.map((prd, index) => (
            <>
              <div className="flex flex-col gap-2 rounded-md bg-white p-2 border-b border-dashed">
                <div className="flex gap-1 items-center">
                  {/* <Link to={"/user/purchase/order/id"}>
            <img src="https://placehold.co/600x400" className="w-28 " alt="" />
          </Link> */}
                  <div className="">
                    <Link to={`/user/purchase/order/${id}`}>
                      {prd.name}
                    </Link>
                    <div className="text-sm text-gray-400">{prd.color}</div>
                    <div className="text-sm text-gray-400">
                      Số lượng: {prd.quantity}
                    </div>
                  </div>
                  <div className="ml-auto ">
                    {prd.discountedPrice.toLocaleString("vi-VN") + "đ"}
                  </div>
                </div>
              </div>
              <div className="py-2 flex items-center bg-white rounded-t-md p-2">
                <div className="text-xs text-gray-400">
                  Vui lòng chỉ nhấn "Đã nhận được hàng" khi đơn hàng đã được
                  giao đến
                  <br />
                  bạn và sản phẩm nhận được không có vấn đề nào.
                </div>
                <div className="ml-auto flex flex-col gap-1">
                  <div className="">
                    <span className="text-sm">Thành tiền: </span>
                    <span className="">
                      {prd.calculatePrice.toLocaleString("vi-VN") + "đ"}
                    </span>
                  </div>
                  <div className="ml-auto">
                    <button className="bg-yellow-400 px-2 py-1 text-white">
                      Đã nhận được hàng
                    </button>
                  </div>
                </div>
              </div>
            </>
          ))
        : ""}
    </>
  );
};

export default OrderCard;
