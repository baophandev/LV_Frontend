import Not from "../assets/404.png"
import Footer from "../components/Footer";
import Header from "../components/header";
import ThemeColor from "../constant/theme";
import { Link } from "react-router-dom";


const NotFound = () => {
    return (
      <>
        <Header></Header>
        <div className="flex justify-center items-center mt-32">
          <img src={Not} alt="" className="w-96" />
        </div>
        <div className="flex justify-center items-center text-bold mb-10 text-white">
          TRANG KHÔNG TỒN TẠI !! Quay lại
          <Link
            to="/"
            className="ml-1 underline"
            style={{ color: ThemeColor.MAIN_GREEN }}
          >
            Trang chủ
          </Link>
        </div>
        <Footer></Footer>
      </>
    );
}
 
export default NotFound;