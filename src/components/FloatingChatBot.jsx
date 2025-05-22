import React, { useState } from "react";
import RasaChat from "./RasaChat";
import chatbot from "../assets/chatbot.png"

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 max-h-[600px] z-50 bg-white shadow-lg rounded-lg">
          <RasaChat />
        </div>
      )}

      <button
        className="fixed bottom-4 right-5 bg-white text-white p-3 rounded-full shadow-lg transition z-50 w-16 h-16"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Mở chatbot"
      >
        <img src={chatbot} alt="" />
      </button>
    </>
  );
};

export default FloatingChatBot;
