
import React, { useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import InputField from '../../utils/InputField';
import useAxios from '../../hooks/useAxios';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../reducers/authReducer';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import hrms from "../../assets/hrms.png"

const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(3, 'Password must be at least 3 characters'),
});

const LoginUser = () => {
    const axiosInstance = useAxios();
    const dispatch = useDispatch();
    const navigate = useNavigate();    
    console.log("i am inside the login ")

    const { isAuthenticated, role } = useSelector(state => state.auth);
    useEffect(()=>{
        if ( isAuthenticated && role === 'admin') {
            navigate('/dashboard');
        } 
        if(isAuthenticated && role === 'user') {
            console.log("i am inside the auth")       
             navigate('/');
             
        }   

    })

   

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        
        const { username, password } = values;
        try {
            const result = await axiosInstance.post('api/login/', { username, password });
            const data = result.data;            
            dispatch(
                loginSuccess({
                    user: { username },
                    accessToken: data.access,
                    refreshToken: data.refresh,
                    role: data.role,
                    userId:data.userId,
                    firstName:data.firstName,
                    lastName:data.lastName
                })
            );     
            localStorage.setItem("access_token",data.access)      
            // Redirect based on role
            if (data.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setErrors({ api: 'Invalid credentials, please try again.' });
        } finally {
            setSubmitting(false);
        }
    };
  
    return (
        <div id='loginContainer'>
         <Card style={{ width: '20rem',alignItems:'center',position:`fixed`}}>
         <Card.Img variant="top" src={hrms} style={{width:'85px'}}/>
         <Card.Body >
         <h2 style={{ alignItems:'center',textAlign:'center' }}>Login</h2>
         <div >
         <Formik 
            initialValues={{ username: '', password: '' }}
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
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter Password"
                        isInvalid={touched.password && !!errors.password}
                        error={errors.password}
                    />
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
         </div>
         
            <span>Forget Password ?<Link to='/forgetpassword'>Click Here</Link></span>
            </Card.Body>
         </Card>
        
                               
        
         
        </div>
    );
};

export default LoginUser;
