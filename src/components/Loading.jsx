import CircularProgress from "@mui/material/CircularProgress";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <CircularProgress
          size={40}
          thickness={4}
          sx={{
            color: "#f97316",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-2xl animate-spin"
            style={{ animationDuration: "2s" }}
          >
            🐾
          </span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-orange-600 font-semibold text-lg animate-pulse">
          Đang tải dữ liệu...
        </p>
        <p className="text-gray-500 text-sm mt-1">
          Thú cưng đang chuẩn bị những điều tuyệt vời cho bạn! 🐕🐱
        </p>
      </div>
    </div>
  );
};

export default Loading;
