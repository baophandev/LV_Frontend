import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCart from "../components/ProductCart";
import {
  fecthProductFilter,
  fetchProducts,
  setPage,
} from "../redux/slices/productSlice";
import Loading from "../components/Loading";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Pagination from "@mui/material/Pagination";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import FloatingChatBot from "../components/FloatingChatBot";
import { getProductRecommendations } from "../api/recomendation";
import {
  getCurrentBannerApi,
  getProductDiscountedApi,
} from "../api/productApi";
import CountdownTimer from "../components/CountdownTimer";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

export const Home = () => {
  const dispatch = useDispatch();
  const categorys = useSelector((state) => state.categorys.categorys);
  const products = useSelector(
    (state) => state.product.products?.content || []
  );
  const totalPages = useSelector((state) => state.product.page.totalPages);
  const currentPage = useSelector((state) => state.product.page.currentPage);
  const user = useSelector((state) => state.user.user);
  const userId = user.id;

  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);

  const [filter, setFilter] = useState({});
  const [recmdProducts, setRecmdProducts] = useState([]);
  const [productDiscounteds, setProductDiscounteds] = useState([]);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ pageNumber: currentPage, pageSize: 20 }));
  }, [dispatch, currentPage]);

  useEffect(() => {
    const fetchRecmdProducts = async () => {
      if (!userId) return;

      try {
        const response = await getProductRecommendations({ userId });
        setRecmdProducts(response);
      } catch (err) {
        console.error("Recommendation error:", err);
      }
    };

    fetchRecmdProducts();
  }, [userId]);

  useEffect(() => {
    const fecthProductDiscounteds = async () => {
      try {
        const response = await getProductDiscountedApi({
          pageNumber: 0,
          pageSize: 10,
        });
        setProductDiscounteds(response.content);
      } catch (err) {
        console.error("Error fetching discounted products:", err);
      }
    };
    fecthProductDiscounteds();
  }, []);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getCurrentBannerApi();
        setBanner(data);
      } catch (err) {
        console.error("Error fetching banner:", err);
      }
    };

    fetchBanner();
  }, []);

  const handlePageClick = (page) => {
    dispatch(setPage(page - 1));
  };

  const handleChange = (field, value) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFilter = () => {
    const params = new URLSearchParams();

    if (filter.categoryId) {
      params.append("categoryId", filter.categoryId);
    }

    if (filter.sortDirection) {
      params.append("sortDirection", filter.sortDirection);
    }

    params.append("status", "ACTIVE"); // nếu bạn luôn muốn gửi status

    window.location = `/product/filter?${params.toString()}`;
  };

  if (status === "loading") return <Loading></Loading>;
  if (status === "failed")
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Luxury Category Carousel */}
      <div className="py-10 px-8 bg-white">
        <div className="flex justify-center gap-7">
          {categorys?.map((category) => (
            <Link
              to={`/category/${category.id}`}
              className="flex flex-col items-center group"
            >
              <div className="bg-gray-100 rounded-full p-3 group-hover:bg-gray-200 transition-all duration-300">
                <img
                  className="w-16 h-16 object-cover rounded-full"
                  src={`data:image/png;base64,${category.categoryImages[0]?.data}`}
                  alt={category?.name}
                />
              </div>
              <span className="mt-3 text-sm font-medium text-gray-700 group-hover:text-black text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Luxury Banner */}
      <div className="relative h-[80vh] overflow-hidden">
        {banner?.bannerImage?.data ? (
          <div className="absolute inset-0">
            <img
              src={`data:image/${banner.bannerImage.imageType};base64,${banner.bannerImage.data}`}
              alt="Luxury Banner"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black flex items-center justify-center">
            <span className="text-white text-xl font-light tracking-widest">
              PREMIUM COLLECTION
            </span>
          </div>
        )}
        {/* <div className="relative z-10 flex flex-col justify-center h-full px-16 max-w-3xl">
          <motion.h2
            className="text-5xl font-serif font-light text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Timeless Elegance
          </motion.h2>
          <motion.p
            className="text-xl text-gray-200 mb-8 font-light max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover our exclusive collection crafted with precision and passion
          </motion.p>
          <motion.button
            className="bg-transparent border border-white text-white px-8 py-3 w-48 font-light tracking-wide hover:bg-white hover:text-black transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            EXPLORE
          </motion.button>
        </div> */}
      </div>

      {/* Luxury Filter */}
      <div className="bg-gray-800 py-8 px-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h3 className="text-white text-xl font-light tracking-wider">
            LỌC SẢN PHẨM
          </h3>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <select
                onChange={(e) => handleChange("categoryId", e.target.value)}
                className="bg-transparent border-b border-gray-500 text-white px-4 py-2 appearance-none focus:outline-none focus:border-white transition-all w-52"
              >
                <option value="" className="bg-gray-800">
                  Tất cả danh mục
                </option>
                {categorys?.map((category) => (
                  <option
                    value={category.id}
                    key={category.id}
                    className="bg-gray-800"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                className={`px-4 py-2 text-sm font-light tracking-wide ${
                  filter.sortDirection === "DESC"
                    ? "bg-white text-black"
                    : "text-gray-300 hover:text-white"
                } transition-all`}
                onClick={() => handleChange("sortDirection", "DESC")}
              >
                <ArrowDownwardOutlinedIcon className="mr-1" /> Giá cao - thấp
              </button>
              <button
                className={`px-4 py-2 text-sm font-light tracking-wide ${
                  filter.sortDirection === "ASC"
                    ? "bg-white text-black"
                    : "text-gray-300 hover:text-white"
                } transition-all`}
                onClick={() => handleChange("sortDirection", "ASC")}
              >
                <ArrowUpwardOutlinedIcon className="mr-1" /> Giá thấp - cao
              </button>
            </div>

            <button
              className="flex items-center gap-2 text-black bg-white px-6 py-2 font-light tracking-wide hover:bg-gray-200 transition-all"
              onClick={handleFilter}
            >
              <FilterAltOutlinedIcon /> Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Premium Promotion Section */}
      <section className="py-16 px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gray-200 pb-6">
            <div>
              <h2 className="text-3xl font-sans font-light text-gray-900 mb-2">
                Ưu đãi độc quyền
              </h2>
              <p className="text-gray-600 font-light">
                Khuyến mãi đặc biệt trong thời gian có hạn
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <CountdownTimer initialMinutes={180} />
            </div>
          </div>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={4}
            autoplay={{ delay: 4000 }}
            loop={true}
            className="mySwiper"
          >
            {productDiscounteds?.map((product) => (
              <SwiperSlide key={product.id}>
                <motion.div
                  className=" overflow-hidden"
                  transition={{ duration: 0.3 }}
                >
                  <ProductCart
                    id={product.id}
                    image={product.productAvatar.data}
                    name={product.name}
                    price={product.firstVariantPrice || 0}
                    discountDisplayed={product.discountDisplayed}
                    category={product.category.name}
                    premiumStyle={true}
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Personalized Recommendations */}
      {userId && recmdProducts.length > 0 && (
        <section className="py-16 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-sans font-light text-gray-900 mb-2">
                Gợi ý dành riêng cho bạn
              </h2>
              <p className="text-gray-600 font-light max-w-2xl mx-auto">
                Dựa trên sở thích và lịch sử mua sắm của bạn, chúng tôi đã chọn
                lọc những sản phẩm phù hợp nhất
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {recmdProducts?.map((product) => (
                <ProductCart
                  id={product.id}
                  image={product.productAvatar.data}
                  name={product.name}
                  price={product.firstVariantPrice || 0}
                  discountDisplayed={product.discountDisplayed}
                  category={product.category.name}
                  premiumStyle={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      <div className="bg-slate-200 text-black py-20 px-8 text-center">
        <h3 className="text-3xl font-serif font-light  mb-6">
          Bảo hành 12 tháng - 1 đổi 1 trong vòng 30 ngày
        </h3>
      </div>
      {/* Signature Collection */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-sans font-light text-gray-900 mb-4">
              Sản phẩm hàng đầu
            </h2>
            <div className="w-24 h-px bg-gray-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.map((product, index) => (
              <ProductCart
                id={product.id}
                image={product.productAvatar.data}
                name={product.name}
                price={product.firstVariantPrice || 0}
                discountDisplayed={product.discountDisplayed}
                category={product.category.name}
                premiumStyle={true}
              />
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Pagination
              count={totalPages}
              variant="outlined"
              shape="rounded"
              color="primary"
              size="large"
              page={currentPage + 1}
              onChange={(event, value) => handlePageClick(value)}
              className="border-gray-300"
            />
          </div>
        </div>
      </section>

      {/* Luxury Footer Banner */}
      {userId ? (
        ""
      ) : (
        <div className="bg-slate-200 text-black py-20 px-8 text-center">
          <h3 className="text-3xl font-serif font-light  mb-6">
            Trở thành thành viên của chúng tôi
          </h3>
          <p className=" max-w-2xl mx-auto mb-8 font-light">
            Tham gia cộng đồng yêu thích hàng hiệu và nhận những ưu đãi độc
            quyền, tin tức mới nhất và nhiều hơn nữa. Chúng tôi cam kết mang đến
            cho bạn những trải nghiệm mua sắm tốt nhất.
          </p>
          <Link
            to={"/login"}
            className=" border  bg-black text-white border-black px-10 py-3 font-light tracking-wider transition-all duration-300"
          >
            ĐĂNG KÝ NGAY
          </Link>
        </div>
      )}

      <FloatingChatBot />
    </div>
  );
};
