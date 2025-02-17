import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
// import ThemeColor from "../constant/theme";

const ReviewCard = ({review}) => {

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg px-5 py-3 mt-2">
      <Box sx={{ width: 200, display: "flex", alignItems: "center" }}>
        <Rating
          name="text-feedback"
          value={review.rating}
          readOnly
          precision={0.5}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
      </Box>
      <div className="font-bold text-gray-600">
        {review.displayName} {" - "}{" "}
        <span className="text-xs font-normal">
          {formatDate(review.createdAt)}
        </span>
      </div>
      <div className="font-light">{review.comment}</div>
      <div className="flex mt-1 gap-1 flex-wrap">
        {review.images.length > 0
          ? review.images.map((image) => (
              <img
                className="w-16 rounded-sm"
                src={`data:image/png;base64,${image.data}`}
                alt="Lỗi"
              />
            ))
          : ""}
      </div>
    </div>
  );
};

export default ReviewCard;
