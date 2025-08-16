import { Snackbar, Alert } from "@mui/material";

/**
 * Component để hiển thị thông báo cho người dùng với nội dung thân thiện
 */
const UserNotification = ({
  open,
  onClose,
  message,
  severity = "info",
  duration = 4000,
  position = { vertical: "top", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={position}
      sx={{ zIndex: 9999 }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          fontSize: "14px",
          fontWeight: 500,
        }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default UserNotification;
