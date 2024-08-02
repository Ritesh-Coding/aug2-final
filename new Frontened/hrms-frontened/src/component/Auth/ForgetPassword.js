import React from 'react'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import InputField from '../../utils/InputField';
import useAxios from '../../hooks/useAxios';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import hrms from "../../assets/hrms.png"
const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    new_password: Yup.string()
        .required('Password is required')
        .min(3, 'Password must be at least 3 characters'),
    confirm_password : Yup.string().oneOf([Yup.ref("new_password"),null],"New Password Must Match").required("ConFirm Password is Required")
    
});
const ForgetPassword = () => {
    const axiosInstance = useAxios();

    const navigate = useNavigate();    

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        
        const { username, new_password } = values;
        try {
            const result = await axiosInstance.post('api/forgetpassword/', { username, new_password });
            const data = result.data;    
            console.log(typeof(data))        
            alert(JSON.stringify(data.message,null))      
            navigate('/login')  
            
        } catch (err) {
            console.error(err);
            setErrors({ api: 'UserName Does Not Exist' });
        } finally {
            setSubmitting(false);
        }
    };
   
    return (
        <div id='forgetPasswordContainer'>
        <Card style={{ width: '18rem',alignItems:'center' }}>
         <Card.Img variant="top" src={hrms} style={{width:'85px'}}/>
         <Card.Body>
         <h2 style={{ alignItems:'center',textAlign:'center' }}>Forget Password</h2>
         <Formik
            initialValues={{ username: '', new_password: '',confirm_password : ''}}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
                <Form>
                   
                    {errors.api && <p className="text-danger">{errors.api}</p>}
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
                        name="new_password"
                        value={values.new_password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter New Password"
                        isInvalid={touched.new_password && !!errors.new_password}
                        error={errors.new_password}
                    />
                     <InputField
                        label="Confirm Password"
                        type="password"
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
        <span>Login Here <Link to='/login'>Click Here</Link></span>
         </Card.Body>
         </Card>
        
        
         
        </div>
    );
}

export default ForgetPassword