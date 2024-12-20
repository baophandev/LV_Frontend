import ThemeColor from "../constant/theme";

const FeedbackAmount = ({ value }) => {
  // Đảm bảo value nằm trong khoảng từ 0 đến 5
  const validValue = Math.min(Math.max(value, 0), 5);
  const widthPercentage = (validValue / 5) * 100; // Tính phần trăm dựa trên giá trị tối đa 5 sao

  return (
    <div className="w-1/3 mt-10">
      <div className="font-bold" style={{color: ThemeColor.MAIN_GREEN}}>Đánh giá:</div>
      <div
        className="w-full h-3 relative rounded-md"
        style={{ border: "1px solid #eab308" }}
      >
        <div
          className="bg-yellow-500 h-full rounded-md"
          style={{ width: `${widthPercentage}%` }} // Thiết lập chiều rộng động
        ></div>
      </div>
    </div>
  );
};

export default FeedbackAmount;
