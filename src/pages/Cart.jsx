
export const Cart = () => {
  return (
    <div className="w-2/3 p-5 min-h-screen">
      <div className=" p-5 text-yellow-400 rounded-md mb-4 font-medium bg-slate-800">
        Giỏ hàng
      </div>
      <div className="flex p-5 rounded-md items-center gap-2 shadow bg-slate-800">
        <input type="checkbox" />
        <img
          className="w-20 rounded-md"
          src="https://placehold.co/600x400"
          alt=""
        />
        <div className="text-yellow-500 w-64">Iphone 15 promax</div>
        <div className="text-white w-64">Phân loại hàng</div>
        <div className="text-white w-32">15.000.000đ</div>
        <input
          className="w-14 bg-transparent text-white shadow-inner shadow-gray-800 px-2 rounded-md"
          type="number"
          value={"2"}
        />
        <div className="text-white w-32">15.000.000đ</div>
        <div className="text-red-500">Xóa</div>
      </div>
    </div>
  );
};
