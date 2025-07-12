import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, addMessages } from "../redux/slices/chatSlice";
import { Link } from "react-router-dom";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import chatbot from "../assets/chatbot.png";

const RasaChat = () => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    dispatch(addMessage(newMessage));
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        "http://localhost:5005/webhooks/rest/webhook",
        {
          sender: "test_user",
          message: input,
        }
      );

      // Giả lập thời gian phản hồi tự nhiên
      await new Promise((resolve) => setTimeout(resolve, 800));

      const botResponses = response.data;
      const formattedResponses = botResponses.flatMap((res) => {
        if (res.text) {
          return [{ sender: "bot", text: res.text }];
        } else if (res.custom) {
          return [{ sender: "bot", products: res.custom }];
        }
        return [];
      });

      dispatch(addMessages(formattedResponses));
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch(
        addMessage({
          sender: "bot",
          text: "Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu. Vui lòng thử lại!",
        })
      );
    }

    setIsTyping(false);
  };

  // Component sản phẩm
  const ProductCard = ({ product }) => (
    <div className="flex flex-col border border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-400">
      <div className="relative h-40 bg-gray-100">
        <img
          src={`data:${product.productAvatar.imageType};base64,${product.productAvatar.data}`}
          alt={product.name}
          className="w-full h-full object-contain p-2"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 line-clamp-2 h-12 mb-1">
          {product.name}
        </h3>
        <div className="text-lg font-bold text-blue-600 mb-2">
          {product.firstVariantPrice?.toLocaleString("vi-VN")}đ
        </div>
        <Link
          to={`/product/${product.id}`}
          className="block w-full py-2 text-center bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <img src={chatbot} alt="#" className="w-10" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Trợ lý ảo</h2>
            <p className="text-sm opacity-90">
              Chúng tôi có thể giúp gì cho bạn?
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="space-y-4">
            {/* Welcome message */}
            <div className="flex items-start gap-2">
              <div className="mt-1 p-2 rounded-full">
                <img src={chatbot} alt="#" className="w-10" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
                <p className="text-gray-800">
                  Xin chào! Tôi có thể giúp gì cho bạn hôm nay? 🤗
                </p>
              </div>
            </div>

            {/* Messages */}
            {messages.map((msg, index) =>
              msg.products ? (
                <div key={index} className="mt-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="mt-1 p-2 rounded-full">
                      <img src={chatbot} alt="#" className="w-10" />
                    </div>
                  </div>
                  <div className="">
                    {msg.products.map((product) => (
                      <div className="mt-2">
                        <ProductCard key={product.id} product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="mt-1 p-2 rounded-full">
                      <img src={chatbot} alt="#" className="w-10" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[85%] ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === "user" && (
                    <div className="mt-1 bg-blue-100 p-2 rounded-full">
                      <PersonOutlineOutlinedIcon className="text-blue-600" />
                    </div>
                  )}
                </div>
              )
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="mt-1 p-2 rounded-full">
                  <img src={chatbot} alt="#" className="w-10" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm w-20">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-3">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`p-3 rounded-full ${
                input.trim()
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white transition-colors`}
            >
              <PersonOutlineOutlinedIcon />
            </button>
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            Nhấn Enter để gửi • Trợ lý ảo có thể mắc lỗi, hãy kiểm tra thông tin
            quan trọng
          </p>
        </div>
      </div>
    </div>
  );
};

export default RasaChat;
