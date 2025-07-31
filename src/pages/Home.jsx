import { useDispatch, useSelector } from "react-redux";
import ProductCart from "../components/ProductCart";
import { useEffect, useState } from "react";
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
import Banner from "../assets/banner.png";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import FloatingChatBot from "../components/FloatingChatBot";
import { getProductRecommendations } from "../api/recomendation";
import { getProductDiscountedApi } from "../api/productApi";
import CountdownTimer from "../components/CountdownTimer"; 
import { Link } from "react-router-dom";

export const Home = () => {
  const dispatch = useDispatch();
  const categorys = useSelector((state) => state.categorys.categorys);
  const products = useSelector(
    (state) => state.product.products?.content || []
  );
  // const productDiscounteds = useSelector(
  //   (state) => state.product.discountedProducts?.content || []
  // );
  const totalPages = useSelector((state) => state.product.page.totalPages);
  const currentPage = useSelector((state) => state.product.page.currentPage);
  const user = useSelector((state) => state.user.user);
  const userId = user.id;

  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);

  const [filter, setFilter] = useState({});

  const [recmdProducts, setRecmdProducts] = useState([]);
  const [productDiscounteds, setProductDiscounteds] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts({ pageNumber: currentPage, pageSize: 20 }));
  }, [dispatch, currentPage]);

  // useEffect(() => {
  //   dispatch(fecthProductDiscounteds());
  // }, [dispatch]);

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
        const response = await getProductDiscountedApi({pageNumber: 0, pageSize: 10});
        setProductDiscounteds(response.content)
      }catch(err){
        console.error("Error fetching discounted products:", err);
      }
    }
    fecthProductDiscounteds();
  }, [])

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
    dispatch(
      fecthProductFilter({
        categoryId: filter.categoryId,
        sortDirection: filter.sortDirection,
      })
    );
  };

  if (status === "loading") return <Loading></Loading>;
  if (status === "failed")
    return (
      // <div className="flex items-center justify-center text-red-700">
      //   Đã có lỗi xảy ra
      // </div>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  return (
    <>
      <div className="w-full relative">
        <div className="bg-white flex flex-wrap items-center justify-center gap-20 w-full mx-auto p-4 rounded-md shadow">
          {categorys?.map((category, index) => (
            <Link to={`/category/${category.id}`} key={index} className="flex items-center">
              <img
                key={index}
                className="w-12 h-12 object-contain rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200"
                src={`data:image/png;base64,${category.categoryImages[0]?.data}`}
                alt={category?.name || "Ảnh sản phẩm"}
                // onClick={handleClickOpen}
              />
            </Link>
          ))}
        </div>
        <div
          className="w-full h-80"
          style={{
            backgroundImage: `url(${Banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div className="w-full h-11 "></div>
        <div className="w-3/4 flex items-center mb-5 bg-gradient-to-r from-teal-600  via-blue-600 to-teal-600 p-3 gap-3 absolute bottom-1 shadow-sm rounded-md left-1/2 transform -translate-x-1/2">
          <select
            onChange={(e) => {
              handleChange("categoryId", e.target.value);
            }}
            className="border w-52 px-3 py-1 rounded-md"
            name=""
            id=""
          >
            <option value="">Tất cả sản phẩm</option>
            {categorys?.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}{" "}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 ">
            <div
              className={`border py-1 px-2 rounded-md text-sm cursor-pointer bg-white ${
                filter.sortDirection === "DESC" ? "text-sky-500" : ""
              }`}
              onClick={() => handleChange("sortDirection", "DESC")}
            >
              <ArrowDownwardOutlinedIcon></ArrowDownwardOutlinedIcon> Giá cao -
              thấp
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`border py-1 px-2 rounded-md text-sm cursor-pointer bg-white ${
                filter.sortDirection === "ASC" ? "text-sky-500" : ""
              }`}
              onClick={() => handleChange("sortDirection", "ASC")}
            >
              <ArrowUpwardOutlinedIcon></ArrowUpwardOutlinedIcon> Giá thấp - cao
            </div>
          </div>
          <div
            className="cursor-pointer px-3 py-1 rounded-md text-blue-500 bg-white font-semibold"
            onClick={handleFilter}
          >
            <FilterAltOutlinedIcon></FilterAltOutlinedIcon>Lọc sản phẩm
          </div>
        </div>
      </div>
      <>
        <div className="w-full sm:w-3/4 flex justify-start mb-3">
          <CountdownTimer initialMinutes={180} /> {/* bắt đầu với 3 giờ */}
        </div>
        <div className="w-full sm:w-3/4">
          {/* <Carousel images={adImages}></Carousel> */}
          <div
            className="w-full flex gap-2 items-center justify-start shadow-sm bg-blue-100 rounded-xl p-3 overflow-x-auto whitespace-nowrapscrollbar-thin scrollbar-thumb-slate-400
      scrollbar-track-transparent"
          >
            {productDiscounteds?.map((product) => (
              <div key={product.id} className="">
                <ProductCart
                  id={product.id}
                  image={product.productAvatar.data}
                  name={product.name}
                  price={product.firstVariantPrice || 0}
                  discountDisplayed={product.discountDisplayed}
                  category={product.category.name}
                />
              </div>
            ))}
          </div>
        </div>
      </>
      {userId && (
        <>
          <div className="uppercase text-2xl font-extrabold p-3 text-slate-700 w-full sm:w-3/4">
            <div className="">DÀNH CHO BẠN</div>
          </div>

          <div className="w-full sm:w-3/4">
            {/* <Carousel images={adImages}></Carousel> */}
            <div
              className="w-full flex gap-2 items-center justify-start bg-blue-100 rounded-xl p-3 overflow-x-auto whitespace-nowrapscrollbar-thin scrollbar-thumb-slate-400
      scrollbar-track-transparent"
            >
              {recmdProducts?.map((product) => (
                <div key={product.id} className="">
                  <ProductCart
                    id={product.id}
                    image={product.productAvatar.data}
                    name={product.name}
                    price={product.firstVariantPrice || 0}
                    discountDisplayed={product.discountDisplayed}
                    category={product.category.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="uppercase text-2xl font-extrabold p-3 text-slate-700 w-full sm:w-3/4">
        <div className="">SẢN PHẨM HÀNG ĐẦU</div>
      </div>

      <div className="w-full sm:w-3/4 px-4">
        <div
          className="grid gap-8 mx-auto"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            maxWidth: "1400px", // ✅ giới hạn chiều rộng để Grid không bị dàn quá rộng
          }}
        >
          {products?.map((product) => (
            <ProductCart
              key={product.id}
              id={product.id}
              image={product.productAvatar.data}
              name={product.name}
              price={product.firstVariantPrice || 0}
              discountDisplayed={product.discountDisplayed}
              category={product.category.name}
            />
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            variant="outlined"
            color="primary"
            page={currentPage + 1}
            onChange={(event, value) => handlePageClick(value)}
          />
        </div>
      </div>

      <FloatingChatBot />
    </>
  );
};
