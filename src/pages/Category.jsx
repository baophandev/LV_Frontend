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

  if (status === "loading") return <Loading></Loading>;
  if (status === "failed")
    return (
      <Alert severity="error" className="m-4">
        <AlertTitle>❌ Đã có lỗi xảy ra</AlertTitle>
        {error || "Không thể tải sản phẩm thú cưng. Vui lòng thử lại sau."}
      </Alert>
    );
  return (
    <div className="p-5 w-full sm:w-3/4">
      <div className="text-orange-600 p-6 rounded-xl mb-6 uppercase text-xl font-extrabold bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐾</span>
          <span className="">
            {categorys.find((category) => category.id === categoryId)?.name}
          </span>
          <span className="text-sm font-normal normal-case text-orange-500">
            ({products.length} sản phẩm)
          </span>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products?.length > 0 ? (
          products.map((product) => (
            <ProductCart
              key={product.id}
              id={product.id}
              image={product.productAvatar.data}
              name={product.name}
              price={product.firstVariantPrice || 0}
              discountDisplayed={product.discountDisplayed}
              category={product.category?.name}
              premiumStyle={true}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
            <span className="text-6xl mb-4">🐾</span>
            <h3 className="text-xl font-semibold mb-2">Chưa có sản phẩm nào</h3>
            <p className="text-sm">
              Danh mục này hiện tại chưa có sản phẩm thú cưng nào.
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <Pagination
          count={totalPages}
          variant="outlined"
          color="primary"
          page={currentPage + 1}
          onChange={(event, value) => handlePageClick(value)}
          size="large"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#ea580c",
              borderColor: "#fed7aa",
              "&:hover": {
                backgroundColor: "#fed7aa",
              },
              "&.Mui-selected": {
                backgroundColor: "#ea580c",
                color: "white",
                "&:hover": {
                  backgroundColor: "#c2410c",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};
