import Loading from '../components/Loading'
import { Navigate } from 'react-router-dom'
import { useIsAuth } from "../hooks/useIsAuth"


export function RequireAuth({ children }) {
    const [isAuth, isLoading] = useIsAuth()
    return isLoading ? <Loading /> : (isAuth ? children : <Navigate to="/login" />)
}

export function RequireNotAuth({ children }) {
    const [isAuth, isLoading] = useIsAuth()
    return isLoading ? <Loading /> : (isAuth ? <Navigate to="/" /> : children)
}
