import React from 'react'
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import InputField from '../../utils/InputField';
import useAxios from '../../hooks/useAxios';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./auth.css"
import axios from 'axios';

interface ChangePasswordValues{
    current_password : string
    new_password : string
    confirm_password : string
    api ?: string
 
}
interface ApiErrorResponse {
    old_password?: string;
    new_password?: string;
}
const validationSchema = Yup.object({
    current_password: Yup.string()
        .required('Password is required')
        ,
        new_password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
        confirm_password : Yup.string().oneOf([Yup.ref("new_password")],"New Password Must Match").required("ConFirm Password is Required")
    
    });

const ChangePassword :React.FC = () => {
    const axiosInstance = useAxios();    
    const navigate = useNavigate(); 
    const handleSubmit = async (values :ChangePasswordValues, { setSubmitting, setErrors } : FormikHelpers<ChangePasswordValues>) => {
        
        const { current_password, new_password,confirm_password} = values;
        try {          
            const result = await axiosInstance.put('api/change-password/', { current_password, new_password,confirm_password});
            const data = result.data;
      
            navigate('/dashboard')         
    
        } catch (err) {
            console.error("this is error i got ",err);   
            
            if (axios.isAxiosError(err) && err.response)   
            {
                const apiError = err.response.data as ApiErrorResponse;
                if (apiError.old_password) {
                    setErrors({ api: apiError.old_password });
                } else if(apiError.new_password) {
                    setErrors({  api: apiError.new_password });
                }
            }  
           
            else{
                setErrors({ api: 'Something went Wrong'});
            }    
          
        } finally {
            setSubmitting(false);
        }
    };
  return (
    <div className="forgetPassword">
    <Formik
        initialValues={{ current_password: '', new_password: '',confirm_password : '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
    >
        {({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
            <Form>
                <h3 className="Auth-form-title">Change Password</h3>
                {errors.api && <p className="text-danger">{errors.api}</p>}
                <InputField
                    label="Current Password"
                    type="text"
                    name="current_password"
                    value={values.current_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Current PassWord"
                    isInvalid={touched.current_password && !!errors.current_password}
                    error={errors.current_password}
                />
                <InputField
                    label="New PassWord"
                    type="text"
                    name="new_password"
                    value={values.new_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter New Password"
                    isInvalid={touched.new_password && !!errors.new_password}
                    error={errors.new_password}
                />
                 <InputField
                    label="Confirm PassWord"
                    type="text"
                    name="confirm_password"
                    value={values.confirm_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter New Password"
                    isInvalid={touched.confirm_password && !!errors.confirm_password}
                    error={errors.confirm_password}
                />
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    Submit
                </Button>
            </Form>
        )}
    </Formik>
    
    
     
    </div>
);
}

export default ChangePassword