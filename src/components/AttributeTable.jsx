import { useEffect } from "react";
import { fetchAttributeApi } from "../api/productApi";
import { useState } from "react";

import {
  Pets,
  Scale,
  Palette,
  Category,
  Star,
  LocalShipping,
  Schedule,
  Info,
} from "@mui/icons-material";

const AttributeTable = ({ productId }) => {
  const [attribute, setAttribute] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAttributeApi(productId);
        setAttribute(response);
        console.log(response);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
    };

    fetchData();
  }, [productId]);

  const items = [
    {
      label: "Loại thú cưng",
      key: "petType",
      icon: <Pets fontSize="small" />,
    },
    {
      label: "Kích thước",
      key: "size",
      icon: <Scale fontSize="small" />,
    },
    { label: "Biến thể", key: "color", icon: <Palette fontSize="small" /> },
    {
      label: "Chất liệu",
      key: "material",
      icon: <Category fontSize="small" />,
    },
    { label: "Thương hiệu", key: "brand", icon: <Star fontSize="small" /> },
    {
      label: "Xuất xứ",
      key: "origin",
      icon: <LocalShipping fontSize="small" />,
    },
    {
      label: "Độ tuổi phù hợp",
      key: "ageRange",
      icon: <Schedule fontSize="small" />,
    },
    {
      label: "Thông tin khác",
      key: "others",
      icon: <Info fontSize="small" />,
    },
  ];

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-3 text-orange-700 flex items-center gap-2">
        🐾 Thông tin sản phẩm:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-orange-50 transition-colors border border-orange-100 shadow-sm"
          >
            <div className="text-orange-500 mt-0.5">{item.icon}</div>
            <div className="text-sm flex-1">
              <span className="font-medium text-orange-700">
                {item.label}:{" "}
              </span>
              <span className="text-gray-700">
                {attribute[item.key] || "Không có thông tin"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttributeTable;
