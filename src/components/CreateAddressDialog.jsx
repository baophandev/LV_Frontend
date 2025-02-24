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
      alert("Vui lòng nhập đầy đủ thông tin");
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
         alert("Tạo địa chỉ thành công");
         handleClose();
         window.location.reload();
       } else {
         throw new Error("Lỗi khi tạo địa chỉ");
       }
     } catch (err) {
       alert("Tạo địa chỉ thất bại");
       console.log(err);
     }
   };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      keepMounted
    >
      <DialogContent>
        <div className="flex flex-col gap-3">
          <TextField
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            label="Tên người nhận"
            fullWidth
          />
          <TextField
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
            label="Số điện thoại"
            fullWidth
          />
          <div className="font-bold">Thêm địa chỉ mới: </div>

          <Select
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedDistrict("");
              setSelectedCommune("");
            }}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Chọn Tỉnh/Thành phố
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
          >
            <MenuItem value="" disabled>
              Chọn Quận/Huyện
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
          >
            <MenuItem value="" disabled>
              Chọn Xã/Phường
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
            label="Chi tiết"
            fullWidth
            spellCheck = "false"
          />
          <button
            onClick={handleCreateAddress}
            className="bg-sky-500 text-white w-full p-2 mt-2"
          >
            Tạo địa chỉ
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAddressDialog;
