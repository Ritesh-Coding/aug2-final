import React from 'react'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import InputField from '../../../utils/InputField';
import useAxios from '../../../hooks/useAxios';
import 'bootstrap/dist/css/bootstrap.css';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navbarTitle } from '../../../reducers/authReducer';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Pagination } from '../../../hooks/usePaginationRange';
const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required'),
        date: Yup.string().required('Date is required') , 
        holiday_image: Yup.mixed().required('Holiday Image is required'),
    });
const Holidays = () => {
    const axiosInstance = useAxios()
    const [holidays, setHolidays] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModel,setShowAddModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 1;
    const [totalPages, setTotalPages] = useState(1);
    const [refresh,setRefresh]= useState(0)
    const [name,setName] = useState("")
    const [myDate,setMyDate]=useState("")
    const [selectedHoliday,setSelectedHoliday]= useState("")
    const dispatch = useDispatch();
    dispatch(navbarTitle({ navTitle: "Holidays" }));

    const handleNameChange=(event)=>{
          setName(event.target.value)
    }
    const handleDateChange=(event)=>{
      console.log("dated changed",event.target.value)
      setMyDate(event.target.value)
    }

    const handlePageChange = (page)=>{
        setCurrentPage(page)
       }
    const handleHolidayAddSubmit = async (values, { setSubmitting, setErrors,setValues }) => {  
      console.log("this is my value",values)
       const formData = new FormData()      
       if (values.holiday_image && values.holiday_image instanceof File) {
        formData.append('holiday_image', values.holiday_image);   
      }
      if (values.date) formData.append('date', values.date);
        formData.append('date', values.date);
      if (values.name) formData.append('name', values.name);
        formData.append('name', values.name);
        
        try {          
            const result = await axiosInstance.post('api/holidays/',formData,{
              headers: {
                'Content-Type': 'multipart/form-data',
               },
            } );
            const data = result.data["results"];
          //   setValues({
          //     date: result.data.date,
          //     name: result.data.name,
          //     holiday_image: result.data.holiday_image,
              
          // });
            setShowAddModal(false)       

            Swal.fire('Success!', 'Holiday is Updated Successfully!', 'success');  
            setRefresh(refresh+1)           
        } catch (err) {         
            setErrors({ api: 'Something Went Wrong'});
        } finally {
            setSubmitting(false);
        }
    };
    const handleHolidayUpdateSubmit = async (values, { setSubmitting, setErrors }) => {        
      const formData = new FormData()      
      if (values.holiday_image && values.holiday_image instanceof File) {
       formData.append('holiday_image', values.holiday_image);   
     }
     if (values.date) formData.append('date', values.date);
       formData.append('date', values.date);
     if (values.name) formData.append('name', values.name);
       formData.append('name', values.name);


        try {          
            const result = await axiosInstance.put(`api/holidays/${selectedHoliday.id}/`, formData,{
              headers: {
                'Content-Type': 'multipart/form-data',
               },
            });
            const data = result.data;
            setShowUpdateModal(false)         
            Swal.fire('Success!', 'Holiday is Updated Successfully!', 'success');  
            setRefresh(refresh+1)           
        } catch (err) {         
            setErrors({ api: 'Something Went Wrong'});
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSubmit = async () => {       
        try {          
            const result = await axiosInstance.delete(`api/holidays/${selectedHoliday.id}/`);
            const data = result.data;
            setShowDeleteModal(false)         
            Swal.fire('Success!', 'Holiday is Deleted Successfully!', 'success');             
            setRefresh(refresh+1)
        } catch (err) {         
            console.log(err)
        }
    };
    const handleAddHoliday = ()=>{
        setShowAddModal(true)
    }
    const fetchHolidays =async (page,name,date)=>{
      const result = await  axiosInstance.get('/api/holidays',{
            params:{
                page,
                name,
                date,
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
    useEffect(() => {
         fetchHolidays(currentPage,name,myDate)
      }, [currentPage,refresh,name,myDate]);
    const handleUpdate = (holiday) => {
        setSelectedHoliday(holiday);
        setShowUpdateModal(true);
    };

    const handleDelete = (holiday) => {
        setSelectedHoliday(holiday);
        setShowDeleteModal(true);
    };
  return (
    <div style={{marginLeft:`260px`}}>
    <Button onClick={handleAddHoliday}> Add Holidays </Button>
    <Button style={{float:`right`}}>
      <input type="text" onChange={handleNameChange} placeholder='Search Holiday Name'></input>
    </Button>
    <Button style={{float:`right`}}>
    <input type="date" onChange={handleDateChange}></input>
    </Button>
  
    <Modal show={showAddModel} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Leave</Modal.Title>
        </Modal.Header>
        <Modal.Body>
       
     <Formik
        initialValues={{ name : '', date: '',holiday_image:''}}
        validationSchema={validationSchema}
        onSubmit={handleHolidayAddSubmit}
    >
        {({ values, setFieldValue,handleChange, handleBlur, isSubmitting, errors, touched }) => (
            <Form>
                <h3 className="Auth-form-title">Add Holidays</h3>
                {errors.api && <p className="text-danger">{errors.api}</p>}
                <InputField
                    label="Name"
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Holiday Name"
                    isInvalid={touched.name && !!errors.name}
                    error={errors.name}
                />
                <InputField
                    label="Date"
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Date"
                    isInvalid={touched.date && !!errors.date}
                    error={errors.date}
                />      
                <label>Holiday Image</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    name="holiday_image"
                    onChange={(event) => {
                    setFieldValue('holiday_image', event.currentTarget.files[0]);
                    }}
                    onBlur={handleBlur}
                    className={touched.holiday_image && errors.holiday_image ? 'is-invalid' : ''}
                                /> 
                {touched.holiday_image && errors.holiday_image && <div className="invalid-feedback">{errors.holiday_image}</div>}         
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    Submit
                </Button>
            </Form>
        )}
    </Formik>
         
    </Modal.Body>
    <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
        </Modal.Footer>
    </Modal>


    {/* update Modal */}
    <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>
       
     <Formik
        initialValues={{ name : `${selectedHoliday.name}`, date: `${selectedHoliday.date}` ,holiday_image : `${selectedHoliday.holiday_image}`}}
        validationSchema={validationSchema}
        onSubmit={handleHolidayUpdateSubmit}
    >
        {({ values,setFieldValue, handleChange, handleBlur, isSubmitting, errors, touched }) => (
            <Form>
                <h3 className="Auth-form-title">Update Holidays</h3>
                {errors.api && <p className="text-danger">{errors.api}</p>}
                <InputField
                    label="Name"
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Holiday Name"
                    isInvalid={touched.name && !!errors.name}
                    error={errors.name}
                />
                <InputField
                    label="Date"
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Date"
                    isInvalid={touched.date && !!errors.date}
                    error={errors.date}
                />         
                <label>Holiday Image</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    name="holiday_image"
                    onChange={(event) => {
                    setFieldValue('holiday_image', event.currentTarget.files[0]);
                    }}
                    onBlur={handleBlur}
                    className={touched.holiday_image && errors.holiday_image ? 'is-invalid' : ''}
                                />  
                    {touched.holiday_image && errors.holiday_image && <div className="invalid-feedback">{errors.holiday_image}</div>}      
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    Update
                </Button>
            </Form>
        )}
    </Formik>
         
    </Modal.Body>
    <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
        </Modal.Footer>
    </Modal>


    {/* Delete Modal */}
    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Holiday?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

    <table className="table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Name</th>            
            <th scope="col">Update</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {holidays.length > 0 ? (holidays.map((holiday) => (
            <tr key={holiday.id}>
              <th scope="row">{holiday.date}</th>
              <td>{holiday.name}</td>
              
              <td>
                <Button variant="primary" onClick={() => handleUpdate(holiday)}>
                  Update
                </Button>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(holiday)}>
                  Delete
                </Button>
              </td>
            </tr>)
          )): (
            <tr>
            <td colSpan="5">No holiday data available</td>
          </tr>
          )}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    
     
    </div>
  )
}

export default Holidays