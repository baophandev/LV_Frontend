import { useEffect } from "react";
import { fetchAttributeApi } from "../api/productApi";
import { useState } from "react";

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
    <div className="">
      <div className="">
        <div className="">
          <div className="flex items-center gap-1 ">
            <span>- Hệ điều hành: {attribute.os || "Không có thông tin"}</span>
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-1">
            <span>- CPU (Chíp): {attribute.cpu || "Không có thông tin"}</span>
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-1">
            <span>- RAM: {attribute.ram || "Không có thông tin"}</span>
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-1">
            <span>- ROM : {attribute.rom || "Không có thông tin"}</span>
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-1">
            <span>- Camera: {attribute.camera || "Không có thông tin"}</span>
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-1">
            <span>- Pin: {attribute.pin || "Không có thông tin"}</span>
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-1">
            <span>- Sim: {attribute.sim || "Không có thông tin"}</span>
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-1">
            <span>
              - Công nghệ khác: {attribute.others || "Không có thông tin"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeTable;
