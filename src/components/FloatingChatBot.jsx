// src/components/FloatingChatBot.jsx
import React, { useState } from "react";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import RasaChat from "./RasaChat";

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
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Mở chatbot"
      >
        <SmartToyOutlinedIcon />
      </button>
    </>
  );
};

export default FloatingChatBot;
