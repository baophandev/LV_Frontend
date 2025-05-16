// src/components/ChatBot.jsx
import React, { useState } from "react";
import axios from "axios";

const RasaChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await axios.post(
        "http://localhost:5005/webhooks/rest/webhook",
        {
          sender: "test_user",
          message: input,
        }
      );

      const botResponses = response.data;
      const formattedResponses = botResponses.flatMap((res) => {
        if (res.text) {
          return [{ sender: "bot", text: res.text }];
        } else if (res.custom) {
          return [{ sender: "bot", products: res.custom }];
        }
        return [];
      });

      setMessages((prev) => [...prev, ...formattedResponses]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow">
      <div className="h-96 overflow-y-auto mb-4 border p-2 bg-gray-50 rounded">
        {messages.map((msg, index) =>
          msg.products ? (
            <div key={index} className="mb-4">
              <div className="font-bold mb-2">🔍 Sản phẩm tìm thấy:</div>
              {msg.products.map((product) => (
                <div
                  key={product.id}
                  className="border p-2 rounded mb-2 bg-white shadow"
                >
                  <img
                    src={`data:${product.productAvatar.imageType};base64,${product.productAvatar.data}`}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded mb-2"
                  />
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-sm text-gray-600">
                    {product.description}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              key={index}
              className={`mb-2 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {msg.text}
              </span>
            </div>
          )
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default RasaChat;
