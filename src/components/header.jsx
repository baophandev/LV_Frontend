import { Button } from "@mui/material";
import Logo from "../assets/Logo.png";
import ThemeColor from "../constant/theme";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
// import SplitGroup from "./SlpitGroup";
import { Link } from "react-router";
import { fetchCategorys } from "../redux/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const categorys = useSelector((state) => state.categorys.categorys);
  const status = useSelector((state) => state.categorys.status);
  const error = useSelector((state) => state.categorys.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategorys());
    }
  }, [status, dispatch]);

  console.log(error);

  return (
    <div
      style={{
        position: "fixed", // Đặt vị trí cố định
        top: 0, // Cố định header ở phía trên
        left: 0,
        right: 0,
        zIndex: 9999,
      }}
    >
      <div
        className="p-2 flex flex-wrap justify-evenly items-center"
        style={{
          backgroundColor: ThemeColor.MAIN_GREEN,
        }}
      >
        <Link to="/">
          <img src={Logo} alt="Logo" className="w-32 hidden md:block" />
        </Link>
        <div className=" p-1 px-2 rounded-md shadow-inner shadow-gray-800" style={{backgroundColor:ThemeColor.DARK_GREEN}}>
          <input
            className="outline-none bg-transparent"
            spellCheck="false"
            placeholder="Tìm kiếm..."
            type="text"
            name=""
            id=""
          />
          <button>
            <SearchIcon
              sx={{
                color: "gray",
              }}
            />
          </button>
        </div>
        <div className="flex gap-2">
          <Button
            sx={{
              backgroundColor: ThemeColor.DARK_GREEN,
            }}
            className=" flex px-2 py-1 gap-2 rounded-md shadow-md"
          >
            <ShoppingCartOutlinedIcon
              sx={{
                color: "white",
              }}
            />
            <div
              className="w-6 rounded-full flex justify-center items-center text-white shadow-md"
              style={{
                backgroundColor: ThemeColor.MAIN_GREEN,
              }}
            >
              1
            </div>
          </Button>
          <Button
            sx={{
              backgroundColor: ThemeColor.DARK_GREEN,
            }}
            className="p-1 rounded-md shadow-md"
          >
            <PersonOutlineOutlinedIcon
              sx={{
                color : "white",
              }}
            />
          </Button>
        </div>
      </div>
      <div className="p-1 flex flex-wrap justify-around items-center" style={{backgroundColor: ThemeColor.DARK_GREEN  }}>
        <div className="flex gap-4 justify-center items-center">
          {/* <SplitGroup></SplitGroup> */}
          {categorys?.map((category) => (
            <Link className="hover:text-sky-700 text-white" to={`/category/${category.id}`}>
              {category.name}
            </Link>
          ))}
        </div>
        <div className="text-white">
          <LocalPhoneIcon
            sx={{ color: "white" }}
          ></LocalPhoneIcon>
          Liên hệ: (+84)789668217
        </div>
      </div>
    </div>
  );
};

export default Header;
