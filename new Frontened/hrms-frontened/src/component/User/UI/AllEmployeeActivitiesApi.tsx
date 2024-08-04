import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import useAxios from '../../../hooks/useAxios';
import EmployeeActivities from './EmployeeActivities';
interface AllEmployeeActivityProps{
  refresh : number
  inputValue : string
}
interface EmployeeActivitiesData {
  index: number;
  first_name: string;
  status: string;
  status_time: string;
}
const AllEmployeeActivities : React.FC<AllEmployeeActivityProps> = ({refresh,inputValue}) => {
    const [employeeData,setData]= useState<EmployeeActivitiesData[]>([])   
    
    const axiosInstance = useAxios();
    let query = inputValue.trim() !== '' ? `?search=${inputValue}` : '';

    useEffect(()=>{       
        axiosInstance.get(`/todayEmployeeActivity${query}/`).then((res) => {        
        setData(res.data)        
        })
    },[refresh,query])       

  const employeeActivities =  (
  employeeData.map((item,index) => (
    <EmployeeActivities
      key={item.index}
      firstName={item.first_name}
      status={item.status}
      statusTime={item.status_time}         
    />
  ) ) 
  ) 

  return (
    <>
      {employeeActivities}   
    </> 
  )
}

export default AllEmployeeActivities