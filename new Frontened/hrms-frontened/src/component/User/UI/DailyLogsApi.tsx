import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import useAxios from '../../../hooks/useAxios';

import DailyLogs from './DailyLogs';
interface Break {
  breakIn: string;
  breakOut: string;
}
interface DailyLogsFormat{
  index : number
  checkIn : string
  checkOut : string
  breaks : Break[]
}
interface DailyLogProps{
  status : string
}
const DailyLogsApi : React.FC<DailyLogProps>= ({status}) => {
    const [log,setLog]= useState<DailyLogsFormat[]>([])
   
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