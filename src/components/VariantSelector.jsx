import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { fetchProductApi } from "../api/productApi";
import { getVariantDiscount } from "../api/productApi";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VariantSelector = ({ open, onClose, currentItem, onVariantSelect }) => {
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!currentItem?.productId) {
        console.log(
          "VariantSelector: currentItem hoặc productId không hợp lệ",
          currentItem
        );
        return;
      }

      setLoading(true);
      try {
        console.log(
          "VariantSelector: Đang tải thông tin sản phẩm",
          currentItem.productId
        );
        const productResponse = await fetchProductApi(currentItem.productId);
        setProduct(productResponse);

        // Lấy thông tin discount cho từng variant
        const variantsWithDiscount = await Promise.all(
          productResponse.variants.map(async (variant) => {
            try {
              const discountResponse = await getVariantDiscount(variant.id);
              return {
                ...variant,
                discountValue: discountResponse?.discountValue || 0,
              };
            } catch (err) {
              console.error("Lỗi khi lấy discount:", err);
              return { ...variant, discountValue: 0 };
            }
          })
        );

        setVariants(variantsWithDiscount);

        // Set current variant as selected
        const currentVariant = variantsWithDiscount.find(
          (v) => v.id === currentItem.productVariantId
        );
        setSelectedVariant(currentVariant);
        console.log("VariantSelector: Đã tải xong", {
          variants: variantsWithDiscount.length,
          currentVariant,
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open && currentItem?.productId) {
      fetchProductDetails();
    } else if (!open) {
      // Reset state when dialog closes
      setProduct(null);
      setVariants([]);
      setSelectedVariant(null);
      setLoading(false);
    }
  }, [open, currentItem]);

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const handleConfirm = () => {
    if (
      selectedVariant &&
      currentItem &&
      selectedVariant.id !== currentItem.productVariantId
    ) {
      onVariantSelect(selectedVariant);
    }
    onClose();
  };

  const calculatePrice = (variant) => {
    const originalPrice = variant.price || 0;
    const discountedPrice = Math.round(
      originalPrice * (1 - variant.discountValue / 100)
    );
    return discountedPrice;
  };

  return (
    <Dialog
      open={open && !!currentItem}
      onClose={onClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          Chọn phân loại cho: {product?.name || "Sản phẩm"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {!currentItem ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <Typography>Không có thông tin sản phẩm</Typography>
          </Box>
        ) : loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <Typography>Đang tải...</Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Chọn màu sắc:
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
              {variants
                .filter((variant) => variant.isActive)
                .map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const isCurrent =
                    currentItem && variant.id === currentItem.productVariantId;
                  const price = calculatePrice(variant);

                  return (
                    <Box
                      key={variant.id}
                      onClick={() => handleVariantSelect(variant)}
                      sx={{
                        border: isSelected
                          ? "3px solid #1976d2"
                          : "1px solid #e0e0e0",
                        borderRadius: 2,
                        p: 2,
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#f3f4f6" : "white",
                        minWidth: 200,
                        position: "relative",
                        "&:hover": {
                          backgroundColor: "#f9f9f9",
                        },
                      }}
                    >
                      {isCurrent && (
                        <Chip
                          label="Hiện tại"
                          size="small"
                          color="primary"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                        />
                      )}

                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            backgroundColor: variant.colorCode || "#000",
                            border: "1px solid #ccc",
                          }}
                        />
                        <Typography variant="body1" fontWeight="medium">
                          {variant.color}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          variant="body2"
                          color="primary"
                          fontWeight="bold"
                        >
                          {price.toLocaleString("vi-VN")} VNĐ
                        </Typography>

                        {variant.discountValue > 0 && (
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mt={0.5}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                textDecoration: "line-through",
                                color: "text.secondary",
                              }}
                            >
                              {variant.price.toLocaleString("vi-VN")} VNĐ
                            </Typography>
                            <Chip
                              label={`-${variant.discountValue}%`}
                              size="small"
                              color="error"
                              variant="outlined"
                            />
                          </Box>
                        )}

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          mt={0.5}
                        >
                          Còn lại: {variant.stock || 0}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
            </Box>

            {variants.filter((v) => v.isActive).length === 0 && (
              <Typography color="text.secondary" textAlign="center" py={4}>
                Không có phân loại nào khả dụng
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={
            !selectedVariant ||
            !currentItem ||
            selectedVariant.id === currentItem.productVariantId
          }
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VariantSelector;
