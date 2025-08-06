import React from "react";

const PageNumber = ({ totalPages, onPageClick, currentPage = 0 }) => {
  const pageCount = totalPages > 0 ? totalPages : 1;

  return (
    <div className="pagination flex items-center justify-center space-x-2 py-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 mr-4">
        🐾{" "}
        <span>
          Trang {currentPage + 1} / {pageCount}
        </span>
      </div>

      {/* Previous Button */}
      {currentPage > 0 && (
        <button
          className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:from-orange-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
          onClick={() => onPageClick(currentPage - 1)}
        >
          🐕 Trước
        </button>
      )}

      {Array.from({ length: pageCount }, (_, index) => index).map((page) => (
        <button
          key={page}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
            page === currentPage
              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
              : "bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 hover:from-orange-200 hover:to-pink-200 hover:text-orange-800"
          }`}
          onClick={() => onPageClick(page)}
        >
          {page + 1}
        </button>
      ))}

      {/* Next Button */}
      {currentPage < pageCount - 1 && (
        <button
          className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg hover:from-orange-500 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-md"
          onClick={() => onPageClick(currentPage + 1)}
        >
          Sau 🐱
        </button>
      )}
    </div>
  );
};

export default PageNumber;
