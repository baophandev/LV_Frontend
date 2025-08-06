import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const Carousel = ({ images }) => {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-md bg-gradient-to-r from-orange-100 to-red-100 p-1">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet-custom",
          bulletActiveClass: "swiper-pagination-bullet-active-custom",
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        className="rounded-lg overflow-hidden"
        style={{ width: "100%", height: "200px", marginBottom: "20px" }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={image}
                alt={`🐾 Hình ảnh sản phẩm thú cưng ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                className="transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev-custom absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-orange-600 rounded-full p-2 cursor-pointer transition-all duration-200 shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </div>
        <div className="swiper-button-next-custom absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-orange-600 rounded-full p-2 cursor-pointer transition-all duration-200 shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </div>
      </Swiper>

      <style jsx>{`
        .swiper-pagination-bullet-custom {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          transition: all 0.3s ease;
          margin: 0 4px;
        }

        .swiper-pagination-bullet-active-custom {
          background: #ea580c;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default Carousel;
