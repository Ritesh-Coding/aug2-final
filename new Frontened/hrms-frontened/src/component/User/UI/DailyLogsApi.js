import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import useAxios from '../../../hooks/useAxios';
import EmployeeActivities from './EmployeeActivities';
import DailyLogs from './DailyLogs';
const DailyLogsApi = ({status}) => {
    const [log,setLog]= useState([])
   
    const axiosInstance = useAxios(); 

    useEffect(()=>{       
      axiosInstance.get("/employeeDailyLogs/").then((res) => {        
        setLog(res.data)
        })
    },[status])       
   console.log("this is the daily logs",log)
    const dailyLogs = (
        log.map((item,index)=>(
        <DailyLogs
        key = {item.index}
        checkIn = {item.checkIn}
        checkOut = {item.checkOut}
        breaks={item.breaks}
        />)));
    

  return (
    <>
      {dailyLogs}
    </> 
  )
}

export default DailyLogsApi