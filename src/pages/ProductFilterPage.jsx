import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCart from "../components/ProductCart";
import Loading from "../components/Loading";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Pagination from "@mui/material/Pagination";
import ThemeColor from "../constant/theme";
import { fecthProductFilterApi } from "../api/productApi"; // chỉnh lại path nếu cần

export function ProductFilterPage() {
  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get("categoryId");
  const status = searchParams.get("status") || "ACTIVE";
  const sortDirection = searchParams.get("sortDirection") || "DESC";
  const pageSize = 20;

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fecthProductFilterApi({
        categoryId,
        sortDirection,
        pageNumber: currentPage,
        pageSize,
        status,
      });
      setProducts(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err?.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId, sortDirection, status, currentPage]);

  const handlePageClick = (event, value) => {
    setCurrentPage(value - 1);
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <Alert severity="error" className="m-4">
        <AlertTitle>Lỗi</AlertTitle>
        {error}
      </Alert>
    );

  return (
    <div className="p-5 w-full sm:w-3/4 mx-auto">
      <div
        className="bg-white text-blue-500 p-4 rounded-md mb-4 uppercase text-xl font-extrabold"
      >
        Kết quả lọc sản phẩm
      </div>

      <div className="w-full flex gap-2 flex-wrap items-center">
        {products.length === 0 ? (
          <p className="text-gray-500">Không có sản phẩm phù hợp.</p>
        ) : (
          products.map((product) => (
            <ProductCart
              key={product.id}
              id={product.id}
              image={product.productAvatar?.data}
              name={product.name}
              price={product.firstVariantPrice || 0}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            variant="outlined"
            color="primary"
            onChange={handlePageClick}
          />
        </div>
      )}
    </div>
  );
}
