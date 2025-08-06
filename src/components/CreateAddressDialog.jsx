import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { MenuItem, Select, TextField } from "@mui/material";
import db from "../assets/data/db.json";
import { createAddressApi } from "../api/userApi";
import { useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateAddressDialog = ({ open, handleClose }) => {
  const user = useSelector((state) => state.user.user);
  const userId = user.id;
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [detail, setDetail] = useState("");

  const filteredDistricts = db.district.filter(
    (district) =>
      district.idProvince ===
      db.province.find((p) => p.name === selectedProvince)?.idProvince
  );

  const filteredCommunes = db.commune.filter(
    (commune) =>
      commune.idDistrict ===
      db.district.find((d) => d.name === selectedDistrict)?.idDistrict
  );

  const validateFields = () => {
    if (
      !receiverName ||
      !receiverPhone ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedCommune ||
      !detail
    ) {
      alert("🐾 Vui lòng nhập đầy đủ thông tin để thú cưng nhận được quà!");
      return false;
    }
    return true;
  };

  const handleCreateAddress = async () => {
    if (!validateFields()) return;

    try {
      const response = await createAddressApi({
        address: {
          userId: userId,
          province: selectedProvince,
          district: selectedDistrict,
          ward: selectedCommune,
          detail: detail,
          receiverName: receiverName,
          receiverPhone: receiverPhone,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        alert(
          "🎉 Tạo địa chỉ thành công! Thú cưng của bạn sẽ sớm nhận được quà! 🐾"
        );
        handleClose();
        window.location.reload();
      } else {
        throw new Error("Lỗi khi tạo địa chỉ");
      }
    } catch (err) {
      alert("❌ Tạo địa chỉ thất bại. Vui lòng thử lại!");
      console.log(err);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      keepMounted
      className="pet-dialog"
      maxWidth="md"
      fullWidth
    >
      <div className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 p-4">
        <h2 className="text-xl font-bold text-white text-center">
          🐾 Tạo địa chỉ mới cho thú cưng
        </h2>
        <p className="text-white text-center mt-1 opacity-90">
          Tạo địa chỉ để thú cưng nhận quà nhanh chóng! 🚚🐕
        </p>
      </div>
      <DialogContent className="bg-gradient-to-br from-orange-50 to-pink-50 p-6">
        <div className="flex flex-col gap-4">
          <TextField
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            label="🐕 Tên người nhận"
            fullWidth
            className="bg-white rounded-lg"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#f97316",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ea580c",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#ea580c",
              },
            }}
          />
          <TextField
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
            label="📞 Số điện thoại"
            fullWidth
            className="bg-white rounded-lg"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#f97316",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ea580c",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#ea580c",
              },
            }}
          />
          <div className="font-bold text-orange-600 text-lg mb-2 flex items-center gap-2">
            🏠 Thông tin địa chỉ giao hàng:
          </div>

          <Select
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedDistrict("");
              setSelectedCommune("");
            }}
            displayEmpty
            fullWidth
            className="bg-white rounded-lg"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#f97316",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ea580c",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ea580c",
              },
            }}
          >
            <MenuItem value="" disabled>
              🌆 Chọn Tỉnh/Thành phố
            </MenuItem>
            {db.province.map((province) => (
              <MenuItem key={province.idProvince} value={province.name}>
                {province.name}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedCommune("");
            }}
            displayEmpty
            fullWidth
            disabled={!selectedProvince}
            className="bg-white rounded-lg"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: selectedProvince ? "#f97316" : "#d1d5db",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: selectedProvince ? "#ea580c" : "#9ca3af",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ea580c",
              },
            }}
          >
            <MenuItem value="" disabled>
              🏘️ Chọn Quận/Huyện
            </MenuItem>
            {filteredDistricts.map((district) => (
              <MenuItem key={district.idDistrict} value={district.name}>
                {district.name}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
            displayEmpty
            fullWidth
            disabled={!selectedDistrict}
            className="bg-white rounded-lg"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: selectedDistrict ? "#f97316" : "#d1d5db",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: selectedDistrict ? "#ea580c" : "#9ca3af",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ea580c",
              },
            }}
          >
            <MenuItem value="" disabled>
              🏡 Chọn Xã/Phường
            </MenuItem>
            {filteredCommunes.map((commune) => (
              <MenuItem key={commune.idCommune} value={commune.name}>
                {commune.name}
              </MenuItem>
            ))}
          </Select>

          <TextField
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            label="📍 Chi tiết địa chỉ (Số nhà, tên đường...)"
            fullWidth
            spellCheck="false"
            className="bg-white rounded-lg"
            multiline
            rows={2}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#f97316",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ea580c",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#ea580c",
              },
            }}
          />
          <button
            onClick={handleCreateAddress}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white w-full p-3 mt-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            🐾 Tạo địa chỉ cho thú cưng
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAddressDialog;
