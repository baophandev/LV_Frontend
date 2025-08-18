import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCart from "../components/ProductCart";
import {
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
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "../styles/responsive.css";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    setIsFilterOpen(false);
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
      {/* Mobile Filter Button - Only for very small screens */}
      <div className="sm:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-full shadow-lg text-sm"
        >
          <FilterAltOutlinedIcon className="w-4 h-4" />
          <span>Lọc</span>
        </button>
      </div>

      {/* Mobile Filter Panel - Only for very small screens */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-end sm:hidden">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="bg-white w-full rounded-t-2xl p-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Bộ lọc</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500 text-xl p-1"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm">
                  Danh mục
                </label>
                <select
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Tất cả danh mục</option>
                  {categorys?.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 text-sm">
                  Sắp xếp
                </label>
                <div className="flex flex-col space-y-2">
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      filter.sortDirection === "DESC"
                        ? "bg-black text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() => handleChange("sortDirection", "DESC")}
                  >
                    <div className="flex items-center">
                      <ArrowDownwardOutlinedIcon className="mr-2 w-4 h-4" />
                      Giá cao - thấp
                    </div>
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      filter.sortDirection === "ASC"
                        ? "bg-black text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() => handleChange("sortDirection", "ASC")}
                  >
                    <div className="flex items-center">
                      <ArrowUpwardOutlinedIcon className="mr-2 w-4 h-4" />
                      Giá thấp - cao
                    </div>
                  </button>
                </div>
              </div>

              <button
                className="w-full bg-black text-white py-2 rounded-lg font-medium text-sm"
                onClick={handleFilter}
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Luxury Category Carousel */}
      <div className="py-4 sm:py-6 md:py-10 px-3 sm:px-4 md:px-8 bg-white">
        <div className="flex overflow-x-auto pb-4 space-x-3 sm:space-x-4 md:space-x-7 md:justify-center hide-scrollbar">
          {categorys?.map((category) => (
            <Link
              to={`/category/${category.id}`}
              className="flex flex-col items-center group min-w-[70px] sm:min-w-[80px]"
              key={category.id}
            >
              <div className="bg-gray-100 rounded-full p-1.5 sm:p-2 md:p-3 group-hover:bg-gray-200 transition-all duration-300">
                <img
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-cover rounded-full"
                  src={`data:image/png;base64,${category.categoryImages[0]?.data}`}
                  alt={category?.name}
                />
              </div>
              <span className="mt-1.5 sm:mt-2 md:mt-3 text-xs sm:text-sm font-medium text-gray-700 group-hover:text-black text-center leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Luxury Banner */}
      <div className="relative h-[40vh] sm:h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        {banner?.bannerImage?.data ? (
          <div className="absolute inset-0">
            <img
              src={`data:image/${banner.bannerImage.imageType};base64,${banner.bannerImage.data}`}
              alt="Luxury Banner"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black flex items-center justify-center px-4">
            <span className="text-white text-lg sm:text-xl md:text-2xl font-light tracking-widest text-center">
              PREMIUM COLLECTION
            </span>
          </div>
        )}
      </div>

      {/* Luxury Filter - Desktop */}
      <div className="bg-gray-800 py-3 sm:py-4 md:py-8 px-3 sm:px-4 md:px-16">
        <div className="max-w-7xl mx-auto lg:flex justify-between items-center hidden">
          <h3 className="text-white text-base sm:text-lg md:text-xl font-light tracking-wider">
            LỌC SẢN PHẨM
          </h3>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 md:space-x-6">
            <div className="relative">
              <select
                onChange={(e) => handleChange("categoryId", e.target.value)}
                className="bg-transparent border-b border-gray-500 text-white px-2 sm:px-4 py-1 sm:py-2 appearance-none focus:outline-none focus:border-white transition-all w-40 sm:w-52 text-sm sm:text-base"
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
                  className="h-4 w-4 sm:h-5 sm:w-5"
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

            <div className="flex space-x-2 sm:space-x-3">
              <button
                className={`px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-xs sm:text-sm font-light tracking-wide ${
                  filter.sortDirection === "DESC"
                    ? "bg-white text-black"
                    : "text-gray-300 hover:text-white"
                } transition-all`}
                onClick={() => handleChange("sortDirection", "DESC")}
              >
                <ArrowDownwardOutlinedIcon className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />{" "}
                Giá cao - thấp
              </button>
              <button
                className={`px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 text-xs sm:text-sm font-light tracking-wide ${
                  filter.sortDirection === "ASC"
                    ? "bg-white text-black"
                    : "text-gray-300 hover:text-white"
                } transition-all`}
                onClick={() => handleChange("sortDirection", "ASC")}
              >
                <ArrowUpwardOutlinedIcon className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />{" "}
                Giá thấp - cao
              </button>
            </div>

            <button
              className="flex items-center gap-1 sm:gap-2 text-black bg-white px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 font-light tracking-wide hover:bg-gray-200 transition-all text-xs sm:text-sm"
              onClick={handleFilter}
            >
              <FilterAltOutlinedIcon className="w-3 h-3 sm:w-4 sm:h-4" /> Lọc
            </button>
          </div>
        </div>

        {/* Mobile/Tablet Filter Bar */}
        <div className="max-w-7xl mx-auto flex lg:hidden justify-between items-center">
          <h3 className="text-white text-sm sm:text-base md:text-lg font-light tracking-wider">
            LỌC SẢN PHẨM
          </h3>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              onChange={(e) => handleChange("categoryId", e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm focus:outline-none focus:border-white transition-all"
            >
              <option value="">Tất cả</option>
              {categorys?.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name.length > 10
                    ? category.name.substring(0, 10) + "..."
                    : category.name}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => handleChange("sortDirection", e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm focus:outline-none focus:border-white transition-all"
            >
              <option value="">Sắp xếp</option>
              <option value="DESC">Giá cao - thấp</option>
              <option value="ASC">Giá thấp - cao</option>
            </select>

            <button
              className="bg-white text-black px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm font-medium hover:bg-gray-200 transition-all"
              onClick={handleFilter}
            >
              Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Premium Promotion Section */}
      <section className="py-6 sm:py-8 md:py-10 lg:py-16 px-3 sm:px-4 md:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 md:mb-12 border-b border-gray-200 pb-3 sm:pb-4 md:pb-6">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-sans font-light text-gray-900 mb-1 md:mb-2">
                Ưu đãi độc quyền
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base font-light">
                Khuyến mãi đặc biệt trong thời gian có hạn
              </p>
            </div>
          </div>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={15}
            slidesPerView={1.2}
            breakpoints={{
              320: {
                slidesPerView: 1.5,
                spaceBetween: 12,
              },
              480: {
                slidesPerView: 1.8,
                spaceBetween: 15,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            autoplay={{ delay: 4000 }}
            loop={true}
            className="mySwiper"
          >
            {productDiscounteds?.map((product) => (
              <SwiperSlide key={product.id}>
                <motion.div
                  className="overflow-hidden"
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
      {userId && recmdProducts.length >= 4 && (
        <section className="py-6 sm:py-8 md:py-10 lg:py-16 px-2 sm:px-3 md:px-4 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8 md:mb-12 text-center">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-sans font-light text-gray-900 mb-1 md:mb-2">
                Gợi ý dành riêng cho bạn
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base font-light max-w-2xl mx-auto px-4">
                Dựa trên sở thích và lịch sử mua sắm của bạn, chúng tôi đã chọn
                lọc những sản phẩm phù hợp nhất
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {recmdProducts?.slice(0, 8).map((product) => (
                <ProductCart
                  key={product.id}
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

      <div className="bg-slate-200 text-black py-8 sm:py-10 md:py-12 lg:py-20 px-3 sm:px-4 md:px-8 text-center">
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-serif font-light mb-2 sm:mb-4 md:mb-6 px-4">
          Bảo hành 12 tháng - 1 đổi 1 trong vòng 30 ngày
        </h3>
      </div>

      {/* Signature Collection */}
      <section className="py-6 sm:py-8 md:py-10 lg:py-16 px-2 sm:px-3 md:px-4 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-10 md:mb-16">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-sans font-light text-gray-900 mb-2 md:mb-4">
              Sản phẩm hàng đầu
            </h2>
            <div className="w-12 sm:w-16 md:w-24 h-px bg-gray-400 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {products?.map((product, index) => (
              <ProductCart
                key={product.id}
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

          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-16 flex justify-center">
            <Pagination
              count={totalPages}
              variant="outlined"
              shape="rounded"
              color="primary"
              size={
                window.innerWidth < 640
                  ? "small"
                  : window.innerWidth < 768
                  ? "medium"
                  : "large"
              }
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
        <div className="bg-slate-200 text-black py-8 sm:py-10 md:py-12 lg:py-20 px-3 sm:px-4 md:px-8 text-center">
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-serif font-light mb-3 sm:mb-4 md:mb-6 px-4">
            Trở thành thành viên của chúng tôi
          </h3>
          <p className="text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 font-light px-4 leading-relaxed">
            Tham gia cộng đồng yêu thích hàng hiệu và nhận những ưu đãi độc
            quyền, tin tức mới nhất và nhiều hơn nữa. Chúng tôi cam kết mang đến
            cho bạn những trải nghiệm mua sắm tốt nhất.
          </p>
          <Link
            to={"/login"}
            className="inline-block border bg-black text-white border-black px-4 py-2 sm:px-6 sm:py-2 md:px-10 md:py-3 text-xs sm:text-sm md:text-base font-light tracking-wider transition-all duration-300 hover:bg-gray-800"
          >
            ĐĂNG KÝ NGAY
          </Link>
        </div>
      )}

      <FloatingChatBot />

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
