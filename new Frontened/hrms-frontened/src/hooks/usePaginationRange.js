import React from "react";
import { Button } from "react-bootstrap";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  return (
    <div className="pagination float-end me-3 d-flex align-items-center justify-content-between w-25">
      <Button onClick={handleFirstPage} disabled={currentPage === 1}>
        <span aria-hidden="true">&laquo;</span>
      </Button>
      <Button onClick={handlePrevious} disabled={currentPage === 1} className="ms-2">
        <span aria-hidden="true">&lsaquo;</span>
      </Button>
      <span>{`Page ${currentPage} of ${totalPages}`}</span>
      <Button onClick={handleNext} disabled={currentPage === totalPages} className="ms-2">
        <span aria-hidden="true">&rsaquo;</span>
      </Button>
      <Button onClick={handleLastPage} disabled={currentPage === totalPages} className="ms-2">
        <span aria-hidden="true">&raquo;</span>
      </Button>
    </div>
  );
};