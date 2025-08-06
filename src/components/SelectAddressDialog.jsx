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
        maxWidth="md"
        fullWidth
        className="pet-dialog"
      >
        <div className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 p-4">
          <h2 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
            🏠 Chọn địa chỉ giao hàng cho thú cưng
          </h2>
          <p className="text-white text-center mt-1 opacity-90">
            Chọn địa chỉ để thú cưng nhận được quà nhanh nhất! 🚚🐾
          </p>
        </div>
        <DialogContent className="bg-gradient-to-br from-orange-50 to-pink-50 p-6">
          <div className="mb-4">
            <Link
              to={"/user/address"}
              className="inline-flex items-center gap-2 text-sm bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-md font-medium"
            >
              ➕ Thêm địa chỉ mới cho thú cưng
            </Link>
          </div>
          {addressList.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🏠</div>
              <div className="text-gray-600 text-lg mb-2">
                Bạn chưa có địa chỉ nào
              </div>
              <div className="text-gray-500 text-sm">
                Thêm địa chỉ để thú cưng có thể nhận được quà! 🐾
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {addressList.map((address, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex-1">
                    <AddressCard address={address} />
                  </div>
                  <button
                    className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2 whitespace-nowrap"
                    onClick={() => handleSetAddrress(address)}
                  >
                    🐾 Chọn địa chỉ này
                  </button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default SelectAddressDialog;
