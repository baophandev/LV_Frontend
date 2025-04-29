import { useDispatch, useSelector } from "react-redux";
import ProductCart from "../components/ProductCart";
import { useEffect, useState } from "react";
import { fecthProductFilter, fetchProducts, setPage } from "../redux/slices/productSlice";
import Loading from "../components/Loading";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Pagination from "@mui/material/Pagination";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Banner from "../assets/banner.png";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";

export const Home = () => {
  const dispatch = useDispatch();
  const categorys = useSelector((state) => state.categorys.categorys);
  const products = useSelector(
    (state) => state.product.products?.content || []
  );
  const totalPages = useSelector((state) => state.product.page.totalPages);
  const currentPage = useSelector((state) => state.product.page.currentPage);

  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);

  const [filter, setFilter] = useState({})

  useEffect(() => {
    dispatch(fetchProducts({ pageNumber: currentPage, pageSize: 20 }));
  }, [dispatch, currentPage]);

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
      fecthProductFilter({ categoryId: filter.categoryId, sortDirection : filter.sortDirection})
    );
  }

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
        <div className="w-3/4 flex items-center mb-5 bg-white p-3 gap-3 absolute bottom-1 shadow-sm rounded-md left-1/2 transform -translate-x-1/2">
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
          <div className="flex items-center gap-2">
            <div
              className={`border py-1 px-2 rounded-md text-sm cursor-pointer ${
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
              className={`border py-1 px-2 rounded-md text-sm cursor-pointer ${
                filter.sortDirection === "ASC" ? "text-sky-500" : ""
              }`}
              onClick={() => handleChange("sortDirection", "ASC")}
            >
              <ArrowUpwardOutlinedIcon></ArrowUpwardOutlinedIcon> Giá thấp - cao
            </div>
          </div>
          <div
            className="cursor-pointer px-3 py-1 rounded-md bg-sky-500 text-white font-semibold"
            onClick={handleFilter}
          >
            <FilterAltOutlinedIcon></FilterAltOutlinedIcon>Lọc sản phẩm
          </div>
        </div>
      </div>
      <div className=" w-full sm:w-3/4">
        {/* <Carousel images={adImages}></Carousel> */}
        <div className="w-full flex flex-wrap gap-2 items-center">
          {products?.map((product) => (
            <ProductCart
              key={product.id}
              id={product.id}
              image={product.productAvatar.data}
              name={product.name}
              price={product.firstVariantPrice || 0}
              discountDisplayed={product.discountDisplayed}
            ></ProductCart>
          ))}
        </div>
        <div className="flex justify-center">
          <Pagination
            count={totalPages}
            variant="outlined"
            color="primary"
            page={currentPage + 1}
            onChange={(event, value) => handlePageClick(value)}
          />
        </div>
      </div>
    </>
  );
};
