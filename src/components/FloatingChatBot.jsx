import React, { useState } from "react";
import RasaChat from "./RasaChat";
import chatbot from "../assets/chatbot.png";

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 max-h-[600px] z-50 bg-gradient-to-br from-orange-50 to-pink-50 shadow-2xl rounded-2xl border-2 border-orange-200">
          <div className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐾</span>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Trợ lý thú cưng
                  </h3>
                  <p className="text-white text-sm opacity-90">
                    Hỗ trợ chăm sóc boss 24/7
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <RasaChat />
        </div>
      )}

      <button
        className="fixed bottom-4 right-5 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-50 w-16 h-16 transform hover:scale-110 animate-bounce border-2 border-white"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="🐾 Mở trợ lý thú cưng"
        title="Hỏi về thú cưng - Luôn sẵn sàng giúp bạn! 🐕🐱"
      >
        {isOpen ? (
          <div className="flex items-center justify-center">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        ) : (
          <div className="relative">
            <img
              src={chatbot}
              alt="Pet Assistant"
              className="w-8 h-8 object-contain"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-white"></div>
            <div className="absolute -bottom-2 -right-2 text-xs">🐾</div>
          </div>
        )}
      </button>
    </>
  );
};

export default FloatingChatBot;
