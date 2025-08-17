# Home Page Responsive Improvements

## Overview
Trang Home đã được cải thiện để responsive tốt hơn trên tất cả các thiết bị từ điện thoại nhỏ đến desktop lớn.

## Responsive Breakpoints
- **xs**: 475px - Extra small phones
- **sm**: 640px - Small phones (landscape)  
- **md**: 768px - Tablets
- **lg**: 1024px - Small desktops
- **xl**: 1280px - Large desktops
- **2xl**: 1536px - Extra large screens

## Key Improvements

### 1. Mobile Filter Button
- Positioned fixed at bottom-right for easy thumb access
- Responsive sizing: smaller on xs screens, larger on sm+
- Icon-only on xs, text + icon on sm+
- Touch-friendly minimum 44px tap target

### 2. Category Carousel
- Responsive item sizing:
  - xs: 70px min-width, 10x10 images
  - sm: 80px min-width, 12x12 images  
  - md+: Original 16x16 images
- Improved horizontal scrolling with hidden scrollbar
- Better text wrapping for category names

### 3. Banner Section
- Dynamic height based on screen size:
  - xs: 35vh (very small phones)
  - sm: 45vh (small phones)
  - md: 60vh (tablets)
  - lg+: 70-80vh (desktops)
- Centered fallback text on small screens

### 4. Filter Section (Desktop)
- Responsive padding and spacing
- Smaller buttons and text on smaller desktop screens
- Improved select dropdown width

### 5. Product Grids
- Smart grid columns:
  - xs-sm: 2 columns
  - md: 3 columns  
  - lg+: 4 columns
- Responsive gaps between items
- Consistent aspect ratios

### 6. Promotion Section
- Improved Swiper breakpoints:
  - 320px: 1.5 slides per view
  - 480px: 1.8 slides per view
  - 640px: 2.5 slides per view
  - 768px: 3 slides per view
  - 1024px+: 4 slides per view

### 7. Typography
- Responsive text sizing across all headings
- Better line height for readability on small screens
- Appropriate padding for text content

### 8. Pagination
- Dynamic sizing based on screen width:
  - <640px: small
  - 640-768px: medium  
  - 768px+: large

### 9. Buttons and Interactive Elements
- Touch-friendly sizing on mobile
- Hover effects only on devices that support hover
- Proper focus states for accessibility
- Responsive padding and text sizes

## Custom CSS Classes
Additional responsive utilities are defined in `src/styles/responsive.css`:

- `.hide-scrollbar` - Hides scrollbars across browsers
- `.touch-target` - Ensures 44px minimum touch target
- `.mobile-filter-button` - Fixed positioning for mobile filter
- `.skeleton` - Loading animation
- `.focus-ring` - Accessible focus states
- `.hover-scale` - Hover effects for desktop only

## Testing Recommendations
Test the responsive design on these viewport sizes:
- 320px (iPhone SE)
- 375px (iPhone 12 Pro)
- 414px (iPhone 12 Pro Max)
- 768px (iPad)
- 1024px (iPad Pro)
- 1280px (Laptop)
- 1920px (Desktop)

## Performance Considerations
- Images are properly sized for different viewports
- Swiper lazy loading is enabled
- Touch interactions are optimized
- Hover effects are disabled on touch devices to prevent sticky states

## Accessibility Features
- Proper focus management
- Touch-friendly interactive elements
- Semantic HTML structure maintained
- Screen reader friendly markup
