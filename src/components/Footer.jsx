import Logo from "../assets/Logo.png";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import { Link } from "react-router";
import CopyrightOutlinedIcon from "@mui/icons-material/CopyrightOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import { fetchCategorys } from "../redux/slices/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Footer = () => {
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
    <>
      <div className="flex justify-evenly p-8 border-t border-t-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 mt-3">
        <div className="flex flex-col gap-2">
          <img src={Logo} alt="Pet Store Logo" className="w-32" />
          <div className="text-gray-600">
            🐾 <strong>PET STORE</strong> - Cửa hàng thú cưng cao cấp <br />
            hàng đầu Việt Nam
            <br />
            <span className="text-gray-500">
              📍 2/47/19 An Hòa, Ninh Kiều, TP. Cần Thơ
            </span>
            <br />
            <span className="text-gray-500">
              📞 Hotline: 1900-PETS (7387) | 🕒 8:00 - 20:00
            </span>
          </div>
          <div className="flex gap-3">
            <Link className="hover:scale-110 transition-transform">
              <FacebookOutlinedIcon
                sx={{
                  color: "#fb7185",
                  fontSize: 28,
                }}
              ></FacebookOutlinedIcon>
            </Link>
            <Link className="hover:scale-110 transition-transform">
              <InstagramIcon
                sx={{
                  color: "#fb7185",
                  fontSize: 28,
                }}
              ></InstagramIcon>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-orange-600 font-semibold text-lg">
            🏷️ Danh mục sản phẩm
          </div>
          {categorys?.map((category) => (
            <Link
              key={category.id}
              className="text-gray-600 hover:text-orange-600 transition-colors duration-200 flex items-center gap-2"
              to={`/category/${category.id}`}
            >
              🐾 {category.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-orange-600 font-semibold text-lg">
            🛡️ Dịch vụ chăm sóc
          </div>
          <Link className="text-gray-600 hover:text-orange-600 transition-colors duration-200 flex items-center gap-2">
            🏥 Khám sức khỏe thú cưng
          </Link>
          <Link className="text-gray-600 hover:text-orange-600 transition-colors duration-200 flex items-center gap-2">
            ✂️ Cắt tỉa lông
          </Link>
          <Link className="text-gray-600 hover:text-orange-600 transition-colors duration-200 flex items-center gap-2">
            🛁 Tắm gội spa
          </Link>
          <Link className="text-gray-600 hover:text-orange-600 transition-colors duration-200 flex items-center gap-2">
            🎓 Huấn luyện thú cưng
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          <div className="text-orange-600 font-semibold text-lg">
            📞 Hỗ trợ khách hàng
          </div>
          <Link className="text-gray-600 hover:text-orange-600 transition-colors duration-200 flex items-center gap-2">
            💬 Tư vấn miễn phí
          </Link>
          <Link className="text-gray-600 hover:text-orange-600 transition-colors duration-200 flex items-center gap-2">
            🚚 Chính sách giao hàng
          </Link>
          <Link className="text-gray-600 hover:text-orange-600 transition-colors duration-200 flex items-center gap-2">
            🔄 Đổi trả sản phẩm
          </Link>
          <Link className="text-gray-600 hover:text-orange-600 transition-colors duration-200 flex items-center gap-2">
            🏆 Chế độ bảo hành
          </Link>
        </div>
      </div>
      <div className="flex h-20 justify-center text-gray-600 py-4 items-center border-t border-t-orange-200 bg-orange-50">
        <div className="flex items-center gap-2">
          <CopyrightOutlinedIcon fontSize="small"></CopyrightOutlinedIcon>
          <span>2025 🐾 Pet Store</span>
        </div>
      </div>
    </>
  );
};

export default Footer;
