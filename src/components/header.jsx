import Logo from "../assets/Logo.png";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router";
import { fetchCategorys } from "../redux/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ThemeColor from "../constant/theme";
import { getMyInfo, getUserAddress, logout } from "../redux/slices/userSlice";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LoginIcon from "@mui/icons-material/Login";
import { fetchCart } from "../redux/slices/cartSlice";

const Header = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.categorys.status);
  const error = useSelector((state) => state.categorys.error);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.user.user);
  const { count } = useSelector((state) => state.cart);
  const userId = user.id;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategorys());
      if (token) {
        dispatch(getMyInfo(token));
      }
    }
  }, [status, dispatch, token, user]);

  useEffect(() => {
      if (userId) {
        dispatch(fetchCart(userId));
      }
    }, [dispatch, userId, status]);

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
        className={`flex flex-wrap justify-evenly items-center bg-white ${
          Object.keys(user).length === 0 ? "py-2" : ""
        }`}
       
      >
        <Link to="/">
          <img src={Logo} alt="Logo" className="w-28 hidden md:block" />
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
          <div className="flex justify-center items-center">
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
                {count || 0}
              </div>
            </Link>
          </div>
          <div className="p-1 rounded-md">
            {Object.keys(user).length === 0 ? (
              <Link
                className="bg-sky-500 text-white p-2 rounded-md font-semibold"
                to={"/login"}
              >
                <LoginIcon /> Đăng nhập
              </Link>
            ) : (
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                {user.avatar ? (
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={`data:image/png;base64,${user.avatar?.data}`}
                    alt="User Avatar"
                  />
                ) : (
                  <AccountCircleOutlinedIcon></AccountCircleOutlinedIcon>
                )}
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
    </div>
  );
};

export default Header;
