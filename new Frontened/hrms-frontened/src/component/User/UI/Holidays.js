import React from 'react'
import axios from 'axios'
import { useState,useEffect } from 'react'
import useAxios from '../../../hooks/useAxios'
import CircularProgress from "@mui/material/CircularProgress";

import CustomSpecialDaysPagination from '../../../hooks/useCustomSpecialDaysPagination'
const Holidays = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 1;
    const [totalPages, setTotalPages] = useState(1);
    const axiosInstance = useAxios()
    
    const [holidays,setHolidays]= useState([])
    const handlePageChange = (page)=>{
        setCurrentPage(page)
    }
    const showHolidays=async (page)=>{
      const result =await  axiosInstance.get('api/holidays/',{
            params:{
            page
            }
        })
        
        if (result.data.count === 0){
            setTotalPages(1);
          }
          else{        
          console.log("total count page",Math.ceil(result.data.count / rowsPerPage))
          setTotalPages(Math.ceil(result.data.count / rowsPerPage));
          }       
        setHolidays(result.data["results"])       
    }
    useEffect( ()=>{
        
        showHolidays(currentPage)
      
    },[currentPage])
   
  return (
    <div style={{marginLeft:`60px`}}>
      
        <div className="card" style={{width:`260px`}}>
        <div style={{display:`flex`}}>
        <h3>Holidays</h3>
        <div style={{float:`right`,width:`60px` ,marginLeft:`25px`}} >
        <CustomSpecialDaysPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /> 
        </div> 
        </div>
               
        {
            holidays.length >0 ? (holidays.map((holiday)=>(
                <div key={holiday.id}>
                <img className="card-img-top" src={holiday.holiday_image} alt="holiday Image" width="260px" height="150px" /> 
              
                <div className="card-body">
                    <p className="card-text">{holiday.date}</p>
                    <p className="card-text">{holiday.name}</p>
                </div>
                </div>
            ))) : (
                <h5>No Holiday Available</h5>            )
        }       
        </div>
    </div>
  )
}

export default Holidays