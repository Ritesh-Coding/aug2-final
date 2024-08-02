import React from 'react'

import { useState,useEffect } from 'react'
import useAxios from '../../../hooks/useAxios'

const CalenderHolidays = () => {  

    const axiosInstance = useAxios()
    const [holidays,setHolidays]= useState([])
    
    const showHolidays=async ()=>{
      const result =await  axiosInstance.get('api/calender-holidays/')           
      setHolidays(result.data)       
    }
    useEffect( ()=>{
        showHolidays()
    },[])
  return (
    <div style={{marginLeft:`60px`}}>
        <h3>Holidays</h3>
        <div className="card" style={{width:`360px`}}>
        <div style={{float:`right`,width:`60px` ,marginLeft:`235px`}} >        
        </div>        
        {
            holidays.length >0 ? (holidays.map((holiday)=>(
                <div key={holiday.id} style={{marginTop:`2px`}} >
                <img className="card-img-top" src={holiday.holiday_image} alt="holiday Image" width="260px" height="150px" />              
                <div className="card-body">     
                    <p className="card-text">{holiday.date}</p>              
                    <p className="card-text">{holiday.name}</p>
                </div>                
                </div>
          
            ))) : (
                <h5>No Image Found</h5>
            )        }       
        </div>
    </div>
  )
}
export default CalenderHolidays