import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import * as React from "react";
import { useSelector } from "react-redux";
import AddressCard from "./AddressCard";
import { Link } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SelectAddressDialog = ({ open, handleClose, handleSetAddrress }) => {
  const addressList = useSelector((state) => state.user.address) || [];
  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <div className="font-bold">Chọn địa chỉ nhận hàng: </div>
          <Link to={"/user/address"} className="text-sm text-sky-500">Thêm địa chỉ mới</Link>
          {addressList.length === 0 ? (
            <div className="text-gray-400">Bạn chưa có địa chỉ nào</div>
          ) : (
            addressList.map((address) => (
              <div className="flex items-center gap-3">
                <AddressCard address={address}></AddressCard>
                <button
                  className="bg-sky-400 text-white px-1 rounded-sm"
                  onClick={() => handleSetAddrress(address)}
                >
                  Chọn
                </button>
              </div>
            ))
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default SelectAddressDialog;
