import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show at most 5 page numbers
  let displayPages = pages;
  if (totalPages > 5) {
    if (currentPage <= 3) {
      displayPages = [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      displayPages = pages.slice(totalPages - 5);
    } else {
      displayPages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {/* Prev */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-textMuted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </motion.button>

      {/* Page buttons */}
      {totalPages > 5 && currentPage > 3 && (
        <>
          <PageBtn page={1} currentPage={currentPage} onPageChange={onPageChange} />
          <span className="text-textMuted px-1">…</span>
        </>
      )}

      {displayPages.map((page) => (
        <PageBtn key={page} page={page} currentPage={currentPage} onPageChange={onPageChange} />
      ))}

      {totalPages > 5 && currentPage < totalPages - 2 && (
        <>
          <span className="text-textMuted px-1">…</span>
          <PageBtn page={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
        </>
      )}

      {/* Next */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-textMuted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </motion.button>
    </div>
  );
};

const PageBtn = ({ page, currentPage, onPageChange }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={() => onPageChange(page)}
    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
      page === currentPage
        ? 'bg-primary text-white shadow-md shadow-primary/30'
        : 'border border-gray-200 text-textMuted hover:border-primary hover:text-primary'
    }`}
  >
    {page}
  </motion.button>
);

export default Pagination;
