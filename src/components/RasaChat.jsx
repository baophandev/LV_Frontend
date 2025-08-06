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
          text: "🐾 Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu. Vui lòng thử lại để tôi có thể hỗ trợ bạn chăm sóc thú cưng tốt hơn! 🐕🐱",
        })
      );
    }

    setIsTyping(false);
  };

  // Component sản phẩm
  const ProductCard = ({ product }) => (
    <div className="flex flex-col border-2 border-orange-200 rounded-xl bg-gradient-to-br from-white to-orange-50 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-orange-400 transform hover:scale-105">
      <div className="relative h-40 bg-gradient-to-br from-orange-50 to-pink-50">
        <img
          src={`data:${product.productAvatar.imageType};base64,${product.productAvatar.data}`}
          alt={product.name}
          className="w-full h-full object-contain p-2"
        />
        <div className="absolute top-2 right-2 text-xl">🐾</div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 line-clamp-2 h-12 mb-1 flex items-start gap-1">
          🎁 {product.name}
        </h3>
        <div className="text-lg font-bold text-orange-600 mb-2 flex items-center gap-1">
          💰 {product.firstVariantPrice?.toLocaleString("vi-VN")}đ
        </div>
        <Link
          to={`/product/${product.id}`}
          className="block w-full py-2 text-center bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg font-medium hover:from-orange-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          🐕 Xem chi tiết cho boss
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl overflow-hidden border-2 border-orange-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <img src={chatbot} alt="Pet Assistant" className="w-10" />
          </div>
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              🐾 Trợ lý thú cưng
            </h2>
            <p className="text-sm opacity-90">
              Tôi có thể giúp gì cho boss và sen hôm nay? 🐕🐱
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-orange-50 to-pink-50">
          <div className="space-y-4">
            {/* Welcome message */}
            <div className="flex items-start gap-2">
              <div className="mt-1 p-2 rounded-full bg-orange-100">
                <img src={chatbot} alt="Pet Assistant" className="w-10" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] border border-orange-200">
                <p className="text-gray-800">
                  🐾 Xin chào! Tôi là trợ lý chăm sóc thú cưng. Tôi có thể giúp
                  bạn tìm sản phẩm, tư vấn chăm sóc boss hoặc trả lời các câu
                  hỏi về thú cưng! 🐕🐱💕
                </p>
              </div>
            </div>

            {/* Messages */}
            {messages.map((msg, index) =>
              msg.products ? (
                <div key={index} className="mt-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="mt-1 p-2 rounded-full bg-orange-100">
                      <img src={chatbot} alt="Pet Assistant" className="w-10" />
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none shadow-sm border border-orange-200">
                      <p className="text-gray-800 text-sm">
                        🛍️ Đây là những sản phẩm tuyệt vời cho thú cưng của bạn:
                      </p>
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
                    <div className="mt-1 p-2 rounded-full bg-orange-100">
                      <img src={chatbot} alt="Pet Assistant" className="w-10" />
                    </div>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl max-w-[85%] ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-br-none shadow-md"
                        : "bg-white text-gray-800 rounded-tl-none shadow-sm border border-orange-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === "user" && (
                    <div className="mt-1 bg-orange-100 p-2 rounded-full border border-orange-200">
                      <PersonOutlineOutlinedIcon className="text-orange-600" />
                    </div>
                  )}
                </div>
              )
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="mt-1 p-2 rounded-full bg-orange-100">
                  <img src={chatbot} alt="Pet Assistant" className="w-10" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm w-20 border border-orange-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t-2 border-orange-200 bg-gradient-to-r from-white to-orange-50 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 border-2 border-orange-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 placeholder-gray-500"
              placeholder="🐾 Hỏi về thú cưng, sản phẩm, chăm sóc..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`p-3 rounded-full transition-all duration-300 ${
                input.trim()
                  ? "bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 transform hover:scale-105"
                  : "bg-gray-300 cursor-not-allowed"
              } text-white shadow-md`}
            >
              <PersonOutlineOutlinedIcon />
            </button>
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            🐾 Nhấn Enter để gửi • Trợ lý thú cưng luôn sẵn sàng hỗ trợ bạn!
          </p>
        </div>
      </div>
    </div>
  );
};

export default RasaChat;
