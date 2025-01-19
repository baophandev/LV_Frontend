import Logo from "../assets/Logo.png";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import { Link } from "react-router";
import ThemeColor from "../constant/theme";
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
    if(status === 'idle'){
      dispatch(fetchCategorys());
      
    }
  }, [status, dispatch]);

  console.log(error);

  return (
    <>
      <div className="flex justify-evenly p-8 border-t border-t-slate-200">
        <div className="flex flex-col gap-2">
          <img src={Logo} alt="Logo" className="w-32" />
          <div className="text-gray-400">
            Comfoty nhà cung cấp nội thất <br />
            hàng đầu Việt Nam
            <br />
            <span className="text-gray-400">
              2/47/19 An Hòa, Ninh Kiều, TP. Cần Thơ
            </span>
          </div>
          <div className="flex gap-3">
            <Link>
              <FacebookOutlinedIcon
                sx={{
                  color: ThemeColor.DARK_GREEN,
                }}
              ></FacebookOutlinedIcon>
            </Link>
            <Link>
              <InstagramIcon
                sx={{
                  color: ThemeColor.DARK_GREEN,
                }}
              ></InstagramIcon>
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-gray-500">Danh mục sản phẩm</div>
          {categorys?.map((category) => (
            <Link className="" to={`/category/${category.name}`}>
              {category.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="text-gray-500">Hỗ trợ</div>
          <Link className="">
            Hỗ trợ <br />
            Giúp đở
          </Link>
        </div>
      </div>
      <div className="flex h-16 justify-center text-gray-500 py-1 items-center border-t border-t-slate-200">
        <CopyrightOutlinedIcon fontSize="small"></CopyrightOutlinedIcon>
        2025 - Designed & Develop by <span className="font-medium ml-2 text-black">Phan Gia Bảo B2110114</span>
      </div>
    </>
  );
};

export default Footer;
