# Hệ thống thông báo cải tiến cho Frontend

Hệ thống thông báo này đã được cải tiến để cung cấp trải nghiệm người dùng tốt hơn với các thông báo lỗi thân thiện và dễ hiểu.

## Các thành phần chính

### 1. MessageUtils (`utils/messageUtils.js`)

Utility chuyển đổi các mã lỗi từ backend thành thông báo tiếng Việt thân thiện.

**Các hàm chính:**

- `getErrorMessage(error, defaultMessage)`: Chuyển đổi lỗi thành thông báo thân thiện
- `getSuccessMessage(key, defaultMessage)`: Lấy thông báo thành công
- `getValidationErrorMessage(errors)`: Xử lý validation errors
- `isNetworkError(error)`: Kiểm tra lỗi mạng
- `isTimeoutError(error)`: Kiểm tra lỗi timeout

### 2. useNotification Hook (`hooks/useNotification.js`)

Hook tùy chỉnh để quản lý thông báo dễ dàng.

**Các hàm:**

- `showSuccess(message)`: Hiển thị thông báo thành công
- `showError(error, defaultMessage)`: Hiển thị thông báo lỗi
- `showWarning(message)`: Hiển thị thông báo cảnh báo
- `showInfo(message)`: Hiển thị thông báo thông tin
- `hideNotification()`: Ẩn thông báo

### 3. ToastNotification Component (`components/ToastNotification.jsx`)

Component thông báo toast với thiết kế đẹp và animation mượt.

### 4. GlobalErrorHandler Component (`components/GlobalErrorHandler.jsx`)

Xử lý các lỗi chưa được bắt toàn cục (unhandled errors).

## Cách sử dụng

### 1. Sử dụng hook useNotification

```jsx
import useNotification from "../hooks/useNotification";
import ToastNotification from "../components/ToastNotification";

const MyComponent = () => {
  const { notification, showSuccess, showError, hideNotification } =
    useNotification();

  const handleLogin = async () => {
    try {
      const result = await loginApi(credentials);
      showSuccess("LOGIN_SUCCESS"); // Sử dụng key
      // hoặc
      showSuccess("Đăng nhập thành công!"); // Custom message
    } catch (error) {
      showError(error); // Tự động chuyển đổi lỗi
    }
  };

  return (
    <div>
      {/* Your component content */}

      <ToastNotification
        open={notification.open}
        onClose={hideNotification}
        message={notification.message}
        severity={notification.severity}
      />
    </div>
  );
};
```

### 2. Sử dụng component UserNotification (đơn giản hơn)

```jsx
import UserNotification from "../components/UserNotification";

const [showNotification, setShowNotification] = useState(false);
const [notificationMessage, setNotificationMessage] = useState("");
const [notificationSeverity, setNotificationSeverity] = useState("info");

// Trong JSX
<UserNotification
  open={showNotification}
  onClose={() => setShowNotification(false)}
  message={notificationMessage}
  severity={notificationSeverity}
  duration={4000}
/>;
```

## Các loại lỗi được hỗ trợ

### Authentication Errors

- `INVALID_CREDENTIALS` → "Tên đăng nhập hoặc mật khẩu không đúng..."
- `UNAUTHORIZED` → "Phiên đăng nhập đã hết hạn..."
- `TOKEN_EXPIRED` → "Phiên đăng nhập đã hết hạn..."

### User Errors

- `EMAIL_ALREADY_EXISTS` → "Email này đã được sử dụng..."
- `PHONE_ALREADY_EXISTS` → "Số điện thoại này đã được sử dụng..."
- `USER_NOT_FOUND` → "Không tìm thấy thông tin người dùng"

### Product Errors

- `PRODUCT_OUT_OF_STOCK` → "Sản phẩm đã hết hàng"
- `INSUFFICIENT_STOCK` → "Số lượng sản phẩm không đủ..."

### Network Errors

- `NETWORK_ERROR` → "Lỗi kết nối mạng..."
- `TIMEOUT` → "Thời gian chờ quá lâu..."

### Generic Errors

- `BAD_REQUEST` → "Yêu cầu không hợp lệ..."
- `INTERNAL_SERVER_ERROR` → "Lỗi hệ thống..."

## Tùy chỉnh

### Thêm thông báo lỗi mới

Trong `utils/messageUtils.js`, thêm vào object `ERROR_MESSAGES`:

```javascript
const ERROR_MESSAGES = {
  // ... existing messages
  YOUR_NEW_ERROR_CODE: "Thông báo lỗi thân thiện của bạn",
};
```

### Thêm thông báo thành công mới

Trong `utils/messageUtils.js`, thêm vào object `SUCCESS_MESSAGES`:

```javascript
const SUCCESS_MESSAGES = {
  // ... existing messages
  YOUR_SUCCESS_KEY: "Thông báo thành công của bạn",
};
```

### Tùy chỉnh vị trí thông báo

```jsx
<ToastNotification
  position={{ vertical: "bottom", horizontal: "left" }}
  // ... other props
/>
```

### Tùy chỉnh thời gian hiển thị

```jsx
<ToastNotification
  duration={5000} // 5 giây
  // ... other props
/>
```

## Lợi ích của hệ thống mới

1. **Thông báo thân thiện**: Chuyển đổi mã lỗi kỹ thuật thành ngôn ngữ dễ hiểu
2. **Tính nhất quán**: Tất cả thông báo đều có cùng format và style
3. **Dễ bảo trì**: Tập trung quản lý tất cả thông báo ở một nơi
4. **Xử lý lỗi toàn cục**: Tự động bắt và xử lý các lỗi chưa được handle
5. **Trải nghiệm người dùng tốt**: Animation mượt mà và thiết kế đẹp
6. **Đa ngôn ngữ**: Dễ dàng mở rộng hỗ trợ nhiều ngôn ngữ

## Migration từ hệ thống cũ

### Thay thế alert() cũ:

```jsx
// Cũ
alert("Có lỗi xảy ra");

// Mới
const { showError } = useNotification();
showError(null, "Có lỗi xảy ra");
```

### Thay thế Snackbar thủ công:

```jsx
// Cũ
const [openToast, setOpenToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");
const [toastSeverity, setToastSeverity] = useState("success");

// Mới
const { notification, showSuccess, showError, hideNotification } =
  useNotification();
```

## Lưu ý quan trọng

1. **Luôn sử dụng getErrorMessage()** để xử lý lỗi từ API
2. **Kiểm tra network errors** với `isNetworkError()` và `isTimeoutError()`
3. **Sử dụng keys** thay vì hardcode messages khi có thể
4. **Test thông báo** với các trường hợp lỗi khác nhau
5. **GlobalErrorHandler** đã được tích hợp vào App.jsx để bắt lỗi toàn cục
