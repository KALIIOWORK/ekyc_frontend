import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const ProctectedRoute = () => {
    const isLoggedIn = useSelector(state => {
        return state.auth.isLoggedIn
    })
    return (
        isLoggedIn ? <Outlet /> : <Navigate to="/" />
    )
}

export default ProctectedRoute