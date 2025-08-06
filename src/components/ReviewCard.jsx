import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
// import ThemeColor from "../constant/theme";

const ReviewCard = ({ review }) => {
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
    <div className="w-full border-2 border-orange-200 rounded-xl px-6 py-4 mt-3 bg-gradient-to-br from-white to-orange-50 shadow-md hover:shadow-lg transition-all duration-300 hover:border-orange-300">
      <div className="flex items-center gap-3 mb-3">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <span className="text-lg">⭐</span>
          <Rating
            name="text-feedback"
            value={review.rating}
            readOnly
            precision={0.5}
            emptyIcon={
              <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
            }
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#f97316",
              },
              "& .MuiRating-iconEmpty": {
                color: "#fed7aa",
              },
            }}
          />
          <span className="text-orange-600 font-semibold ml-1">
            {review.rating}/5
          </span>
        </Box>
      </div>
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {review.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="font-bold text-gray-700 flex items-center gap-2">
            🐾 {review.displayName}
            <span className="text-xs font-normal text-gray-500 bg-orange-100 px-2 py-1 rounded-full">
              📅 {formatDate(review.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-orange-200 mb-3">
        <div className="font-medium text-gray-800 leading-relaxed flex items-start gap-2">
          <span className="text-orange-500 text-lg">💬</span>
          <span className="flex-1">{review.comment}</span>
        </div>
      </div>
      {review.images.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-600 font-medium text-sm">
              📸 Hình ảnh từ khách hàng:
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {review.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  className="w-20 h-20 rounded-lg object-cover border-2 border-orange-200 shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-105"
                  src={`data:image/png;base64,${image.data}`}
                  alt={`Review ${index + 1}`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
