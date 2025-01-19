import { useDispatch, useSelector } from "react-redux";
import ProductCart from "../components/ProductCart";
import { useEffect } from "react";
import {
  fetchProductsByCategoryId,
  setPage,
} from "../redux/slices/productSlice";
import Loading from "../components/Loading";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Pagination from "@mui/material/Pagination";
import { useParams } from "react-router";
import ThemeColor from "../constant/theme";
// import Carousel from "../components/Carousel";

export const Category = () => {
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const products = useSelector(
    (state) => state.product.products?.content || []
  );
  const totalPages = useSelector((state) => state.product.page.totalPages);
  const currentPage = useSelector((state) => state.product.page.currentPage);
  const categorys = useSelector((state) => state.categorys.categorys);

  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);

  useEffect(() => {
    dispatch(
      fetchProductsByCategoryId({
        categoryId: categoryId,
        pageNumber: currentPage,
        pageSize: 20,
      })
    );
  }, [dispatch, currentPage, categoryId]);

  const handlePageClick = (page) => {
    dispatch(setPage(page - 1));
  };

  console.log(error);
  console.log(totalPages);

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
    <div className="p-5 w-full sm:w-2/3">
      <div className=" p-5 text-cyan-700 rounded-md mb-4" style={{backgroundColor: ThemeColor.LIGHT_GRAY}}> 
        Danh mục {">"} {" "}
        <span className="">
          {categorys.find((category) => category.id === categoryId)?.name}
        </span>
      </div>
      <div className="w-full flex gap-2 flex-wrap items-center">
        {products?.map((product) => (
          <ProductCart
            key={product.id}
            id={product.id}
            image={product.images[0]?.data}
            name={product.name}
            price={product.variants[0]?.price}
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
  );
};
