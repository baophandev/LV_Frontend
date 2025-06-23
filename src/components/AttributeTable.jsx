import { useEffect } from "react";
import { fetchAttributeApi } from "../api/productApi";
import { useState } from "react";

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

  return (
    <div className=" mt-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-700">
        Thông số kỹ thuật
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-2 p-2  rounded-md bg-white hover:bg-gray-100 transition"
          >
            <div className="text-gray-600 mt-1">{item.icon}</div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">{item.label}: </span>
              <span className="text-gray-800">
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

