import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import ThemeColor from "../constant/theme";

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

const ReviewCard = () => {
  return (
    <div className="w-full border border-gray-200 rounded-lg px-5 py-3 mt-2">
      <Box sx={{ width: 200, display: "flex", alignItems: "center" }}>
        <Rating
          name="text-feedback"
          value={3.5}
          readOnly
          precision={0.5}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <Box
          sx={{
            ml: 1,
            backgroundColor: ThemeColor.LIGHT_GRAY,
            padding: "1px",
            borderRadius: "5px",
            color: "Gray",
          }}
        >
          {labels[3.5]}
        </Box>
      </Box>
      <div className="font-bold text-gray-600">Phan Gia Bảo</div>
      <div className="font-light">Hàng đẹp chất lượng lắm</div>
      <div className="flex mt-1 gap-1 flex-wrap">
        <img
          className="w-16 rounded-sm"
          src="https://placehold.co/600x400"
          alt=""
        />
        <img
          className="w-16 rounded-sm"
          src="https://placehold.co/600x400"
          alt=""
        />
      </div>
    </div>
  );
};

export default ReviewCard;
