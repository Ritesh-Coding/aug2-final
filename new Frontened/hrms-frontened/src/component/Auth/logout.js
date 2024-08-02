import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../reducers/authReducer";

const Logout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logout());
        localStorage.clear();
        navigate('/login');
    }, [dispatch, navigate]);

    return null;
};

export default Logout;
