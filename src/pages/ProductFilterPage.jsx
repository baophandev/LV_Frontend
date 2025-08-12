import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCart from "../components/ProductCart";
import Loading from "../components/Loading";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Pagination from "@mui/material/Pagination";
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
      setError(err?.message || "❌ Đã có lỗi xảy ra khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId, sortDirection, status, currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageClick = (event, value) => {
    setCurrentPage(value - 1);
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="p-5 w-full sm:w-3/4 mx-auto bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
        <Alert
          severity="error"
          className="m-4"
          sx={{
            backgroundColor: "#fee2e2",
            color: "#dc2626",
            "& .MuiAlert-icon": {
              color: "#dc2626",
            },
          }}
        >
          <AlertTitle>🚨 Lỗi tải sản phẩm</AlertTitle>
          {error}
        </Alert>
      </div>
    );

  return (
    <div className="p-5 w-full sm:w-3/4 mx-auto bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      <div className="text-white p-4 rounded-lg mb-4 uppercase text-xl font-extrabold shadow-md bg-gradient-to-r from-orange-500 to-orange-600">
        🔍 Kết quả tìm kiếm sản phẩm
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length === 0 ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <span className="text-6xl">🐾</span>
              <span className="text-orange-600 font-medium text-lg">
                Không tìm thấy sản phẩm phù hợp
              </span>
              <span className="text-gray-500 text-sm">
                Hãy thử tìm kiếm với từ khóa khác cho thú cưng của bạn!
              </span>
            </div>
          </div>
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
        <div className="flex justify-center mt-8">
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            variant="outlined"
            onChange={handlePageClick}
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
                    backgroundColor: "#dc2626",
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
