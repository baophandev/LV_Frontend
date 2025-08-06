import Not from "../assets/404.png";
import Footer from "../components/Footer";
import Header from "../components/header";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      <Header></Header>
      <div className="flex flex-col justify-center items-center mt-20 px-4">
        <div className="text-center">
          <img
            src={Not}
            alt="404 Error"
            className="w-80 sm:w-96 mx-auto mb-8"
          />
          <div className="mb-6">
            <span className="text-6xl mb-4 block">🐾</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-orange-700 mb-2">
              Oops! Trang không tồn tại
            </h1>
            <p className="text-gray-600 mb-6">
              Có vẻ như thú cưng của chúng tôi đã giấu trang này đi mất rồi! 🐱
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              🏠 Về trang chủ
            </Link>
            <Link
              to="/category"
              className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              🛍️ Mua sắm ngay
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default NotFound;
