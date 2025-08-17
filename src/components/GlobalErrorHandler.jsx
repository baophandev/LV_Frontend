import { useEffect } from "react";
import useNotification from "../hooks/useNotification";
import { isNetworkError, isTimeoutError } from "../utils/messageUtils";

/**
 * Component xử lý lỗi toàn cục
 */
const GlobalErrorHandler = ({ children }) => {
  const { showError, showWarning } = useNotification();

  useEffect(() => {
    // Xử lý unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      console.error("Unhandled promise rejection:", event.reason);

      const error = event.reason;

      if (isNetworkError(error)) {
        showError(
          error,
          "Mất kết nối internet. Vui lòng kiểm tra mạng và thử lại."
        );
      } else if (isTimeoutError(error)) {
        showWarning("Yêu cầu quá lâu không phản hồi. Vui lòng thử lại.");
      } else {
        showError(error);
      }

      // Prevent default browser error handling
      event.preventDefault();
    };

    // Xử lý JavaScript errors
    const handleError = (event) => {
      console.error("JavaScript error:", event.error);
      showError(
        event.error,
        "Đã xảy ra lỗi không mong muốn. Vui lòng tải lại trang."
      );
    };

    // Xử lý resource loading errors
    const handleResourceError = (event) => {
      if (event.target.tagName === "IMG") {
        console.warn("Image loading failed:", event.target.src);
        // Thay thế bằng placeholder image online
        event.target.src =
          "https://via.placeholder.com/300x300?text=Image+Not+Found";
      } else if (event.target.tagName === "SCRIPT") {
        console.error("Script loading failed:", event.target.src);
        showError(
          null,
          "Không thể tải một số tài nguyên. Vui lòng tải lại trang."
        );
      }
    };

    // Add event listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);
    window.addEventListener("error", handleResourceError, true); // Capture phase for resource errors

    // Cleanup
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
      window.removeEventListener("error", handleError);
      window.removeEventListener("error", handleResourceError, true);
    };
  }, [showError, showWarning]);

  return children;
};

export default GlobalErrorHandler;
