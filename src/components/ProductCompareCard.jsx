import React from "react";
import {
  Memory,
  CameraAlt,
  BatteryFull,
  SimCard,
  Storage,
  PhoneIphone,
  Settings,
  DeveloperBoard,
} from "@mui/icons-material";
import Rating from "@mui/material/Rating";

const ProductCompareCard = ({ product, attributes, isSelected, onRemove }) => {
  const attributeItems = [
    {
      label: "Hệ điều hành",
      key: "os",
      icon: <PhoneIphone fontSize="small" />,
    },
    {
      label: "CPU (Chip)",
      key: "cpu",
      icon: <DeveloperBoard fontSize="small" />,
    },
    { label: "RAM", key: "ram", icon: <Memory fontSize="small" /> },
    { label: "ROM", key: "rom", icon: <Storage fontSize="small" /> },
    { label: "Camera", key: "camera", icon: <CameraAlt fontSize="small" /> },
    { label: "Pin", key: "pin", icon: <BatteryFull fontSize="small" /> },
    { label: "Sim", key: "sim", icon: <SimCard fontSize="small" /> },
    {
      label: "Công nghệ khác",
      key: "others",
      icon: <Settings fontSize="small" />,
    },
  ];

  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300">
        <div className="text-center text-gray-500">
          <PhoneIphone fontSize="large" className="mb-2" />
          <p>Chọn sản phẩm để so sánh</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getMinPrice = () => {
    if (!product.variants || product.variants.length === 0) return 0;
    return Math.min(...product.variants.map((v) => v.price));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      {isSelected && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
        >
          ×
        </button>
      )}

      {/* Product Image */}
      <div className="flex justify-center mb-4">
        <img
          src={`data:image/png;base64,${product.productAvatar.data}`}
          alt={product.name}
          className="w-32 h-32 object-cover rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="text-center mb-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 line-clamp-2">
          {product.name}
        </h3>
        <div className="text-red-600 font-bold text-xl mb-2">
          {formatPrice(getMinPrice())}
        </div>
        {product.averageRating && (
          <div className="flex items-center justify-center gap-2 mb-2">
            <Rating
              value={product.averageRating}
              readOnly
              size="small"
              precision={0.1}
            />
            <span className="text-sm text-gray-600">
              ({product.reviewCount} đánh giá)
            </span>
          </div>
        )}
      </div>

      {/* Specifications */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700 border-b pb-2">
          Thông số kỹ thuật
        </h4>
        {attributeItems.map((item) => (
          <div
            key={item.key}
            className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-b-0"
          >
            <div className="text-gray-600 mt-1 flex-shrink-0">{item.icon}</div>
            <div className="text-sm flex-1">
              <div className="font-medium text-gray-700 mb-1">{item.label}</div>
              <div className="text-gray-600">
                {attributes && attributes[item.key]
                  ? attributes[item.key]
                  : "Không có thông tin"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCompareCard;
