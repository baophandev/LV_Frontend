import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { compareProductsApi } from "../api/productApi";
import ProductCompareCard from "../components/ProductCompareCard";
import ProductSelector from "../components/ProductSelector";
import { Compare, Add } from "@mui/icons-material";
import Loading from "../components/Loading";

const ProductCompare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [compareData, setCompareData] = useState({
    product1: null,
    product2: null,
    attributes1: null,
    attributes2: null,
  });
  const [showSelector, setShowSelector] = useState(false);
  const [selectingSlot, setSelectingSlot] = useState(null); // 1 or 2
  const [isLoading, setIsLoading] = useState(false);

  // Lấy product IDs từ URL params
  useEffect(() => {
    const product1Id = searchParams.get("product1");
    const product2Id = searchParams.get("product2");

    if (product1Id && product2Id) {
      loadCompareData(product1Id, product2Id);
    } else if (product1Id) {
      loadSingleProduct(product1Id, 1);
    } else if (product2Id) {
      loadSingleProduct(product2Id, 2);
    }
  }, [searchParams]);

  const loadCompareData = async (productId1, productId2) => {
    setIsLoading(true);
    try {
      const data = await compareProductsApi(productId1, productId2);
      setCompareData(data);
    } catch (error) {
      console.error("Error loading compare data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSingleProduct = async (productId, slot) => {
    setIsLoading(true);
    try {
      const data = await compareProductsApi(productId, productId);
      if (slot === 1) {
        setCompareData((prev) => ({
          ...prev,
          product1: data.product1,
          attributes1: data.attributes1,
        }));
      } else {
        setCompareData((prev) => ({
          ...prev,
          product2: data.product2,
          attributes2: data.attributes2,
        }));
      }
    } catch (error) {
      console.error("Error loading product data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = async (product) => {
    const newParams = new URLSearchParams(searchParams);

    if (selectingSlot === 1) {
      newParams.set("product1", product.id);
      setCompareData((prev) => ({
        ...prev,
        product1: product,
      }));
    } else {
      newParams.set("product2", product.id);
      setCompareData((prev) => ({
        ...prev,
        product2: product,
      }));
    }

    setSearchParams(newParams);
    setShowSelector(false);
    setSelectingSlot(null);

    // Load attributes for the selected product
    try {
      const data = await compareProductsApi(product.id, product.id);
      if (selectingSlot === 1) {
        setCompareData((prev) => ({
          ...prev,
          attributes1: data.attributes1,
        }));
      } else {
        setCompareData((prev) => ({
          ...prev,
          attributes2: data.attributes2,
        }));
      }
    } catch (error) {
      console.error("Error loading product attributes:", error);
    }
  };

  const handleRemoveProduct = (slot) => {
    const newParams = new URLSearchParams(searchParams);

    if (slot === 1) {
      newParams.delete("product1");
      setCompareData((prev) => ({
        ...prev,
        product1: null,
        attributes1: null,
      }));
    } else {
      newParams.delete("product2");
      setCompareData((prev) => ({
        ...prev,
        product2: null,
        attributes2: null,
      }));
    }

    setSearchParams(newParams);
  };

  const openSelector = (slot) => {
    setSelectingSlot(slot);
    setShowSelector(true);
  };

  const getExcludeIds = () => {
    const ids = [];
    if (compareData.product1) ids.push(compareData.product1.id);
    if (compareData.product2) ids.push(compareData.product2.id);
    return ids;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Compare className="text-blue-600" fontSize="large" />
          <h1 className="text-3xl font-bold text-gray-800">So sánh sản phẩm</h1>
        </div>
        <p className="text-gray-600">
          Chọn 2 sản phẩm để so sánh chi tiết các thông số kỹ thuật
        </p>
      </div>

      {/* Compare Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Product 1 */}
        <div>
          {compareData.product1 ? (
            <ProductCompareCard
              product={compareData.product1}
              attributes={compareData.attributes1}
              isSelected={true}
              onRemove={() => handleRemoveProduct(1)}
            />
          ) : (
            <div
              onClick={() => openSelector(1)}
              className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 transition min-h-[400px] flex items-center justify-center"
            >
              <div className="text-center text-gray-500">
                <Add fontSize="large" className="mb-2" />
                <p className="font-medium">Chọn sản phẩm thứ nhất</p>
                <p className="text-sm">Nhấp để tìm kiếm sản phẩm</p>
              </div>
            </div>
          )}
        </div>

        {/* Product 2 */}
        <div>
          {compareData.product2 ? (
            <ProductCompareCard
              product={compareData.product2}
              attributes={compareData.attributes2}
              isSelected={true}
              onRemove={() => handleRemoveProduct(2)}
            />
          ) : (
            <div
              onClick={() => openSelector(2)}
              className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 transition min-h-[400px] flex items-center justify-center"
            >
              <div className="text-center text-gray-500">
                <Add fontSize="large" className="mb-2" />
                <p className="font-medium">Chọn sản phẩm thứ hai</p>
                <p className="text-sm">Nhấp để tìm kiếm sản phẩm</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {compareData.product1 && compareData.product2 && (
        <div className="text-center mt-8">
          <button
            onClick={() => {
              setCompareData({
                product1: null,
                product2: null,
                attributes1: null,
                attributes2: null,
              });
              setSearchParams(new URLSearchParams());
            }}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition mr-4"
          >
            Xóa tất cả
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Về trang chủ
          </button>
        </div>
      )}

      {/* Product Selector Modal */}
      {showSelector && (
        <ProductSelector
          onSelectProduct={handleSelectProduct}
          onClose={() => {
            setShowSelector(false);
            setSelectingSlot(null);
          }}
          excludeIds={getExcludeIds()}
        />
      )}
    </div>
  );
};

export default ProductCompare;
