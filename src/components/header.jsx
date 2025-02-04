import Logo from "../assets/Logo.png";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import SplitGroup from "./SlpitGroup";
import { Link } from "react-router";
import { fetchCategorys } from "../redux/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ThemeColor from "../constant/theme";
import { getMyInfo, getUserAddress, logout } from "../redux/slices/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const categorys = useSelector((state) => state.categorys.categorys);
  const status = useSelector((state) => state.categorys.status);
  const error = useSelector((state) => state.categorys.error);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategorys());
      if (token) {
        dispatch(getMyInfo(token));
      }
    }
  }, [status, dispatch, token, user]);

  useEffect(() => {
    if(user.id && token){
      dispatch(getUserAddress({token, userId: user.id}));
    }
  }, [user.id, token, dispatch]);


  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  console.log(error);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        style={{ backgroundColor: ThemeColor.LIGHT_GRAY }}
      >
        <Link to="/">
          <img src={Logo} alt="Logo" className="w-32 hidden md:block" />
        </Link>
        <div className=" p-1 px-2 rounded-md shadow-inner bg-white">
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
          <Link
            to={"/cart"}
            className=" flex px-2 py-1 gap-2 rounded-md bg-white"
          >
            <ShoppingCartOutlinedIcon
              sx={{
                color: ThemeColor.DARK_GREEN,
              }}
            />
            <div
              className="w-6 rounded-full flex justify-center items-center shadow-md text-white"
              style={{ backgroundColor: ThemeColor.DARK_GREEN }}
            >
              1
            </div>
          </Link>
          <div className="p-1 rounded-md bg-white">
            {Object.keys(user).length === 0 ? (
              <Link to={"/login"}>Đăng nhập</Link>
            ) : (
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                {user.displayName || "Tài khoản"}
              </Button>
            )}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              sx={{
                zIndex: 9999,
              }}
            >
              <MenuItem onClick={handleClose}>
                <Link to={"/user/account"} className="text-sky-600">
                  Tài khoản
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to={"/user/purchase"} className="text-sky-600">
                  Đơn mua
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link className="text-red-500" onClick={handleLogout}>
                  Đăng xuất
                </Link>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      <div className="p-1 flex flex-wrap justify-around items-center border-b border-b-gray-200 bg-white">
        <div
          className="flex gap-4 justify-center items-center"
          style={{ color: ThemeColor.DARK_GREEN }}
        >
          {/* <SplitGroup></SplitGroup> */}
          {categorys?.map((category) => (
            <Link
              className="hover:text-sky-700"
              to={`/category/${category.id}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
        <div className="">
          <LocalPhoneIcon
            sx={{ color: ThemeColor.DARK_GREEN }}
          ></LocalPhoneIcon>
          Liên hệ: (+84)789668217
        </div>
      </div>
    </div>
  );
};

export default Header;
