import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import InputField from '../../../utils/InputField';
import useAxios from '../../../hooks/useAxios';
import SelectField from '../../../utils/SelectField';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import axios from 'axios';

const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required'),
    first_name: Yup.string()
        .required('First Name is required')
        .min(3, 'FirstName must be at least 3 characters'),
    last_name: Yup.string()
        .required('Last Name is required')
        .min(3, 'LastName must be at least 3 characters'),
    email: Yup.string().email()
        .required('Email is required'),
    dob: Yup.string()
        .required('Date Of Birth is required'),
    phone_number: Yup.string()
        .required('Phone No is required'),
    gender: Yup.string().required("Gender is required")
});

const validationDocumentsSchema = Yup.object({
    aadhar_card: Yup.string()
        .length(12, 'Aadhar Card number must be 12 digits')
        .required('Aadhar Card number is required'),
    aadhar_image: Yup.mixed().required('Aadhar Image is required'),
    pan_card: Yup.string()
    .length(10, 'Pan Card number must be 10 digits')
});

const UpdateEmployee = () => {
    const axiosInstance = useAxios();
    const { userId } = useSelector(state => state.auth)
    const [basicDetails, setBasicDetails] = useState(null)
    const [update,setUpdate] = useState(false)
    const [employeeDocuments, setEmployeeDocuments] = useState(null)
    const [employeeRelations, setEmployeeRelations] = useState(null)
    const id = window.location.pathname.split('/')[4] 
    console.log("This is the id ",id)
    // const BASE_URL = 'http://localhost:8000/media/';
    useEffect(() => {
        axiosInstance.get(`api/employees/${id}/`).then(
            (res) => { setBasicDetails(res.data) }      
        )

        axiosInstance.get(`employeeDocuments?id=${id}`).then(
                (res) => { setEmployeeDocuments(res.data) }
        )

        axiosInstance.get(`companyRelations?id=${id}`).then(
            (res) => { setEmployeeRelations(res.data) }
    )
 
        
    }, [])
    console.log("this is my data",employeeDocuments)
    console.log("this is my relations dATA",employeeRelations)
    const genderTypes = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
    ];

    const handleSubmit = async (values, { setSubmitting, setErrors,setValues }) => {
        try {
            const result = await axiosInstance.patch(`api/employees/${basicDetails.id}/`, values);
            const data = result.data;
            setBasicDetails(data)
            setValues({
                username: data.username,
                first_name:  data.first_name,
                last_name: data.last_name ,
                email: data.email,
                dob: data.dob ,
                phone_number: data.phone_number,
                address: data.address,
                bio:data.bio ,
                gender:  data.gender
            })
            Swal.fire('Success!', 'Basic Details is Updated Successfully!', 'success');
           
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.username) {
                setErrors({ api: err.response.data.username });
            } else {
                setErrors({ api: 'Something Went Wrong' });
            }
        } finally {
            setSubmitting(false);
        }
    };


    const handleDocumentsSubmit = async (values, { setSubmitting, setErrors,setValues }) => {
        const formData = new FormData();

        if (values.pan_card) formData.append('pan_card', values.pan_card);
        formData.append('aadhar_card', values.aadhar_card);

        
        if (values.pan_image && values.pan_image instanceof File) {
            formData.append('pan_image', values.pan_image);
        }


        if (values.aadhar_image && values.aadhar_image instanceof File) {
            formData.append('aadhar_image', values.aadhar_image);   
        }

        try {
            if (employeeDocuments.length===0){
              const response =  await axiosInstance.post(`/employeeDocuments/?id=${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setEmployeeDocuments([response.data])
                setValues({
                    pan_card: response.data.pan_card,
                    aadhar_card: response.data.aadhar_card,
                    pan_image: response.data.pan_image,
                    aadhar_image: response.data.aadhar_image,
                });
            }
            else{
               const response = await axiosInstance.patch(`/employeeDocuments/${employeeDocuments[0]["id"]}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setEmployeeDocuments([response.data])
                setValues({
                    pan_card: response.data.pan_card,
                    aadhar_card: response.data.aadhar_card,
                    pan_image: response.data.pan_image,
                    aadhar_image: response.data.aadhar_image,
                });
            }
            
            Swal.fire('Success!', 'Documents  Updated Successfully!', 'success');
           
           
        } catch (error) {
            console.error('Error:', error);
            setErrors({ api: 'Failed to submit documents' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleRelationsSubmit = async (values, { setSubmitting, setErrors ,setValues}) => {
        console.log("this is all my values", values);
        try {
            if (employeeRelations.length === 0) {
             const data = await axiosInstance.post(`/companyRelations/?id=${id}`, values);
             setEmployeeRelations([data])
              setValues({
                designation: data.designation,
                department: data.department,
                batch: data.batch ,
                joining_date: data.joining_date,
                probation_end_date : data.probation_end_date,
                work_duration : data.work_duration,
              })
            } else {
                console.log("relations update", `/companyRelations/${employeeRelations[0]["id"]}/`);
              const data = await axiosInstance.patch(`/companyRelations/${employeeRelations[0]["id"]}/`, values);
              setEmployeeRelations([data])
              setValues({
                designation: data.designation,
                department: data.department,
                batch: data.batch ,
                joining_date: data.joining_date,
                probation_end_date : data.probation_end_date,
                work_duration : data.work_duration,
              })
            }
            Swal.fire('Success!', 'Relations Updated Successfully!', 'success');
            
        } catch (error) {
            console.error('Error:', error);
            setErrors({ api: 'Failed to Update Relations' });
        } finally {
            setSubmitting(false);
        }
    };
   
    
    return (
        <div style={{ marginLeft: "260px", display: "flex" }}>
            <div style={{ width: `50%` }}>
                
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    {basicDetails && <Formik
                        initialValues={{
                            username: basicDetails.username || '',
                            first_name: basicDetails.first_name || '',
                            last_name: basicDetails.last_name || '',
                            email: basicDetails.email || '',
                            dob: basicDetails.dob || '',
                            phone_number: basicDetails.phone_number || '',
                            address: basicDetails.address || '',
                            bio: basicDetails.bio || '',
                            gender: basicDetails.gender || ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
                            <Form>
                                <h3 className="Auth-form-title">Basic Information</h3>
                                {errors.api && <p className="text-danger">{errors.api}</p>}
                                <InputField
                                    label="Username"
                                    type="text"
                                    name="username"
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter UserName"
                                    isInvalid={touched.username && !!errors.username}
                                    error={errors.username}
                                />
                                <InputField
                                    label="First Name"
                                    type="text"
                                    name="first_name"
                                    value={values.first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter First Name"
                                    isInvalid={touched.first_name && !!errors.first_name}
                                    error={errors.first_name}
                                />
                                <InputField
                                    label="Last Name"
                                    type="text"
                                    name="last_name"
                                    value={values.last_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter LastName"
                                    isInvalid={touched.last_name && !!errors.last_name}
                                    error={errors.last_name}
                                />
                                <InputField
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Your Email"
                                    isInvalid={touched.email && !!errors.email}
                                    error={errors.email}
                                />
                                <InputField
                                    label="Date Of Birth"
                                    type="date"
                                    name="dob"
                                    value={values.dob}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Date Of Birth"
                                    isInvalid={touched.dob && !!errors.dob}
                                    error={errors.dob}
                                />
                                <InputField
                                    label="Phone No"
                                    type="text"
                                    name="phone_number"
                                    value={values.phone_number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Your Phone"
                                    isInvalid={touched.phone_number && !!errors.phone_number}
                                    error={errors.phone_number}
                                />
                                <InputField
                                    label="Address"
                                    type="text"
                                    name="address"
                                    value={values.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Your Address"
                                    isInvalid={touched.address && !!errors.address}
                                    error={errors.address}
                                />
                                <InputField
                                    label="Bio"
                                    type="text"
                                    name="bio"
                                    value={values.bio}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Your Bio"
                                    isInvalid={touched.bio && !!errors.bio}
                                    error={errors.bio}
                                />
                                <SelectField
                                    label="Gender"
                                    name="gender"
                                    value={values.gender}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    options={genderTypes}
                                    isInvalid={touched.gender && !!errors.gender}
                                    error={errors.gender}
                                />
                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    Update
                                </Button>
                            </Form>
                        )}
                    </Formik>}
                </div>
            </div>
            <div style={{ width: `50%`  }}>
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    {employeeDocuments && <Formik
                        initialValues={{                       
                            pan_card: employeeDocuments.length > 0 ?  employeeDocuments[0]["pan_card"] : "",
                            aadhar_card: employeeDocuments.length > 0 ?  employeeDocuments[0]["aadhar_card"] : '',
                            pan_image:  employeeDocuments.length > 0 ?  employeeDocuments[0]["pan_image"] : '',
                            aadhar_image: employeeDocuments.length > 0 ?  employeeDocuments[0]["aadhar_image"] :'',
                        }}
                        validationSchema={validationDocumentsSchema}
                        onSubmit={handleDocumentsSubmit}
                    >
                        {({ values, setFieldValue, handleChange, handleBlur, isSubmitting, errors, touched }) => (
                            <Form>
                                <h3 className="Auth-form-title">Employee Documents</h3>
                                {errors.api && <p className="text-danger">{errors.api}</p>}
                                <InputField
                                    label="PAN Card No"
                                    type="text"
                                    name="pan_card"
                                    value={values.pan_card}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter PAN Card Number"
                                    isInvalid={touched.pan_card && !!errors.pan_card}
                                    error={errors.pan_card}
                                />
                                <InputField
                                    label="Aadhar Card No"
                                    type="text"
                                    name="aadhar_card"
                                    value={values.aadhar_card}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter 12-digit Aadhar Card Number"
                                    isInvalid={touched.aadhar_card && !!errors.aadhar_card}
                                    error={errors.aadhar_card}
                                />
                                <label>Pan Image</label>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    name="pan_image"
                                    onChange={(event) => {
                                        setFieldValue('pan_image', event.currentTarget.files[0]);
                                    }}
                                    onBlur={handleBlur}
                                    className={touched.pan_image && errors.pan_image ? 'is-invalid' : ''}
                                />
                                {touched.pan_image && errors.pan_image && <div className="invalid-feedback">{errors.pan_image}</div>}
                                {values.pan_image && !(values.pan_image instanceof File) && (
                                    <img src={`http://localhost:8000${values.pan_image}`} alt="Pan" style={{ width: '100px', height: '100px' }} />
                                )}
                                <br></br>
                                <br></br>
                                <label>Aadhar Image</label>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    name="aadhar_image"
                                    onChange={(event) => {
                                        setFieldValue('aadhar_image', event.currentTarget.files[0]);
                                    }}
                                    onBlur={handleBlur}
                                    className={touched.aadhar_image && errors.aadhar_image ? 'is-invalid' : ''}
                                />
                                
                                {touched.aadhar_image && errors.aadhar_image && <div className="invalid-feedback">{errors.aadhar_image}</div>}
                                {values.aadhar_image && (
                                    <img src={`http://localhost:8000/${values.aadhar_image}`} alt="Aadhar" style={{ width: '100px', height: '100px' }} />
                                )}
                                <br></br>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    Update
                                </Button>
                            </Form>
                        )}
                    </Formik>}
                </div>
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                {employeeRelations && <Formik
                        initialValues={{                       
                            designation: employeeRelations.length > 0 ?  employeeRelations[0]["designation"] : "",
                            department: employeeRelations.length > 0 ?  employeeRelations[0]["department"] : '',
                            batch:  employeeRelations.length > 0 ?  employeeRelations[0]["batch"] : '',
                            joining_date: employeeRelations.length > 0 ?  employeeRelations[0]["joining_date"] :'',
                            probation_end_date : employeeRelations.length > 0 ?  employeeRelations[0]["probation_end_date"] :'',
                            work_duration : employeeRelations.length > 0 ?  employeeRelations[0]["work_duration"] :'',
                        }}
                       
                        onSubmit={handleRelationsSubmit}
                    >
                        {({ values, setFieldValue, handleChange, handleBlur, isSubmitting, errors, touched }) => (
                            <Form>
                                <h3 className="Auth-form-title">Company Relations</h3>
                                {errors.api && <p className="text-danger">{errors.api}</p>}
                                <InputField
                                    label="Designation"
                                    type="text"
                                    name="designation"
                                    value={values.designation}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Employee Designation"
                                    isInvalid={touched.designation && !!errors.designation}
                                    error={errors.designation}
                                />
                                <InputField
                                    label="Department"
                                    type="text"
                                    name="department"
                                    value={values.department}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Employee Department"
                                    isInvalid={touched.department && !!errors.department}
                                    error={errors.department}
                                />
                                <InputField
                                    label="Batch"
                                    type="number"
                                    name="batch"
                                    value={values.batch}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Employee Batch"
                                    isInvalid={touched.batch && !!errors.batch}
                                    error={errors.batch}
                                />
                                <InputField
                                    label="Joining Date"
                                    type="date"
                                    name="joining_date"
                                    value={values.joining_date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Joining Date"
                                    isInvalid={touched.joining_date && !!errors.joining_date}
                                    error={errors.joining_date}
                                />
                                <InputField
                                    label="Probation End Date"
                                    type="date"
                                    name="probation_end_date"
                                    value={values.probation_end_date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Probaiton Date"
                                    isInvalid={touched.probation_end_date && !!errors.probation_end_date}
                                    error={errors.probation_end_date}
                                />
                                <InputField
                                    label="Work Duration"
                                    type="text"
                                    name="work_duration"
                                    value={values.work_duration}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Probaiton Date"
                                    isInvalid={touched.work_duration && !!errors.work_duration}
                                    error={errors.work_duration}
                                />
                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    Update
                                </Button>
                            </Form>
                        )}
                    </Formik>}
                </div>
            </div>
        </div>
    )
}

export default UpdateEmployee;