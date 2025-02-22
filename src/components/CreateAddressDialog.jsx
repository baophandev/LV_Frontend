import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import { MenuItem, Select, TextField } from "@mui/material";
import db from "../assets/data/db.json"; // Import file JSON chứa dữ liệu

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateAddressDialog = ({ open, handleClose }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");

  // Lọc danh sách Quận/Huyện dựa vào Tỉnh đã chọn
  const filteredDistricts = db.district.filter(
    (district) => district.idProvince === selectedProvince
  );

  // Lọc danh sách Xã/Phường dựa vào Quận/Huyện đã chọn
  const filteredCommunes = db.commune.filter(
    (commune) => commune.idDistrict === selectedDistrict
  );

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent>
        <div className="flex flex-col gap-3">
          <TextField label="Tên người nhận" variant="outlined" fullWidth />
          <TextField label="Số điện thoại" variant="outlined" fullWidth />
          <div className="font-bold">Thêm địa chỉ mới: </div>

          {/* Chọn Tỉnh/Thành phố */}
          <Select
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedDistrict(""); // Reset quận khi chọn tỉnh mới
              setSelectedCommune(""); // Reset xã khi chọn tỉnh mới
            }}
            displayEmpty
            fullWidth
          >
            <MenuItem value="" disabled>
              Chọn Tỉnh/Thành phố
            </MenuItem>
            {db.province.map((province) => (
              <MenuItem key={province.idProvince} value={province.idProvince}>
                {province.name}
              </MenuItem>
            ))}
          </Select>

          {/* Chọn Quận/Huyện */}
          <Select
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setSelectedCommune(""); // Reset xã khi chọn quận mới
            }}
            displayEmpty
            fullWidth
            disabled={!selectedProvince}
          >
            <MenuItem value="" disabled>
              Chọn Quận/Huyện
            </MenuItem>
            {filteredDistricts.map((district) => (
              <MenuItem key={district.idDistrict} value={district.idDistrict}>
                {district.name}
              </MenuItem>
            ))}
          </Select>

          {/* Chọn Xã/Phường */}
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
              <MenuItem key={commune.idCommune} value={commune.idCommune}>
                {commune.name}
              </MenuItem>
            ))}
          </Select>

          {/* Nhập địa chỉ chi tiết */}
          <TextField label="Chi tiết" variant="outlined" fullWidth />

          <button className="bg-sky-500 text-white w-full p-2 mt-2">
            Tạo địa chỉ
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAddressDialog;
