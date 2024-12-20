import React from "react";

const PageNumber = ({ totalPages, onPageClick }) => {
  const pageCount = totalPages > 0 ? totalPages : 1; 

  return (
    <div className="pagination flex space-x-2">
      {Array.from({ length: pageCount }, (_, index) => index).map((page) => (
        <button
          key={page}
          className="px-3 py-1 bg-gray-200 hover:bg-blue-500 hover:text-white"
          onClick={() => onPageClick(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default PageNumber;
