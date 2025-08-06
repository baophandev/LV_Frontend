import * as React from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import DehazeIcon from "@mui/icons-material/Dehaze";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";

const options = [
  "🐕 Sắp xếp theo tên",
  "💰 Sắp xếp theo giá",
  "⭐ Sắp xếp theo đánh giá",
];

export default function SplitGroup() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup
        ref={anchorRef}
        aria-label="Pet store sort options"
        sx={{
          "& .MuiButton-root": {
            borderColor: "#f97316 !important",
            "&:hover": {
              backgroundColor: "#fed7aa",
              borderColor: "#ea580c !important",
            },
          },
        }}
      >
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select sort strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          sx={{
            color: "#f97316",
            borderColor: "#f97316",
            "&:hover": {
              backgroundColor: "#fed7aa",
            },
          }}
        >
          <DehazeIcon
            sx={{
              color: "#f97316",
            }}
          />
        </Button>
        <Button
          onClick={handleClick}
          sx={{
            color: "#f97316",
            borderColor: "#f97316",
            "&:hover": {
              backgroundColor: "#fed7aa",
            },
          }}
        >
          {options[selectedIndex]}
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1000 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper
              sx={{
                border: "2px solid #f97316",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(249, 115, 22, 0.15)",
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  id="split-button-menu"
                  autoFocusItem
                  sx={{
                    padding: 0,
                    backgroundColor: "#fff9f5",
                  }}
                >
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                      sx={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#374151",
                        "&:hover": {
                          backgroundColor: "#fed7aa",
                          color: "#ea580c",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "#f97316",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "#ea580c",
                          },
                        },
                      }}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}
