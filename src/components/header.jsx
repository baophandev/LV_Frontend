import Logo from "../assets/Logo.png";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { fetchCategorys } from "../redux/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import ThemeColor from "../constant/theme";
import { getMyInfo, getUserAddress, logout } from "../redux/slices/userSlice";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LoginIcon from "@mui/icons-material/Login";
import { fetchCart } from "../redux/slices/cartSlice";
import useVoiceSearch from "../hooks/useVoiceSearch";
import { searchProductApi } from "../api/productApi";
import _ from "lodash";
import { styled } from "@mui/system";

// Custom styled components
const GlassMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.18)",
    marginTop: "8px",
    minWidth: "220px",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    color: "#333",
  },
  "& .MuiMenuItem-root": {
    padding: "12px 20px",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(200, 220, 255, 0.25)",
    },
  },
}));

const Header = () => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.categorys.status);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.user.user);
  const { count } = useSelector((state) => state.cart);
  const userId = user.id;
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

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
      debouncedSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    resetTranscript();
    setShowResults(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const debouncedSearch = React.useRef(
    _.debounce(async (query) => {
      try {
        if (query.trim()) {
          const data = await searchProductApi({ name: query });
          setSearchResults(data || []);
          setShowResults(true);
        } else {
          setSearchResults([]);
          setShowResults(false);
        }
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
      }
    }, 400)
  ).current;

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "rgba(255, 255, 255, 0.72)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.7)",
      }}
    >
      <div className="flex justify-between items-center px-8 py-3 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="Logo"
            className="w-32 hidden md:block transition-all duration-300 hover:opacity-90"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
          />
        </Link>

        {/* Search Section */}
        <div className="relative flex-grow max-w-2xl mx-8" ref={searchRef}>
          <form
            onSubmit={handleSearchSubmit}
            className="h-14 relative flex items-center bg-white/90 px-5 py-3 rounded-xl w-full border border-white shadow-lg transition-all duration-300 focus-within:border-blue-300 focus-within:shadow-xl"
            style={{
              boxShadow: "0 6px 20px rgba(100, 130, 255, 0.15)",
            }}
          >
            <input
              className="flex-grow bg-transparent outline-none text-gray-800 placeholder-gray-500 pr-2 text-base"
              spellCheck="false"
              placeholder={
                isListening ? "Đang nghe..." : "Tìm kiếm điện thoại cao cấp..."
              }
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="mr-3 text-gray-500 hover:text-gray-800 transition-colors text-xl"
                title="Xóa tìm kiếm"
              >
                ×
              </button>
            )}

            {isSupported && (
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`mr-4 p-2 rounded-full transition-all duration-200 ${
                  isListening
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white animate-pulse"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                title={
                  isListening
                    ? "Đang nghe... (Click để dừng)"
                    : "Tìm kiếm bằng giọng nói"
                }
              >
                {isListening ? (
                  <MicOffIcon fontSize="medium" />
                ) : (
                  <MicIcon fontSize="medium" />
                )}
              </button>
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 rounded-xl text-white transition-all shadow-md flex items-center justify-center"
              style={{
                boxShadow: "0 4px 12px rgba(80, 100, 255, 0.3)",
              }}
            >
              <SearchIcon fontSize="medium" />
            </button>
          </form>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div
              className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-xl border border-white rounded-xl shadow-2xl z-50 max-h-80 overflow-auto"
              style={{
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
              }}
            >
              <div className="py-2">
                {searchResults.map((item) => (
                  <Link
                    to={`/product/${item.id}`}
                    key={item.id}
                    className="flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50/60 transition-all border-b border-gray-100 last:border-0"
                    onClick={() => {
                      setShowResults(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="bg-gray-100 border rounded-lg w-12 h-12 mr-4 flex items-center justify-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded w-10 h-10" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-blue-600 font-medium text-sm mt-1">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          <Link to="/cart" className="relative flex items-center gap-2 group">
            <div
              className="p-2.5 rounded-xl bg-white/90 backdrop-blur border border-white shadow-sm hover:shadow transition-all"
              style={{
                boxShadow: "0 4px 12px rgba(100, 120, 255, 0.1)",
              }}
            >
              <ShoppingCartOutlinedIcon
                fontSize="medium"
                className="text-gray-700 group-hover:text-blue-600 transition-colors"
              />
            </div>
            <span
              className="absolute -top-1.5 -right-1.5 text-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md transform"
              style={{
                boxShadow: "0 2px 6px rgba(80, 100, 255, 0.3)",
              }}
            >
              {count || 0}
            </span>
          </Link>

          {/* User */}
          {Object.keys(user).length === 0 ? (
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
              style={{
                boxShadow: "0 4px 12px rgba(80, 100, 255, 0.3)",
              }}
            >
              <LoginIcon fontSize="small" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </Link>
          ) : (
            <>
              <Button
                id="glass-menu-button"
                aria-controls={open ? "glass-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className="focus:outline-none"
              >
                {user.avatar ? (
                  <div
                    className="border border-white rounded-xl p-0.5 bg-white/80 backdrop-blur shadow-sm"
                    style={{
                      boxShadow: "0 4px 10px rgba(100, 120, 255, 0.15)",
                    }}
                  >
                    <img
                      className="w-10 h-10 rounded-lg object-cover"
                      src={`data:image/png;base64,${user.avatar?.data}`}
                      alt="Avatar"
                    />
                  </div>
                ) : (
                  <div
                    className="p-2.5 rounded-xl bg-white/80 backdrop-blur border border-white shadow-sm"
                    style={{
                      boxShadow: "0 4px 10px rgba(100, 120, 255, 0.15)",
                    }}
                  >
                    <AccountCircleOutlinedIcon
                      sx={{ fontSize: 30 }}
                      className="text-blue-600"
                    />
                  </div>
                )}
              </Button>

              <GlassMenu
                id="glass-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ "aria-labelledby": "glass-menu-button" }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    to="/user/account"
                    className="text-gray-700 hover:text-blue-600 flex items-center gap-3 w-full"
                  >
                    <AccountCircleOutlinedIcon fontSize="small" />
                    Tài khoản
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link
                    to="/user/purchase"
                    className="text-gray-700 hover:text-blue-600 flex items-center gap-3 w-full"
                  >
                    <ShoppingCartOutlinedIcon fontSize="small" />
                    Đơn mua
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <div
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 cursor-pointer flex items-center gap-3 w-full"
                  >
                    <LoginIcon fontSize="small" className="rotate-180" />
                    Đăng xuất
                  </div>
                </MenuItem>
              </GlassMenu>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
