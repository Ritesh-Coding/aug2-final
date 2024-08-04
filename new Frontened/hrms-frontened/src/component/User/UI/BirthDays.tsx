import React from 'react'
import useAxios from '../../../hooks/useAxios';
import { useState,useEffect } from 'react';
import CustomSpecialDaysPagination from '../../../hooks/useCustomSpecialDaysPagination';
interface BirthDayFormatter{
    id:number
    dob:string
    first_name : string
    last_name : string
    profile : string
}
const BirthDays : React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 1;
    const [totalPages, setTotalPages] = useState(1);
    const axiosInstance = useAxios()
    const [birthdays,setBirthDays]= useState<BirthDayFormatter[]>([])
    const handlePageChange = (page : number)=>{
        setCurrentPage(page)
    }
    const showbirthdays=async (page: number)=>{
      const result =await  axiosInstance.get('api/birthdays/',{
            params:{
            page
            }
        })
        console.log(result.data["results"],"<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>")
        if (result.data.count === 0){
            setTotalPages(1);
          }
          else{
          console.log("total count page",Math.ceil(result.data.count / rowsPerPage))
          setTotalPages(Math.ceil(result.data.count / rowsPerPage));
          }       
        setBirthDays(result.data["results"])       
    }
    useEffect( ()=>{
        showbirthdays(currentPage)
    },[currentPage])
  return (
    <div style={{marginLeft:`100px`}}>
        
        <div className="card" style={{width:`260px`}}>
        <div style={{display:`flex`}}>
        <h3>BirthDays</h3>
        <div style={{float:`right`,width:`60px` ,marginLeft:`25px`}} >
        <CustomSpecialDaysPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /> 
        </div> 
        </div>        
        {
            birthdays.length >0 ? (birthdays.map((birthday)=>(
                <div key={birthday.id}>
                <img className="card-img-top" src={birthday.profile} alt="BirthDay Image" width="260px" height="150px"/> 
              
                <div className="card-body">
                    <pre>{birthday.dob}</pre>
                    <pre className="card-text">{birthday.first_name}  {birthday.last_name}</pre>
                </div>
                </div>
            ))) : (
                <h5>No BirthDay Available</h5>
            )
        }
       
        </div>
    </div>
  )
}

export default BirthDays