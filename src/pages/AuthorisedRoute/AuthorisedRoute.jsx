import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const AuthorisedRoute = ({ roles }) => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const role = useSelector(state => state.auth.role);
    //console.log("Role:", role);
    if (!isLoggedIn) {
        // If the user is not logged in, redirect to the login page
        return <Navigate to="/" />;
    } else if (!roles.includes(role)) {
        // If the user is logged in but does not have the required role, redirect to the unauthorized page
        return <Navigate to="/unauthorized" />;
    } else {
        // If the user is logged in and has the required role, display the protected route
        return <Outlet />;
    }

};
