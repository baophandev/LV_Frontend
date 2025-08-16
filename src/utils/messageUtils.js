/**
 * Utility để chuyển đổi thông báo lỗi từ backend thành thông báo thân thiện với người dùng
 */

// Mapping các mã lỗi từ backend thành thông báo tiếng Việt thân thiện
const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS:
    "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.",
  UNAUTHORIZED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  FORBIDDEN: "Bạn không có quyền thực hiện thao tác này.",
  TOKEN_EXPIRED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  INVALID_TOKEN: "Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.",

  // User errors
  USER_NOT_FOUND: "Không tìm thấy thông tin người dùng.",
  EMAIL_ALREADY_EXISTS: "Email này đã được sử dụng. Vui lòng chọn email khác.",
  PHONE_ALREADY_EXISTS:
    "Số điện thoại này đã được sử dụng. Vui lòng chọn số khác.",
  "Email is already taken":
    "Email này đã được sử dụng. Vui lòng chọn email khác.",
  "Phone number is already taken":
    "Số điện thoại này đã được sử dụng. Vui lòng chọn số khác.",
  "User not found": "Không tìm thấy thông tin người dùng.",
  "User not existed": "Tài khoản không tồn tại.",
  WEAK_PASSWORD: "Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.",
  PASSWORD_MISMATCH: "Mật khẩu xác nhận không khớp.",
  CURRENT_PASSWORD_INCORRECT: "Mật khẩu hiện tại không đúng.",

  // Product errors
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm.",
  PRODUCT_OUT_OF_STOCK: "Sản phẩm đã hết hàng.",
  INSUFFICIENT_STOCK: "Số lượng sản phẩm không đủ. Vui lòng giảm số lượng.",
  VARIANT_NOT_FOUND: "Không tìm thấy phân loại sản phẩm.",

  // Cart errors
  CART_NOT_FOUND: "Không tìm thấy giỏ hàng.",
  CART_ITEM_NOT_FOUND: "Không tìm thấy sản phẩm trong giỏ hàng.",
  INVALID_QUANTITY: "Số lượng không hợp lệ.",
  MAX_QUANTITY_EXCEEDED: "Đã đạt số lượng tối đa cho sản phẩm này.",

  // Order errors
  ORDER_NOT_FOUND: "Không tìm thấy đơn hàng.",
  ORDER_CANNOT_BE_CANCELLED: "Không thể hủy đơn hàng này.",
  ORDER_ALREADY_PROCESSED: "Đơn hàng đã được xử lý.",
  INVALID_ORDER_STATUS: "Trạng thái đơn hàng không hợp lệ.",
  PAYMENT_FAILED: "Thanh toán thất bại. Vui lòng thử lại.",

  // Address errors
  ADDRESS_NOT_FOUND: "Không tìm thấy địa chỉ.",
  INVALID_ADDRESS: "Địa chỉ không hợp lệ.",

  // File upload errors
  FILE_TOO_LARGE: "File quá lớn. Vui lòng chọn file nhỏ hơn.",
  INVALID_FILE_TYPE: "Loại file không được hỗ trợ.",
  UPLOAD_FAILED: "Tải file thất bại. Vui lòng thử lại.",

  // Network errors
  NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.",
  SERVER_ERROR: "Lỗi hệ thống. Vui lòng thử lại sau ít phút.",
  TIMEOUT: "Thời gian chờ quá lâu. Vui lòng thử lại.",

  // Validation errors
  VALIDATION_ERROR: "Thông tin không hợp lệ. Vui lòng kiểm tra lại.",
  REQUIRED_FIELD: "Vui lòng điền đầy đủ thông tin bắt buộc.",
  INVALID_EMAIL: "Định dạng email không đúng.",
  INVALID_PHONE: "Số điện thoại không hợp lệ.",
  INVALID_FORMAT: "Định dạng dữ liệu không đúng.",

  // Database errors
  DUPLICATE_ENTRY: "Thông tin đã tồn tại trong hệ thống.",
  CONSTRAINT_VIOLATION: "Dữ liệu không phù hợp với quy tắc hệ thống.",

  // Generic errors
  BAD_REQUEST: "Yêu cầu không hợp lệ. Vui lòng thử lại.",
  INTERNAL_SERVER_ERROR: "Lỗi hệ thống. Vui lòng liên hệ hỗ trợ.",
  SERVICE_UNAVAILABLE: "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.",
};

// Success messages
const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Đăng nhập thành công!",
  REGISTER_SUCCESS: "Đăng ký tài khoản thành công!",
  UPDATE_SUCCESS: "Cập nhật thông tin thành công!",
  DELETE_SUCCESS: "Xóa thành công!",
  ADD_TO_CART_SUCCESS: "Đã thêm sản phẩm vào giỏ hàng!",
  ORDER_SUCCESS: "Đặt hàng thành công!",
  PAYMENT_SUCCESS: "Thanh toán thành công!",
  PASSWORD_CHANGE_SUCCESS: "Đổi mật khẩu thành công!",
  PROFILE_UPDATE_SUCCESS: "Cập nhật thông tin cá nhân thành công!",
};

/**
 * Chuyển đổi error object từ backend thành thông báo thân thiện
 * @param {Object|String} error - Error object hoặc error message
 * @param {String} defaultMessage - Thông báo mặc định nếu không tìm thấy mapping
 * @returns {String} - Thông báo thân thiện với người dùng
 */
export const getErrorMessage = (
  error,
  defaultMessage = "Có lỗi xảy ra. Vui lòng thử lại."
) => {
  if (!error) return defaultMessage;

  // Nếu error là string
  if (typeof error === "string") {
    return ERROR_MESSAGES[error] || error || defaultMessage;
  }

  // Nếu error có response từ axios
  if (error.response) {
    const { status, data } = error.response;

    // Xử lý theo status code
    switch (status) {
      case 400:
        if (data?.message) {
          return (
            ERROR_MESSAGES[data.message] ||
            data.message ||
            "Yêu cầu không hợp lệ."
          );
        }
        return "Thông tin không hợp lệ. Vui lòng kiểm tra lại.";

      case 401:
        return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";

      case 403:
        return "Bạn không có quyền thực hiện thao tác này.";

      case 404:
        return "Không tìm thấy thông tin yêu cầu.";

      case 409:
        if (data?.message) {
          return (
            ERROR_MESSAGES[data.message] ||
            data.message ||
            "Thông tin đã tồn tại."
          );
        }
        return "Thông tin đã tồn tại trong hệ thống.";

      case 422:
        return "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";

      case 429:
        return "Quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.";

      case 500:
        return "Lỗi hệ thống. Vui lòng thử lại sau.";

      case 502:
      case 503:
      case 504:
        return "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.";

      default:
        return data?.message
          ? ERROR_MESSAGES[data.message] || data.message
          : defaultMessage;
    }
  }

  // Xử lý network errors
  if (error.code) {
    switch (error.code) {
      case "NETWORK_ERROR":
      case "ERR_NETWORK":
        return "Lỗi kết nối mạng. Vui lòng kiểm tra internet.";

      case "TIMEOUT":
      case "ERR_TIMEOUT":
        return "Thời gian chờ quá lâu. Vui lòng thử lại.";

      case "ABORT":
        return "Yêu cầu đã bị hủy.";

      default:
        return defaultMessage;
    }
  }

  // Xử lý error message
  if (error.message) {
    return ERROR_MESSAGES[error.message] || error.message || defaultMessage;
  }

  return defaultMessage;
};

/**
 * Lấy thông báo thành công
 * @param {String} key - Key của thông báo thành công
 * @param {String} defaultMessage - Thông báo mặc định
 * @returns {String} - Thông báo thành công
 */
export const getSuccessMessage = (
  key,
  defaultMessage = "Thao tác thành công!"
) => {
  return SUCCESS_MESSAGES[key] || defaultMessage;
};

/**
 * Xử lý validation errors từ form
 * @param {Object} errors - Object chứa validation errors
 * @returns {String} - Thông báo lỗi đầu tiên
 */
export const getValidationErrorMessage = (errors) => {
  if (!errors || typeof errors !== "object") return null;

  const errorKeys = Object.keys(errors);
  if (errorKeys.length === 0) return null;

  const firstError = errors[errorKeys[0]];
  return Array.isArray(firstError) ? firstError[0] : firstError;
};

/**
 * Kiểm tra xem error có phải là network error không
 * @param {Object} error - Error object
 * @returns {Boolean}
 */
export const isNetworkError = (error) => {
  return (
    !error.response &&
    (error.code === "NETWORK_ERROR" ||
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error")
  );
};

/**
 * Kiểm tra xem error có phải là timeout error không
 * @param {Object} error - Error object
 * @returns {Boolean}
 */
export const isTimeoutError = (error) => {
  return (
    error.code === "TIMEOUT" ||
    error.code === "ERR_TIMEOUT" ||
    error.message?.includes("timeout")
  );
};

const messageUtils = {
  getErrorMessage,
  getSuccessMessage,
  getValidationErrorMessage,
  isNetworkError,
  isTimeoutError,
};

export default messageUtils;
