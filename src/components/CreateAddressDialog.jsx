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
  const [errors, setErrors] = useState({});

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
    const newErrors = {};
    if (!receiverName) newErrors.receiverName = "Vui lòng nhập tên người nhận";
    if (!receiverPhone) {
      newErrors.receiverPhone = "Vui lòng nhập số điện thoại";
    } else if (!/^\d{9,11}$/.test(receiverPhone)) {
      newErrors.receiverPhone = "Số điện thoại không hợp lệ";
    }
    if (!selectedProvince) newErrors.selectedProvince = "Chọn tỉnh/thành phố";
    if (!selectedDistrict) newErrors.selectedDistrict = "Chọn quận/huyện";
    if (!selectedCommune) newErrors.selectedCommune = "Chọn xã/phường";
    if (!detail) newErrors.detail = "Nhập chi tiết địa chỉ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
            error={!!errors.receiverName}
            helperText={errors.receiverName}
          />
          <TextField
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
            label="Số điện thoại"
            fullWidth
            error={!!errors.receiverPhone}
            helperText={errors.receiverPhone}
          />
          <div className="font-bold">Thêm địa chỉ mới: </div>

          <Select
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedDistrict("");
              setSelectedCommune("");
              setErrors((prev) => ({ ...prev, selectedProvince: undefined }));
            }}
            displayEmpty
            fullWidth
            error={!!errors.selectedProvince}
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
          {errors.selectedProvince && (
            <div className="text-red-500 text-sm">
              {errors.selectedProvince}
            </div>
          )}

          <Select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedCommune("");
              setErrors((prev) => ({ ...prev, selectedDistrict: undefined }));
            }}
            displayEmpty
            fullWidth
            disabled={!selectedProvince}
            error={!!errors.selectedDistrict}
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
          {errors.selectedDistrict && (
            <div className="text-red-500 text-sm">
              {errors.selectedDistrict}
            </div>
          )}

          <Select
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
            displayEmpty
            fullWidth
            disabled={!selectedDistrict}
            error={!!errors.selectedCommune}
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
          {errors.selectedCommune && (
            <div className="text-red-500 text-sm">{errors.selectedCommune}</div>
          )}

          <TextField
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            label="Chi tiết"
            fullWidth
            spellCheck="false"
            error={!!errors.detail}
            helperText={errors.detail}
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
