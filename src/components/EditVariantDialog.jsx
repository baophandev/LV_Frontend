import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { fetchProductApi } from "../api/productApi";

const EditVariantDialog = ({ open, onClose, cartItem, onUpdateVariant }) => {
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper function để lấy số lượng từ variant
  const getVariantQuantity = (variant) => {
    return (
      variant.quantity ||
      variant.stock ||
      variant.availableQuantity ||
      variant.qtyInStock ||
      0
    );
  };

  // Helper function để kiểm tra xem variant có đủ số lượng không
  const isVariantAvailable = (variant) => {
    const availableQty = getVariantQuantity(variant);
    const currentCartQty = cartItem.quantity || 0;
    return availableQty >= currentCartQty;
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        console.log("Fetching product data for productId:", cartItem.productId);
        const response = await fetchProductApi(cartItem.productId);
        console.log("Product data response:", response);
        console.log("Variants data:", response.variants);
        if (response.variants && response.variants.length > 0) {
          console.log("First variant structure:", response.variants[0]);
          console.log("Variant keys:", Object.keys(response.variants[0]));
        }
        setProduct(response);

        // Tìm biến thể hiện tại
        const currentVariant = response.variants?.find(
          (variant) => variant.id === cartItem.productVariantId
        );
        console.log("Current variant found:", currentVariant);
        console.log("CartItem variant ID:", cartItem.productVariantId);
        setSelectedVariant(currentVariant);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open && cartItem?.productId) {
      fetchProductData();
    }
  }, [open, cartItem]);

  const handleVariantChange = (event) => {
    const variantId = event.target.value;
    const variant = product.variants.find((v) => v.id === variantId);
    setSelectedVariant(variant);
  };

  const handleSave = () => {
    if (selectedVariant && selectedVariant.id !== cartItem.productVariantId) {
      // Kiểm tra an toàn trước khi lưu
      if (!isVariantAvailable(selectedVariant)) {
        alert(
          `Không thể chuyển sang biến thể này vì chỉ còn ${getVariantQuantity(
            selectedVariant
          )} sản phẩm, nhưng bạn có ${
            cartItem.quantity
          } sản phẩm trong giỏ hàng.`
        );
        return;
      }

      console.log("Lưu thay đổi biến thể:", {
        cartItemId: cartItem.itemId,
        oldVariantId: cartItem.productVariantId,
        newVariantId: selectedVariant.id,
        variantInfo: selectedVariant,
        cartQuantity: cartItem.quantity,
        availableQuantity: getVariantQuantity(selectedVariant),
      });
      onUpdateVariant(cartItem.itemId, selectedVariant.id);
    } else {
      console.log("Không có thay đổi hoặc chưa chọn biến thể mới");
    }
    onClose();
  };

  if (!cartItem) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ color: "#ea580c" }}>
          🔧 Chỉnh sửa biến thể sản phẩm
        </Typography>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography>Đang tải...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {cartItem.productName}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mb: 2, p: 2, bgcolor: "#e3f2fd", borderRadius: 1 }}
              >
                💡 <strong>Lưu ý:</strong> Chỉ có thể chuyển sang biến thể có số
                lượng tồn kho ≥ {cartItem.quantity} sản phẩm hiện có trong giỏ
                hàng.
              </Typography>
            </Grid>

            {product?.variants && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Chọn biến thể</InputLabel>
                  <Select
                    value={selectedVariant?.id || ""}
                    onChange={handleVariantChange}
                    label="Chọn biến thể"
                  >
                    {product.variants.map((variant) => {
                      const isAvailable = isVariantAvailable(variant);
                      const variantQty = getVariantQuantity(variant);
                      const currentCartQty = cartItem.quantity || 0;

                      return (
                        <MenuItem
                          key={variant.id}
                          value={variant.id}
                          disabled={!isAvailable}
                          sx={{
                            opacity: !isAvailable ? 0.5 : 1,
                            backgroundColor: !isAvailable
                              ? "#f5f5f5"
                              : "inherit",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              width: "100%",
                            }}
                          >
                            {variant.variantImages?.[0] && (
                              <img
                                src={`data:image/png;base64,${variant.variantImages[0].data}`}
                                alt={variant.color}
                                style={{
                                  width: 40,
                                  height: 40,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                  opacity: !isAvailable ? 0.5 : 1,
                                }}
                              />
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: !isAvailable
                                    ? "text.disabled"
                                    : "text.primary",
                                }}
                              >
                                Màu: {variant.color}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Giá: {variant.price?.toLocaleString("vi-VN")}đ
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: !isAvailable
                                    ? "error.main"
                                    : "text.secondary",
                                  fontWeight: !isAvailable ? "bold" : "normal",
                                }}
                              >
                                Còn lại: {variantQty}
                                {!isAvailable && (
                                  <span style={{ marginLeft: 8 }}>
                                    (Không đủ cho {currentCartQty} sản phẩm)
                                  </span>
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {selectedVariant && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: isVariantAvailable(selectedVariant)
                      ? "#f5f5f5"
                      : "#ffebee",
                    borderRadius: 2,
                    border: !isVariantAvailable(selectedVariant)
                      ? "1px solid #f44336"
                      : "none",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    🎯 Biến thể đã chọn:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {selectedVariant.variantImages?.[0] && (
                      <img
                        src={`data:image/png;base64,${selectedVariant.variantImages[0].data}`}
                        alt={selectedVariant.color}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    )}
                    <Box>
                      <Typography variant="body1">
                        <strong>Màu:</strong> {selectedVariant.color}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Giá:</strong>{" "}
                        {selectedVariant.price?.toLocaleString("vi-VN")}đ
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: !isVariantAvailable(selectedVariant)
                            ? "error.main"
                            : "text.primary",
                          fontWeight: !isVariantAvailable(selectedVariant)
                            ? "bold"
                            : "normal",
                        }}
                      >
                        <strong>Số lượng còn:</strong>{" "}
                        {getVariantQuantity(selectedVariant)}
                      </Typography>
                      {!isVariantAvailable(selectedVariant) && (
                        <Typography
                          variant="body2"
                          color="error"
                          sx={{ mt: 1 }}
                        >
                          ⚠️ Không đủ số lượng cho {cartItem.quantity} sản phẩm
                          trong giỏ hàng
                        </Typography>
                      )}
                      {cartItem.quantity && (
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mt: 1 }}
                        >
                          📦 Số lượng trong giỏ: {cartItem.quantity}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: "#ea580c",
            "&:hover": { bgcolor: "#c2410c" },
          }}
          disabled={
            !selectedVariant ||
            selectedVariant.id === cartItem.productVariantId ||
            !isVariantAvailable(selectedVariant)
          }
        >
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVariantDialog;
