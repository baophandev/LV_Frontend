import { Snackbar, Alert, AlertTitle } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

// Custom styled Alert
const StyledAlert = styled(Alert)(({ theme, severity }) => ({
  minWidth: "320px",
  maxWidth: "500px",
  fontSize: "14px",
  fontWeight: 500,
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
  "& .MuiAlert-icon": {
    fontSize: "22px",
  },
  "& .MuiAlert-message": {
    padding: "2px 0",
  },
  ...(severity === "success" && {
    backgroundColor: "#f0f9ff",
    borderLeft: "4px solid #10b981",
    color: "#065f46",
  }),
  ...(severity === "error" && {
    backgroundColor: "#fef2f2",
    borderLeft: "4px solid #ef4444",
    color: "#7f1d1d",
  }),
  ...(severity === "warning" && {
    backgroundColor: "#fffbeb",
    borderLeft: "4px solid #f59e0b",
    color: "#78350f",
  }),
  ...(severity === "info" && {
    backgroundColor: "#f0f9ff",
    borderLeft: "4px solid #3b82f6",
    color: "#1e3a8a",
  }),
}));

// Icon mapping
const severityIcons = {
  success: CheckCircleIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

/**
 * Component Toast notification cải tiến
 */
const ToastNotification = ({
  open,
  onClose,
  message,
  severity = "info",
  duration = 4000,
  position = { vertical: "top", horizontal: "right" },
  title,
  action,
  variant = "filled",
}) => {
  const IconComponent = severityIcons[severity];

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={position}
      sx={{
        zIndex: 9999,
        "& .MuiSnackbar-root": {
          position: "fixed",
        },
      }}
    >
      <StyledAlert
        onClose={onClose}
        severity={severity}
        variant={variant}
        icon={IconComponent && <IconComponent />}
        action={action}
        sx={{
          animation: "slideIn 0.3s ease-out",
          "@keyframes slideIn": {
            from: {
              transform: "translateX(100%)",
              opacity: 0,
            },
            to: {
              transform: "translateX(0)",
              opacity: 1,
            },
          },
        }}
      >
        {title && (
          <AlertTitle sx={{ margin: 0, fontWeight: 600 }}>{title}</AlertTitle>
        )}
        {message}
      </StyledAlert>
    </Snackbar>
  );
};

export default ToastNotification;
