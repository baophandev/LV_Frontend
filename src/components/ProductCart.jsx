import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ThemeColor from "../constant/theme";
import { Link } from "react-router-dom";

const ProductCart = ({ id ,image, name, price }) => {
  return (
    <div className=" w-40 sm:w-52 sm:h-72 mb-4 shadow hover:shadow-md rounded-md p-2 pb-5">
      <div className="w-full h-3/4">
        <Link to={`/product/${id}`}>
          <img
            className="w-full h-full rounded-md"
            src={`data:image/png;base64,${image}`}
            alt=""
            style={{
              objectFit: "cover",
            }}
          />
        </Link>
      </div>
      <div className=" flex justify-around">
        <div>
          <Link
            to={`/product/${id}`}
            style={{ color: ThemeColor.MAIN_GREEN }}
            className="line-clamp-2"
          >
            {name}
          </Link>
          <div className="font-extralight">
            {price?.toLocaleString("vi-VN") || "0"}đ
          </div>
        </div>
        <button>
          <AddShoppingCartOutlinedIcon
            sx={{
              color: "white",
              backgroundColor: ThemeColor.DARK_GREEN,
              padding: "2px",
              borderRadius: "5px",
            }}
          ></AddShoppingCartOutlinedIcon>
        </button>
      </div>
    </div>
  );
};

export default ProductCart;
