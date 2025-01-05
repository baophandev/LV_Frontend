import { useEffect } from "react";
import { fetchAttributeApi } from "../api/productApi";
import { useState } from "react";
import ThemeColor from "../constant/theme";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import SourceOutlinedIcon from "@mui/icons-material/SourceOutlined";
import BorderStyleIcon from "@mui/icons-material/BorderStyle";
import CameraOutlinedIcon from "@mui/icons-material/CameraOutlined";
import Battery0BarOutlinedIcon from "@mui/icons-material/Battery0BarOutlined";
import SimCardOutlinedIcon from "@mui/icons-material/SimCardOutlined";

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

  return (
    <div
      className="rounded-md p-4 shadow-inner shadow-gray-800"
      style={{ backgroundColor: ThemeColor.DARK_GREEN }}
    >
      <div className="flex flex-wrap gap-2">
        <div
          className="flex flex-col items-center justify-center text-white p-5 rounded-md"
          style={{ backgroundColor: ThemeColor.MAIN_GREEN }}
        >
          <div className="flex items-center gap-1 ">
            <AppSettingsAltIcon> </AppSettingsAltIcon>
            <span>Hệ điều hành:</span>
          </div>
          <div className="text-yellow-400 ">
            {attribute.os || "Không có thông tin"}
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center text-white p-5 rounded-md"
          style={{ backgroundColor: ThemeColor.MAIN_GREEN }}
        >
          <div className="flex items-center gap-1">
            <SelectAllIcon> </SelectAllIcon>
            <span>CPU (Chíp):</span>
          </div>
          <div className="text-yellow-400 ">
            {attribute.cpu || "Không có thông tin"}
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center text-white p-5 rounded-md"
          style={{ backgroundColor: ThemeColor.MAIN_GREEN }}
        >
          <div className="flex items-center gap-1">
            <BorderStyleIcon> </BorderStyleIcon>
            <span>RAM:</span>
          </div>
          <div className="text-yellow-400 ">
            {attribute.ram || "Không có thông tin"}
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center text-white p-5 rounded-md"
          style={{ backgroundColor: ThemeColor.MAIN_GREEN }}
        >
          <div className="flex items-center gap-1">
            <SourceOutlinedIcon> </SourceOutlinedIcon>
            <span>ROM:</span>
          </div>
          <div className="text-yellow-400 ">
            {attribute.rom || "Không có thông tin"}
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center text-white p-5 rounded-md"
          style={{ backgroundColor: ThemeColor.MAIN_GREEN }}
        >
          <div className="flex items-center gap-1">
            <CameraOutlinedIcon> </CameraOutlinedIcon>
            <span>Camera:</span>
          </div>
          <div className="text-yellow-400 ">
            {attribute.camera || "Không có thông tin"}
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center text-white p-5 rounded-md"
          style={{ backgroundColor: ThemeColor.MAIN_GREEN }}
        >
          <div className="flex items-center gap-1">
            <Battery0BarOutlinedIcon> </Battery0BarOutlinedIcon>
            <span>Pin:</span>
          </div>
          <div className="text-yellow-400 ">
            {attribute.pin || "Không có thông tin"}
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center text-white p-5 rounded-md"
          style={{ backgroundColor: ThemeColor.MAIN_GREEN }}
        >
          <div className="flex items-center gap-1">
            <SimCardOutlinedIcon> </SimCardOutlinedIcon>
            <span>Sim:</span>
          </div>
          <div className="text-yellow-400 ">
            {attribute.sim || "Không có thông tin"}
          </div>
        </div>
      </div>
      <div className="mt-4 text-white ">
        <span>Công nghệ khác: </span>
        <span className="italic" style={{ color: ThemeColor.BLUE }}>
          {attribute.others || "Không có thông tin"}
        </span>
      </div>
    </div>
  );
};

export default AttributeTable;
