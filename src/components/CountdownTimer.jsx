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
    <div className="text-red-600 font-bold text-2xl bg-white px-3 py-1">
      🔥 Flash Sale kết thúc sau: {formatTime(timeLeft)}
    </div>
  );
};

export default CountdownTimer;
