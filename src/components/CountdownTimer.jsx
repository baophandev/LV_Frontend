import { useEffect, useState } from "react";

const CountdownTimer = ({ initialMinutes = 120 }) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60); // đổi ra giây

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // reset lại countdown khi hết giờ
          return Math.floor(Math.random() * (4 - 1 + 1) + 1) * 3600; // random 1-4 giờ
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg sm:text-xl px-4 py-3 rounded-lg shadow-lg animate-pulse">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="text-yellow-300 text-xl">🎉</span>
        <span className="text-center">Flash Sale Thú Cưng kết thúc sau:</span>
        <div className="bg-white/20 px-3 py-1 rounded-md backdrop-blur-sm">
          <span className="text-yellow-100 font-mono text-lg sm:text-xl">
            {formatTime(timeLeft)}
          </span>
        </div>
        <span className="text-yellow-300 text-xl">🐾</span>
      </div>
      <div className="text-center text-xs sm:text-sm text-yellow-100 mt-1">
        Nhanh tay săn deal cho boss nhà bạn!
      </div>
    </div>
  );
};

export default CountdownTimer;
