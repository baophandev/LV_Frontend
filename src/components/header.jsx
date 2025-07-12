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
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
      className="bg-blue-50"
    >
      <div className="flex justify-between items-center px-6 py-3 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="Logo"
            className="w-32 hidden md:block"
            style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))" }}
          />
        </Link>

        {/* Ô tìm kiếm */}
        <form
          onSubmit={handleSearchSubmit}
          className="h-12 relative flex items-center bg-white px-4 py-3 rounded-full w-64 sm:w-72 md:w-96 border border-blue-100 shadow-sm transition-all duration-300 hover:shadow-md focus-within:shadow-lg focus-within:border-blue-300"
        >
          <input
            className="flex-grow bg-transparent outline-none text-sm pr-2 placeholder-gray-400"
            spellCheck="false"
            placeholder={isListening ? "Đang nghe..." : "Tìm kiếm sản phẩm..."}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="mr-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Xóa tìm kiếm"
            >
              ×
            </button>
          )}

          {isSupported && (
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`mr-3 p-1 rounded-full transition-all duration-200 ${
                isListening
                  ? "bg-red-500 text-white animate-pulse shadow-lg"
                  : "text-blue-600 hover:bg-emerald-50 hover:text-blue-700"
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

          <button
            type="submit"
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors shadow-md"
          >
            <SearchIcon fontSize="small" />
          </button>
        </form>

        {/* Các action */}
        <div className="flex items-center gap-5">
          {/* Giỏ hàng */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 text-blue-800 hover:text-blue-600 transition-colors"
          >
            <div className="p-2 rounded-full hover:bg-emerald-50 transition-colors">
              <ShoppingCartOutlinedIcon
                fontSize="medium"
                style={{ color: ThemeColor.DARK_GREEN }}
              />
            </div>
            <span className="absolute top-0 right-0 text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow transform -translate-y-1 translate-x-1">
              {count || 0}
            </span>
          </Link>

          {/* Người dùng */}
          {Object.keys(user).length === 0 ? (
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-blue-700 text-white px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
            >
              <LoginIcon fontSize="small" />
              <span className="hidden sm:inline">Đăng nhập</span>
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
                  <div className="border-2 border-blue-500 rounded-full p-0.5">
                    <img
                      className="w-9 h-9 rounded-full object-cover shadow"
                      src={`data:image/png;base64,${user.avatar?.data}`}
                      alt="Avatar"
                    />
                  </div>
                ) : (
                  <div className="p-2 rounded-full bg-emerald-100 text-blue-700">
                    <AccountCircleOutlinedIcon sx={{ fontSize: 28 }} />
                  </div>
                )}
              </Button>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ "aria-labelledby": "basic-button" }}
                sx={{
                  zIndex: 9999,
                  "& .MuiPaper-root": {
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    marginTop: "8px",
                    minWidth: "200px",
                  },
                }}
              >
                <MenuItem onClick={handleClose} className="hover:bg-emerald-50">
                  <Link to="/user/account" className="text-blue-700 flex-1">
                    Tài khoản
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose} className="hover:bg-emerald-50">
                  <Link to="/user/purchase" className="text-blue-700 flex-1">
                    Đơn mua
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose} className="hover:bg-red-50">
                  <span
                    onClick={handleLogout}
                    className="text-red-500 cursor-pointer flex-1"
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
