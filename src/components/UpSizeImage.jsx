import { Dialog, DialogContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpSizeImage = ({ open, handleClose, images, imageNumber }) => {
  const [imageIndex, setImageIndex] = useState("0");
  useEffect(() => {
    setImageIndex(imageNumber);
  }, [imageNumber]);

  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#fff9f5",
          border: "2px solid #f97316",
          borderRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      <div className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📸 Xem ảnh sản phẩm
          </h2>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <DialogContent className="bg-gradient-to-br from-white to-orange-50 p-6">
        {images && images[imageNumber] && (
          <div className="relative">
            <img
              className="w-full max-h-96 object-contain rounded-lg shadow-lg border-2 border-orange-200"
              src={`data:image/png;base64,${images[imageIndex].data}`}
              alt={`Product view ${parseInt(imageIndex) + 1}`}
            />
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              🐾 {parseInt(imageIndex) + 1}/{images.length}
            </div>
          </div>
        )}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-orange-600 font-semibold">
              🖼️ Tất cả ảnh sản phẩm:
            </span>
            <span className="text-gray-500 text-sm">({images.length} ảnh)</span>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            {images?.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  className={`w-20 h-20 cursor-pointer rounded-lg object-cover transition-all duration-300 border-2 ${
                    parseInt(imageIndex) === index
                      ? "border-orange-500 shadow-lg scale-105"
                      : "border-orange-200 hover:border-orange-400 hover:shadow-md hover:scale-105"
                  }`}
                  src={`data:image/png;base64,${image.data}`}
                  style={{ objectFit: "cover" }}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setImageIndex(index)}
                />
                {parseInt(imageIndex) === index && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpSizeImage;
