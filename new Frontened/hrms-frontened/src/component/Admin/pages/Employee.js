import React, { useState, useEffect } from 'react';
import useAxios from '../../../hooks/useAxios';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../../utils/InputField';
import SelectField from '../../../utils/SelectField';
import Swal from 'sweetalert2';
import { Pagination } from '../../../hooks/usePaginationRange';
import { Link } from 'react-router-dom';
import { navbarTitle } from '../../../reducers/authReducer';
import { useDispatch } from 'react-redux';
const Updateemployee = () => {
  const [employee, setEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedemployee, setSelectedemployee] = useState(null);
  const [refresh,setRefresh]=useState(0)
  const axiosInstance = useAxios();

  const dispatch = useDispatch();
  dispatch(navbarTitle({ navTitle: "Employee" }));
 
  const [name,setName]= useState("")
  const rowsPerPage =5;

  const handlePageChange = (page)=>{
    setCurrentPage(page)
   }

   const handleNameChange=(event)=>{
    setName(event.target.value)
}
  const fetchAllEmployees=(page,name)=>{
    
    axiosInstance.get(`api/employees/`,{
      params:{
        page,
        name
      }
    }
    ).then((res) => {
      setEmployee(res.data["results"]);
      if (res.data.count === 0){
        setTotalPages(1);
      }
      else{
      setTotalPages(Math.ceil(res.data.count / rowsPerPage));
      }
    }); 
  }

  useEffect(() => {
    fetchAllEmployees(currentPage,name) 
  }, [refresh,currentPage,name]);

 

  const handleDelete = (employee) => { 
    setSelectedemployee(employee);
    setShowDeleteModal(true);
  };

 

  const handleDeleteSubmit = async () => {
    try {
      await axiosInstance.delete(`api/employees/${selectedemployee.id}/`);
      setShowDeleteModal(false);
      setRefresh(refresh+1)
      // setEmployee((prev) => prev.filter((employee) => employee.id !== selectedemployee.id));
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <div style={{ marginLeft: '260px' }}>
       <Button style={{float:`right`}}>
      <input type="text" onChange={handleNameChange} placeholder='Search Employee Name'></input>
    </Button>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">UserName</th>
            <th scope="col">First Name</th>
            <th scope="col">Email</th>
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {employee.length>0  && employee.map((employee) => (
            <tr key={employee.id}>
              <th scope="row">{employee.id}</th>
              <td>{employee.username}</td>
              <td>{employee.first_name}</td>
              <td>{employee.email}</td>
              <td>
              {<Link to={`/admin/employee/edit/${employee.id}`}>
                <Button>Update Employee Details</Button>
              </Link>}
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(employee)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
     
 <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this leave?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
      
   
  );
};

export default Updateemployee;
