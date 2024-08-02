import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputField from '../../utils/InputField';
import useAxios from '../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
const nameRegex = /^[a-zA-Z\s-]+$/;
const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(3, 'Password must be at least 3 characters'),
    first_name : Yup.string().required("FirstName is Required").matches(nameRegex, 'Name is not valid'),
    last_name : Yup.string().required("LastName is Required").matches(nameRegex, 'Name is not valid'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is Required'),
    confirmPassword : Yup.string().oneOf([Yup.ref("password"),null],"Password Must Match").required("ConFirm Password is Required")
    
});
const Register = () => {
    const axiosInstance = useAxios();    
    const navigate = useNavigate();  
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        
        const { username, password,first_name,last_name,email } = values;
        try {
          
            const result = await axiosInstance.post('api/register/', { username, password,first_name,last_name,email});
            const data = result.data;
            console.log(data)
            navigate('/login')         
    
        } catch (err) {
            console.error(err);
            setErrors({ api: 'UserName Already Exist.'});
        } finally {
            setSubmitting(false);
        }
    };
  return (
    <>  
    <Formik
            initialValues={{ username: '',first_name: '',last_name : '',email:'',password: '',confirmPassword: ''}}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
                <Form>
                    <h3 className="Auth-form-title">Registration</h3>
                    {errors.api && <p className="text-danger">{errors.api}</p>}
                    <InputField
                        label="First Name"
                        type="text"
                        name="first_name"
                        value={values.first_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="First Name"
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
                        placeholder="Last Name"
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
                        placeholder="Enter Email"
                        isInvalid={touched.email && !!errors.email}
                        error={errors.email}
                    /> 
                    <InputField
                        label="Username"
                        type="text"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter Username"
                        isInvalid={touched.username && !!errors.username}
                        error={errors.username}
                    />                    
                    <InputField
                        label="Password"
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter Password"
                        isInvalid={touched.password && !!errors.password}
                        error={errors.password}
                    />
                     <InputField
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Confirm Your Password"
                        isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                        error={errors.confirmPassword}
                    />
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        Submit
                    </Button>

                </Form>
            )}
        </Formik>
        <span>Already Have an Account? <Link to='/login'>Click Here</Link></span>
              
        </>       
  )
}

export default Register