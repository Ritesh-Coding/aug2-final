import React from 'react'
import useAxios from '../hooks/useAxios'
import { useState,useEffect } from 'react'
interface LeaveDetailsFormatter{
  remaining_paid_leave : number
  remaining_casual_leave : number
  total_approved_leaves : number
  remaining_sick_leave : number
  remaining_unpaid_leave : number 
}
const LeavesDeatils : React.FC = () => {
    const [leaveDetails ,setLeaveDetails]= useState<LeaveDetailsFormatter[]>([])
    const axiosInstance = useAxios()
    useEffect(()=>{
        axiosInstance.get(`leave-details/`).then((res)=>{
            console.log("these is my result",res.data)
            setLeaveDetails(res.data);        
          }) 
    },[])
   
  return (
    <div style={{ marginLeft: "250px" }}> 
    <div style={{display:`flex`,float:`right`,alignItems:`center`}}>
    
       
    Total Approved Leaves  : <button type="button" className="btn btn-info">{leaveDetails.length>0 ? leaveDetails[0].total_approved_leaves : '-'}</button>
    Remaining Leaves : CL<button type="button" className="btn btn-info">{leaveDetails.length>0 ? leaveDetails[0]["remaining_casual_leave"] : '-'}</button> 
    PL<button type="button" className="btn btn-info">{leaveDetails.length>0 ? leaveDetails[0]["remaining_paid_leave"] : '-'}</button>
    SL<button type="button" className="btn btn-info">{leaveDetails.length>0 ? leaveDetails[0]["remaining_sick_leave"] : '-'}</button>
    UL<button type="button" className="btn btn-info">{leaveDetails.length>0 ? leaveDetails[0]["remaining_unpaid_leave"] : '-'}</button>   
    </div>
    <br></br> 
    </div>

    
  )
}

export default LeavesDeatils