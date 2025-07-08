import Logo from "../assets/Logo.png";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router";
import { fetchCategorys } from "../redux/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ThemeColor from "../constant/theme";
import { getMyInfo, getUserAddress, logout } from "../redux/slices/userSlice";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { fetchCart } from "../redux/slices/cartSlice";
import useVoiceSearch from "../hooks/useVoiceSearch"; // Import custom hook

const Header = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.categorys.status);
  const error = useSelector((state) => state.categorys.error);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.user.user);
  const { count } = useSelector((state) => state.cart);
  const userId = user.id;

  // Voice search hook
  const {
    isListening,
    isSupported,
    transcript,
    error: voiceError,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceSearch("vi-VN");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

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
    if (user.id && token) {
      dispatch(getUserAddress({ token, userId: user.id }));
    }
  }, [user.id, token, dispatch]);

  // Update search query when voice transcript changes
  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
    }
  }, [transcript]);

  // Show error message
  useEffect(() => {
    if (voiceError) {
      alert(voiceError);
    }
  }, [voiceError]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
  };

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Thực hiện tìm kiếm ở đây
      console.log("Searching for:", searchQuery);
      // Có thể dispatch action tìm kiếm hoặc navigate đến trang tìm kiếm
      // dispatch(searchProducts(searchQuery));
      // hoặc
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    resetTranscript();
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
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
      }}
      className="shadow-sm bg-white"
    >
      <div className="flex justify-between items-center px-6 py-1 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="w-28 hidden md:block" />
        </Link>

        {/* Ô tìm kiếm */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center bg-gray-100 px-3 py-2 rounded-md w-64 sm:w-72 md:w-96"
        >
          <input
            className="flex-grow bg-transparent outline-none text-sm pr-2"
            spellCheck="false"
            placeholder={isListening ? "Đang nghe..." : "Tìm kiếm sản phẩm..."}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Clear button */}
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="mr-2 text-gray-400 hover:text-gray-600"
              title="Xóa tìm kiếm"
            >
              ×
            </button>
          )}

          {/* Voice Search Button */}
          {isSupported && (
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`mr-2 p-1 rounded-full transition-all duration-200 ${
                isListening
                  ? "bg-red-500 text-white animate-pulse shadow-md"
                  : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              }`}
              title={
                isListening
                  ? "Đang nghe... (Click để dừng)"
                  : "Tìm kiếm bằng giọng nói"
              }
            >
              {isListening ? (
                <MicOffIcon fontSize="small" />
              ) : (
                <MicIcon fontSize="small" />
              )}
            </button>
          )}

          <button type="submit" className="text-gray-500 hover:text-gray-700">
            <SearchIcon />
          </button>
        </form>

        {/* Các action */}
        <div className="flex items-center gap-4">
          {/* Giỏ hàng */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 hover:text-green-600 transition-colors"
          >
            <ShoppingCartOutlinedIcon
              fontSize="medium"
              sx={{ color: ThemeColor.DARK_GREEN }}
            />
            <span className="absolute -top-2 -right-2 text-xs bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
              {count || 0}
            </span>
          </Link>

          {/* Người dùng */}
          {Object.keys(user).length === 0 ? (
            <Link
              to="/login"
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 transition-all"
            >
              <LoginIcon fontSize="small" /> Đăng nhập
            </Link>
          ) : (
            <>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className="focus:outline-none"
              >
                {user.avatar ? (
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={`data:image/png;base64,${user.avatar?.data}`}
                    alt="Avatar"
                  />
                ) : (
                  <AccountCircleOutlinedIcon sx={{ fontSize: 32 }} />
                )}
              </Button>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ "aria-labelledby": "basic-button" }}
                sx={{ zIndex: 9999 }}
              >
                <MenuItem onClick={handleClose}>
                  <Link to="/user/account" className="text-sky-600">
                    Tài khoản
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link to="/user/purchase" className="text-sky-600">
                    Đơn mua
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <span
                    onClick={handleLogout}
                    className="text-red-500 cursor-pointer"
                  >
                    Đăng xuất
                  </span>
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
