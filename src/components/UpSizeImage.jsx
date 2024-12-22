import { Dialog, DialogContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import Slide from "@mui/material/Slide";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UpSizeImage = ({open, handleClose, images, imageNumber}) => {

    const [imageIndex, setImageIndex] = useState("0");
    useEffect(() => {
        setImageIndex(imageNumber);
    },[imageNumber]);

    return (
        <Dialog TransitionComponent={Transition} open={open} onClose={handleClose} className="w-full">
          <DialogContent className="w-full">
            {images && images[imageNumber] && (
              <img
                className="w-full"
                src={`data:image/png;base64,${images[imageIndex].data}`}
                alt="Ảnh lỗi"
              />
            )}
            <div className="flex gap-1 mt-2">
                {images?.map((image, index) => (
                    <img
                        key={index}
                        className="w-16 h-16 cursor-pointer border"
                        src={`data:image/png;base64,${image.data}`}
                        style={{ objectFit: "cover" }}
                        alt="Ảnh lỗi"
                        onClick={() => setImageIndex(index)}
                    />
                ))}
            </div>
          </DialogContent>
        </Dialog>
    );
}
 
export default UpSizeImage;