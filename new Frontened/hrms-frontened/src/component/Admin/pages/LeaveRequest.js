import React from "react";
import { useDispatch } from "react-redux";
import { navbarTitle } from "../../../reducers/authReducer";
import { useEffect , useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { Button } from "react-bootstrap";
  import Modal from 'react-bootstrap/Modal';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from "../../../utils/InputField";
import Swal from 'sweetalert2';
import SelectField from '../../../utils/SelectField';
import { Link } from 'react-router-dom';
// import Modal from "@material-ui/core/Modal";
import { Pagination } from "../../../hooks/usePaginationRange";


const validationSchema = Yup.object({
  date: Yup.string().required('Date is required'),
  reason: Yup.string().required('Reason is required'),
  type: Yup.string().required('Type is required'),
  leave_day_type: Yup.string().required('Leave day type is required')
});

const LeaveRequest = () => {
  const dispatch = useDispatch();
  const [leaveData,setLeaveData] = useState([])
  const [update,setUpdate]=useState(false)  
  const rowsPerPage = 5;
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [name,setName] = useState("")
  const [date,setDate]= useState("")
  const axiosInstance  =  useAxios();
  const [notification,setNotification] = useState([])
  
  dispatch(navbarTitle({ navTitle: "Leaves" }));
  const handlePageChange = (page)=>{
    setCurrentPage(page)
   }
  const fetchLeavesData=async(page,name,date)=>{

   
   const result =await  axiosInstance.get(`all-leaves/?status=Pending`,{
      params:{
        page,
        name,
        date
      }
    })
    if (result.data.count === 0){
    setTotalPages(1);
  }
  else{
  console.log("total count page",Math.ceil(result.data.count / rowsPerPage))
  setTotalPages(Math.ceil(result.data.count / rowsPerPage));
  }
  setLeaveData(result.data["results"])
    
   }
  useEffect(()=>{
    fetchLeavesData(currentPage,name,date)
},[update,currentPage,name,date])

  const approveRequest = (id,userId)=>{
    console.log("Leave Request is approved")
    Swal.fire({title: 'Confirm Approve',showCancelButton: true,confirmButtonText: 'Yes',denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          axiosInstance.put(`update-leave-status/${id}/`,{"status":"Approved"}).then((res)=>{
            setUpdate(true)
            console.log("Leave request is applied successfuly...")  
           })} }).then(           
            axiosInstance.post(`notification/?id=${userId}`,{"message" : "Leave Request Approved"})
           ) 
  }
  const deleteRequest = (id,userId)=>{
    console.log("Leave Request is deleted")
    Swal.fire({title: 'Confirm Delete',showCancelButton: true,confirmButtonText: 'Yes',denyButtonText: 'No',
}).then((result) => {
  if (result.isConfirmed) {
    axiosInstance.put(`update-leave-status/${id}/`,{"status":"Rejected"}).then((res)=>{
    setUpdate(true)
      console.log("Leave request is applied successfuly...")  
     })} }).then(           
      axiosInstance.post(`notification/?id=${userId}`,{"message" : "Leave Request Rejected"})
     ) 
    
  }
  const handleDateChange=(event)=>{
    setDate(event.target.value)
  }
  const handleNameChange=(event)=>{
      setName(event.target.value)
  }
  return (
    <>
    <div style={{ marginLeft: "250px" }}>  
    <Link to="/admin/all-leave">

    <Button variant="primary">
          All Leaves
    </Button>
    
    </Link>  
    <Link to="/admin/assign-leave">
    <Button variant="primary">
          Assign Leaves
    </Button>    
    </Link>  
    <div style={{float:`right`}}>
        <Button>
        <input type="date" id="date" onChange={handleDateChange}></input>
        </Button>
      
        
    </div>
    <Button style={{float:`right`}}>
    <input type="text" onChange={handleNameChange} placeholder='Filter With Name'></input>
    </Button>

      <table class="table">
        <thead>
          <tr>
           <th scope="col">Id</th>
            <th scope="col">FirstName</th>
            <th scope="col">LastName</th>
            <th scope="col">Status</th>
            <th scope="col">Date</th>
            <th scope="col">Type</th>
            <th scope="col">Leave Day Type</th>   
            <th scope="col">Reason</th>  
            <th scope="col">Action</th>      
          </tr>
        </thead>
        <tbody>
        
        {leaveData.length>0 ? leaveData.map((leave,index)=>((
        <tr key = {index}>    
          <th scope="row">{leave.user_id}</th>  
          <th scope="row">{leave.first_name}</th>   
          <th scope="row">{leave.last_name}</th>    
          <td>{leave.status}</td>    
          <td>{leave.date}</td>
          <td>{leave.type}</td>
          <td>{leave.leave_day_type}</td>
          <td>{leave.reason}</td>
          <td><Button onClick={()=>{approveRequest(leave.id,leave.user_id)}}>Accept</Button ><Button  onClick={()=>{deleteRequest(leave.id,leave.user_id)}}>Rejected</Button></td>     
      </tr>
  ))):(
    <tr>
    <td colSpan="5">No holiday data available</td>
  </tr>
  )}  
         
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
    </>
  );
};

export default LeaveRequest;
