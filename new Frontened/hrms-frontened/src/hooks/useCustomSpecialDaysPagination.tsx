import React from 'react'
import { Button } from 'react-bootstrap';
interface CustomPaginationProp{
  currentPage:number
  totalPages :number
  onPageChange : (page : number)=>void
}
const CustomSpecialDaysPagination : React.FC<CustomPaginationProp> = ({ currentPage, totalPages, onPageChange }) => {   
    
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
    
    
      return (
        <div className="pagination float-end me-3 d-flex align-items-center justify-content-between w-25">
          
          <Button onClick={handlePrevious} disabled={currentPage === 1} className="ms-2">
            <span aria-hidden="true">&lsaquo;</span>
          </Button>          
          <Button onClick={handleNext} disabled={currentPage === totalPages} className="ms-2">
            <span aria-hidden="true">&rsaquo;</span>
          </Button>        
        </div>
      );
}

export default CustomSpecialDaysPagination