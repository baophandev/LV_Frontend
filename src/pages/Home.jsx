import { useDispatch, useSelector } from "react-redux";
import ProductCart from "../components/ProductCart";
import { useEffect } from "react";
import { fetchProducts, setPage } from "../redux/slices/productSlice";
import Loading from "../components/Loading";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Pagination from "@mui/material/Pagination";
// import Carousel from "../components/Carousel";

export const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector(
    (state) => state.product.products?.content || []
  );
  const totalPages = useSelector((state) => state.product.page.totalPages);
  const currentPage = useSelector((state) => state.product.page.currentPage);

  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);

  useEffect(() => {
    dispatch(fetchProducts({ pageNumber: currentPage, pageSize: 20 }));
  }, [dispatch, currentPage]);

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
    <div className="p-5 w-full sm:w-3/4">
      {/* <Carousel images={adImages}></Carousel> */}
      <div className="w-full flex flex-wrap gap-2 items-center">
        {products?.map((product) => (
          <ProductCart
            key={product.id}
            id={product.id}
            image={product.images[0]?.data}
            name={product.name}
            price={product.variants[0]?.price || 0}
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
  );
};
