import { useState } from "react";
import { getErrorMessage, getSuccessMessage } from "../utils/messageUtils";

/**
 * Custom hook để quản lý thông báo người dùng
 */
const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  /**
   * Hiển thị thông báo thành công
   * @param {string} message - Thông báo hoặc key từ SUCCESS_MESSAGES
   * @param {number} duration - Thời gian hiển thị (ms)
   */
  const showSuccess = (message, duration = 3000) => {
    const successMessage = getSuccessMessage(message) || message;
    setNotification({
      open: true,
      message: successMessage,
      severity: "success",
    });

    if (duration > 0) {
      setTimeout(() => hideNotification(), duration);
    }
  };

  /**
   * Hiển thị thông báo lỗi
   * @param {any} error - Error object hoặc error message
   * @param {string} defaultMessage - Thông báo mặc định
   * @param {number} duration - Thời gian hiển thị (ms)
   */
  const showError = (
    error,
    defaultMessage = "Có lỗi xảy ra. Vui lòng thử lại.",
    duration = 4000
  ) => {
    const errorMessage = getErrorMessage(error, defaultMessage);
    setNotification({
      open: true,
      message: errorMessage,
      severity: "error",
    });

    if (duration > 0) {
      setTimeout(() => hideNotification(), duration);
    }
  };

  /**
   * Hiển thị thông báo cảnh báo
   * @param {string} message - Thông báo cảnh báo
   * @param {number} duration - Thời gian hiển thị (ms)
   */
  const showWarning = (message, duration = 3000) => {
    setNotification({
      open: true,
      message,
      severity: "warning",
    });

    if (duration > 0) {
      setTimeout(() => hideNotification(), duration);
    }
  };

  /**
   * Hiển thị thông báo thông tin
   * @param {string} message - Thông báo thông tin
   * @param {number} duration - Thời gian hiển thị (ms)
   */
  const showInfo = (message, duration = 3000) => {
    setNotification({
      open: true,
      message,
      severity: "info",
    });

    if (duration > 0) {
      setTimeout(() => hideNotification(), duration);
    }
  };

  /**
   * Ẩn thông báo
   */
  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

  /**
   * Hiển thị thông báo tùy chỉnh
   * @param {string} message - Thông báo
   * @param {string} severity - Loại thông báo (success, error, warning, info)
   * @param {number} duration - Thời gian hiển thị (ms)
   */
  const showNotification = (message, severity = "info", duration = 3000) => {
    setNotification({
      open: true,
      message,
      severity,
    });

    if (duration > 0) {
      setTimeout(() => hideNotification(), duration);
    }
  };

  return {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification,
    hideNotification,
  };
};

export default useNotification;
