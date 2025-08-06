const FeedbackAmount = ({ value }) => {
  // Đảm bảo value nằm trong khoảng từ 0 đến 5
  const validValue = Math.min(Math.max(value, 0), 5);
  const widthPercentage = (validValue / 5) * 100; // Tính phần trăm dựa trên giá trị tối đa 5 sao

  return (
    <div className="w-1/3 mt-10">
      <div className="font-bold text-orange-600 mb-2 flex items-center gap-2">
        ⭐ Đánh giá từ các sen nuôi thú cưng:
      </div>
      <div className="relative">
        <div
          className="w-full h-4 relative rounded-lg shadow-inner bg-gradient-to-r from-gray-200 to-gray-300"
          style={{ border: "2px solid #f97316" }}
        >
          <div
            className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 h-full rounded-lg transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
            style={{ width: `${widthPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            🐾 <span className="font-medium">{validValue.toFixed(1)}/5.0</span>
          </span>
          <span className="text-orange-600 font-semibold">
            {validValue >= 4.5
              ? "Tuyệt vời! 🥰"
              : validValue >= 3.5
              ? "Rất tốt! 😊"
              : validValue >= 2.5
              ? "Khá ổn 😐"
              : validValue >= 1.5
              ? "Cần cải thiện 😔"
              : "Chưa tốt 😞"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAmount;
