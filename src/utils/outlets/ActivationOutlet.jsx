import { Navigate, Outlet } from "react-router-dom";

const ActivationOutlet = () => {
  const token =localStorage.getItem('token')
  let isExpired = false;

  if (token) {
    const expireTime = JSON.parse(window.atob(token.split(".")[1])).exp;

    if (Date.now() >= expireTime * 1000) {
      isExpired = true;
    }
  }

  // console.log(user?.token)

  return !token || isExpired ? (
    <Navigate to="/activation" />
  ) : (
    <Outlet />
  );
};

export default ActivationOutlet;
