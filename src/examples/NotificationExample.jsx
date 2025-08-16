/**
 * Example usage of improved notification system
 */

import React from "react";
import useNotification from "../hooks/useNotification";
import ToastNotification from "../components/ToastNotification";

const ExampleUsage = () => {
  const {
    notification,
    showSuccess,
    showError,
    showWarning,
    hideNotification,
  } = useNotification();

  const handleSuccess = () => {
    showSuccess("LOGIN_SUCCESS"); // Sử dụng key từ SUCCESS_MESSAGES
    // hoặc
    showSuccess("Thao tác thành công!"); // Sử dụng custom message
  };

  const handleError = async () => {
    try {
      // API call
      throw new Error("INVALID_CREDENTIALS");
    } catch (error) {
      showError(error); // Tự động chuyển đổi thành thông báo thân thiện
    }
  };

  const handleWarning = () => {
    showWarning("Vui lòng chọn ít nhất một sản phẩm!");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleWarning}>Show Warning</button>

      <ToastNotification
        open={notification.open}
        onClose={hideNotification}
        message={notification.message}
        severity={notification.severity}
      />
    </div>
  );
};

export default ExampleUsage;
